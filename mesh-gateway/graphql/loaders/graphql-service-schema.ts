import { JsonFileLoader } from '@graphql-tools/json-file-loader';
import { loadSchema } from '@graphql-tools/load';
import { AsyncExecutor } from '@graphql-tools/utils';
import { wrapSchema } from '@graphql-tools/wrap';
import { print } from 'graphql';
import superagent from 'superagent';

const GRAPHQL_SERVICE_PORT = parseInt(process.env.GRAPHQL_SERVICE_PORT as string, 10);

const executor: AsyncExecutor = async ({ document, variables }) => {
  const query = print(document)
  const result = await superagent
		.post(`http://localhost:${GRAPHQL_SERVICE_PORT}/graphql`)
		.set('content-type', 'application/json')
		.send(JSON.stringify({ query, variables }));
  return result.body;
}
 
export default (async () => {
  const schema = wrapSchema({
    schema: await loadSchema(`${__dirname}/../schemas/graphql-service-schema.json`, {
			loaders: [new JsonFileLoader()],
		}),
    executor,
  })
  return schema;
})();
