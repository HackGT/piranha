# Development - Getting Started

## Architecture

Piranha is an application to help HackGT manage our internal financial processes ("sinking our teeth in," sotospeak).

Backend architecture:

- Language: Python
- Framework: Django
- Database: Postgres
- Authentication: [Ground Truth](https://github.com/hackgt/ground-truth)
- Where: every directory except [/frontend](/frontend)
- Dependency management: pipenv
- API: GraphQL ([Graphene Django](http://docs.graphene-python.org/projects/django/en/latest/))

Frontend architecture:

- Language: TypeScript
- Framework: React
- UI Library: [Semantic UI React](https://react.semantic-ui.com/)
- API Client: [Relay GraphQL](https://relay.dev/)
- Dependency management: npm
- Where: [frontend](/frontend) directory

## Installing Dependencies

### Backend

The recommended way to setup the backend is using Pipenv.  If you use an IDE such as PyCharm,
it can handle the complicated parts of this for you.  You should use Pipenv as a virtual environment; it'll make your life easier.

Once you have the backend dependencies installed (from the [Pipfile](Pipfile)),
configure the backend environment variables by copying [.env.example](.env.example)
to a new file called `.env`.

| Environment variable | Description |
| ------ | -----|
| DEBUG | "true" if you're using a local development build.  In production, set this to "false"
| SECRET_KEY | Generate using https://djecrety.ir/.  You'll probably need to put the value in "quotes" because it contains special characters |
| POSTGRES_URL | Connection string for a Postgres database.  Format: `postgres://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME` |
| GROUND_TRUTH_URL | URL to a [Ground Truth](https://github.com/hackgt/ground-truth) login service for authenticating users.  |
| GROUND_TRUTH_CLIENT_ID | Obtain from Ground Truth admin panel |
| GROUND_TRUTH_CLIENT_SECRET | Obtain from Ground Truth admin panel |
| TIME_ZONE | The [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for whatever timezone you want the application to use |
| PRODUCTION | Use `true` to enable production settings |
| GOOGLE_APPLICATION_CREDENTIALS | Stores path to service account credentials for Google Cloud |
| GOOGLE_STORAGE_BUCKET | Name of storage bucket in Google Cloud |
| SENTRY_DSN | The Sentry.io URL to use for error reporting (only used in production) |

A few steps to finish up:
1. Open a terminal in the root directory of this repo
2. Ensure you're in the virtual environment you created earlier
3. Run `python mange.py migrate` to setup the database
4. Run `python manage.py createsuperuser` to create an initial admin user
5. Run `python manage.py runserver` to run the application (if you're using a JetBrains IDE, a run configuration is included in this repo for this)

#### Permissions
Piranha uses Django group permissions to manage access to the dashboard. To access the dashboard, a user must be a part
of the `member` group. If this is your first time setting up the app, login to the Django admin panel and create this group.
The other permission groups used are `admin` and `exec`, which provide higher level access controls on an individual basis.

### Frontend

The frontend lives in the [/frontend](/frontend) directory.

**Before continuing, ensure your command line is in the correct directory, [/frontend](/frontend).**

#### Installing Dependencies
1. Install the required dependencies using `npm install`
2. Run the frontend for local development using `npm start`.
2. That's it for the frontend!

# Utilities
## GraphQL

- To generate a new schema.graphql for the frontend: from the root of this repository, run `python manage.py graphql_schema --schema piranha.schema.schema --out schema.graphql`


