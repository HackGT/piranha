# Development Overview

Piranha is an application to help HackGT manage our internal financial processes ("sinking our teeth in") so to speak.

## Architecture

##### Backend Architecture

- Language: TypeScript
- Framework: Node.js/Express
- Database: Postgres
- Authentication: [Ground Truth](https://github.com/hackgt/ground-truth)
- Dependency management: yarn
- API: GraphQL ([Apollo Server](https://www.apollographql.com/docs/apollo-server))
- Where: [/server](/frontend)

##### Frontend Architecture

- Language: TypeScript
- Framework: React
- UI Library: [Ant Design](https://ant.design)
- API Client: GraphQL ([Apollo Client](https://www.apollographql.com/docs/react/))
- Dependency management: yarn
- Where: [/client](/client)

## Setup

#### Server
1. `cd server` then `yarn install`
2. `yarn prisma-generate` to generate prisma types
3. `yarn dev`


#### Environment Variables

Once you have the backend dependencies installed,
configure the backend environment variables by copying [.env.example](.env.example) to a new file called `.env` and filling in the variables.

To setup google file upload, add your Google service account credentials to a file called `google-application-key.json` in the config directory.

#### Client
1. `cd client` then `yarn install`
2. `yarn start`

## Utilities

#### GraphQL Typings

This will generate TypeScript typings based on the `api.graphql` file.
1. `yarn install`
2. `yarn generate`

Note, anytime the graphql schema is changed (`api.graphql`) you will need to rerun `yarn generate` in the root directory to generate the types.

#### Migrations

After changing the prisma schema file `schema.prisma`, run the following commands in the server folder to migrate the database and generate a new prisma client.

1. `yarn migrate:save`
2. `yarn migrate:up`
3. `yarn prisma generate`
