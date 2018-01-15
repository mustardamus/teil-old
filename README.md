# Teil

## Commands (`yarn *`)

### `docs:dev`

Starts the `./docs` Nuxt app on [localhost:9991](http://localhost:9991).

### `dev`

Runs `docs:dev` in parallel.

### `test`

Runs the tests.

### `test:watch`

Re-run tests on file changes.

### `lint`

Linting all the code.

## TODO

- build correct context for express, not fastify
- data validation via superstruct
- response pick with lodash
- use supertest for server test, remove request
- properly test the handler wrapper
- check if handler returns a promise, do error handling via .catch
