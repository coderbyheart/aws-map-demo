# AWS Map Demo

## Setup

Install the dependencies:

```bash
npm ci
```

Authenticate the AWS CLI,
[environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html)
are recommended using [direnv](https://direnv.net/).

Then, deploy the map resources to your account.

```bash
npx cdk bootstrap
npx cdk deploy
```

Add the outputs `mapName` and `placesIndexName` as environment variables for the web application:

```bash
export MAP_NAME=aws-map-demo-map
export PLACES_INDEX_NAME=aws-map-demo-index
```

Navigate to your map on the AWS Console and create an API key for the map.

> _Note:_ Unfortunately API Keys cannot be created using CloudFormation today.

- Add the map and the place index to the resources.
- Grant the `GetMap*` action permission.
- Grant the `SearchPlaceIndexForText` and `SearchPlaceIndexForSuggestions` permissions.
- In the referrers settings allow these domains
  - `http://localhost:*/*` (for local development)
  - your domain name, e.g. `https://coderbyheart.github.io/*`

Add it to the environment variables:

```bash
export MAP_API_KEY=v1.public....
```

Run `npm start` to launch the web app.
