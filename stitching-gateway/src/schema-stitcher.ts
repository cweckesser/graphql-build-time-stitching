import { Transform } from '@graphql-tools/delegate';
import { JsonFileLoader } from '@graphql-tools/json-file-loader';
import { loadSchema } from '@graphql-tools/load';
import { stitchSchemas } from '@graphql-tools/stitch';
import { RenameTypes, WrapType } from '@graphql-tools/wrap';
import { createBundle, getGraphQLSchemaFromBundle } from '@omnigraph/openapi';
import { printSchema } from 'graphql';
import superagent from 'superagent';

import { createDirectory, isPathAccessible, readFile, writeFile } from './utils';

const graphQLServicePort = process.env.GRAPHQL_SERVICE_PORT;
const openAPIServicePort = process.env.OPEN_API_SERVICE_PORT;
const openAPIBaseUrl = `http://localhost:${openAPIServicePort}`;

(async () => {
	// Create necessary folders
	const schemasFolderPath = `${__dirname}/../graphql/schemas`;
	const isSchemasFolderCreated = await isPathAccessible(schemasFolderPath);
	if (!isSchemasFolderCreated) {
		await createDirectory(schemasFolderPath);
	}

	// Processing GraphQL schema
	const graphQLServiceIntrospectionQuery = await readFile(
		`${__dirname}/../graphql/queries/introspection-query.graphql`,
	);
	const graphQLServiceIntrospectionResponse = await superagent
		.get(`http://localhost:${graphQLServicePort}/graphql`)
		.set('content-type', 'application/graphql')
		.send(graphQLServiceIntrospectionQuery);
	const graphQLServiceSchemaFile = `${schemasFolderPath}/graphql-service-schema.json`;
	await writeFile(
		graphQLServiceSchemaFile,
		JSON.stringify(graphQLServiceIntrospectionResponse.body),
	);

	const graphQLSchema = await loadSchema(graphQLServiceSchemaFile, {
		loaders: [new JsonFileLoader()],
	});

	// Processing OpenAPI schema
	const openAPIServiceIntrospectionResponse = await superagent.get(
		`${openAPIBaseUrl}/spec`,
	);
	const openAPIServiceSchemaFile = `${schemasFolderPath}/open-api-service-schema.json`;
	await writeFile(
		openAPIServiceSchemaFile,
		JSON.stringify(openAPIServiceIntrospectionResponse.body),
	);

	const openAPIBundle = await createBundle('OpenAPI Service', {
		cwd: './',
		oasFilePath: openAPIServiceSchemaFile,
		baseUrl: openAPIBaseUrl,
	});
	const openApiSchema = await getGraphQLSchemaFromBundle(openAPIBundle);

	// Stitching schemas together
	const schema = stitchSchemas({
		subschemas: [
			{
				schema: graphQLSchema,
				transforms: buildTransforms('GraphQLService'),
			},
			{
				schema: openApiSchema,
				transforms: buildTransforms('OpenAPIService'),
			},
		],
	});
	const stitchedSchemasFile = `${schemasFolderPath}/stitched-schemas.graphql`;
	await writeFile(stitchedSchemasFile, printSchema(schema));
})();

function buildTransforms(integrationType: string): Transform[] {
	return [
		new WrapType('Query', `${integrationType}Query`, integrationType),
		new RenameTypes(
			(name) =>
				`${integrationType}_${
					name.startsWith(integrationType)
						? name.substring(integrationType.length)
						: name
				}`,
		),
	];
}
