# Teil

Developer friendly Node.js web framework based on Express.js. Comes with
batteries and charger, quickly sketch an API server and get your MVP up.

## Features

- Create new routes and models by simply creating files
- Reload routes and models on file changes
- Make use of destructuring to have tight controllers
- Create fully fledged Mongoose models by simple objects
- Automatically wire models to controllers
- Validate data before it hits your routes
- Validate and alter data when its leaving your routes
- Automatically load middleware
- Automatically start and connect to MongoDB
- Lovely logging
- Includes ready to use libraries like Lodash, Validator.js and Superstruct
- All configurable via a single file


## Create a simple Blog in 5 minutes

You'll need to have Node.js, NPM and MongoDB installed.

### Initialize a new Teil project

```
mkdir teil-blog
cd teil-blog
yarn init -y
yarn add teil
```

In the `package.json`, add the `dev` command:

```
"scripts": {
  "dev": "teil"
}
```

And start the app:

```
yarn dev
```

### Create a `Post` model




## Development

### Commands (`yarn *`)

#### `test`

Runs the tests.

#### `test:watch`

Re-run tests on file changes.

#### `lint`

Linting all the code.

#### `docs:dev`

Starts the `./docs` Nuxt app on [localhost:9991](http://localhost:9991).

#### `docs:generate`

Generate a static version of the documentation. TODO

#### `docs:publish`

Publish the generated documentation to `gh-pages`. TODO

#### `docs`

Run `docs:generate` and `docs:publish` in sequence. TODO
