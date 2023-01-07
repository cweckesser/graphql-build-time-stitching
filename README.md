
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

6. Run the stitching gateway with `yarn startup:stitching-gateway`. The gateway will run at http://localhost:3003/graphql

# Known issues

### Faulty stitched schema

The process of stitching the schemas together is done before the gateway service is run, since the latter loads the `.graphql` file generated by the first. This GraphQL schema is created with empty mutation definitions, as shown here:

```graphql
...
type GraphQLService_Mutation
...
type OpenAPIService_Mutation
```

This empty mutations do not cause the gateway to crash when started. However, when running a query against it:

```graphql
query getPeople {
  GraphQLService {
    people {
      id
    }
  }
}
```

The following error is returned:

```json
{
  "errors": [
    {
      "message": "Type GraphQLService_Mutation must define one or more fields.",
      "locations": [
        { "line": 37, "column": 1 }
      ]
    },
    {
      "message": "Type OpenAPIService_Mutation must define one or more fields.",
      "locations": [
        { "line": 65, "column": 1 }
      ]
    }
  ]
}
```

Though this is **not** a proper solution, the error can be circumvented by removing the empty mutations.

**Script details:**

- The schema stitching is a script run with the `yarn startup:stitch-schemas` command  (`stitching-gateway/package.json`)
- The script's logic can be found in the `stitching-gateway/src/schema-stitcher.ts` file

### Failing queries

Once the faulty stitched schema has been circumvented, when running a query against the gateway:

```graphql
query getPeople {
  GraphQLService {
    people {
      id
    }
  }
}
```

A new error occurs:

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

- The stitched schema needs to be created in a more consistent way (see [Faulty stitched schema](#faulty-stitched-schema])), but is not possible to provide any type of parameters to control the output of the function that prints the GraphQL schema.

- The stitched schema is created using transforms that allow defining namespaces for the different schemas to avoid collisions. When initializing the gateway, it should also be possible to route incoming queries to the corresponding downstream API via executors. It's very likely that transforms or a similar strategy should be used to perform such routing.
