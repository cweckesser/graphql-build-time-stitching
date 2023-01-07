import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchema } from '@graphql-tools/load';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';

import { resolvers } from './resolvers';

const port = process.env.GRAPHQL_SERVICE_PORT;

(async () => {
	// GraphQL initialization

	const typeDefs = await loadSchema(`${__dirname}/../schema/schema.graphql`, {
		loaders: [new GraphQLFileLoader()],
	});

	const schema = await makeExecutableSchema({
		typeDefs,
		resolvers,
	});

	// Service initialization

	const app = express();

	app.use(
		'/graphql',
		graphqlHTTP({
			schema,
			graphiql: true,
		}),
	);

	app.listen(port, () => {
		console.log(
			`GraphQL Service listening on http://localhost:${port}/graphql`,
		);
	});
})();
