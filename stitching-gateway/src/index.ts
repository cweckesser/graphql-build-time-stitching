import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchema } from '@graphql-tools/load';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';

const port = process.env.STITCHING_GATEWAY_PORT;

(async () => {
	// GraphQL initialization

	const typeDefs = await loadSchema(
		`${__dirname}/../graphql/schemas/stitched-schemas.graphql`,
		{
			loaders: [new GraphQLFileLoader()],
		},
	);

	const schema = await makeExecutableSchema({
		typeDefs,
		resolvers: {
			Query: {
				GraphQLService: {
					people: () => [],
				},
			},
		},
	});

	// Service initialization

	const app = express();

	app.use(
		'/graphql',
		graphqlHTTP(() => ({
			schema,
			graphiql: true,
		})),
	);

	app.listen(port, () =>
		console.log(
			`Stitching Gateway listening on http://localhost:${port}/graphql`,
		),
	);
})();
