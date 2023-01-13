
# Stitching of GraphQL schemas at build time

The purpose of this project is to stitch together different GraphQL schemas obtained via introspection from remote services, and then run a gateway server that loads the stitched schema and resolves incoming GraphQL queries by delegating them to the corresponding remote services.

The remote services could any type of source, but in this example only a GraphQL service and an OpenAPI service are used as examples.

# Usage

1. Install dependencies of the main project (global dependencies)
	1. Navigate to the folder where the project has been cloned
	2. Run `yarn`

2. Install all the sub-project dependencies with `yarn dependencies`

3. Generate types (GraphQL service), specs and routes (OpenAPI service) by running `yarn generated`

4. Build all the services TS files with `yarn building`

5. Run the services with the command `yarn startup:services`
	1. GraphQL service (People): http://localhost:3001/graphql
	2. OpenAPI service (Employment): http://localhost:3002/docs

These are the default port values defined in the `.env` file in the main project folder.

**These services need to be up and running for the stitching service to run!**

6. Run a gateway
	1. Stitching Gateway: `yarn startup:stitching-gateway` (http://localhost:3003/graphql)
	1. Mesh Gateway: `yarn startup:mesh-gateway` (http://localhost:400/graphql) (*)

(*) The Mesh Gateway should be running in the port configured in the `.env` file (3004) but GraphQL Mesh does't seem to correctly pickup the environment variable for the port override.

# Known issues

### Failing queries in the Stitching Gateway

When running a query against the gateway:

```graphql
query getPeople {
  GraphQLService {
    people {
      id
    }
  }
}
```

The following error occurs:

```json
{
  "errors": [
    {
      "message": "Cannot return null for non-nullable field Query.GraphQLService.",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "GraphQLService"
      ]
    }
  ],
  "data": null
}
````

# Partial learnings and conclusions

- No examples of stitching schemas at build time could be found in the GraphQL Tools documentation, so this project is an attempt of an implementation for this use case.

- The gateway configuration is inherently wrong, since the incoming requests should be processed by executors that relay the queries to the corresponding downstream APIs instead of using resolvers.

- The stitched schema is created using transforms that allow defining namespaces for the different schemas to avoid collisions. When initializing the gateway, it should also be possible to route incoming queries to the corresponding downstream API via executors. However, it's not obvious how to specify transforms when configuring the gateway with the stitched schema.
