# Teil

Developer friendly 'get shit done' Node.js web framework based on
[Express.js](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) via
[Mongoose](http://mongoosejs.com/). Comes with batteries and charger - quickly
sketch a working API server and get your MVP up and running in no-time.


## Features

### Get started with a new project in under a minute

Initialize a new Node.js project and install Teil:

```shell
mkdir teil-blog
cd teil-blog
npm init -y
npm install teil
```

Add the `dev` command to `package.json`:

```javascript
"scripts": {
  "dev": "teil"
}
```

And start Teil with the `dev` command:

```shell
npm run dev
```

From here on you do not need to restart the server. Every changes you make, like
adding new routes, will be automatically applied.

#### [Read more about Installation](https://mustardamus.github.io/teil/installation)

### Create new routes and models by simply creating files

Sketching out new routes that will be instantly available only takes a couple of
seconds.

Lets say we want to create a RESTful API for blog articles. Simply create a file
named `articles.js` in the `controllers` directory:

```javascript
// ./controllers/articles.js
module.exports = {
  'GET /' ({ send }) {
    send('Here will be a RESTful API...')
  }
}
```

Without the need to restart the server you can browse to
[localhost:3003/api/articles](http://localhost:3003/api/articles) and see the
output from above. You can change the response string and the route will
automatically update!

Creating models is equally easy. Create a file named `article.js` in the
`models` directory:

```javascript
// ./models/article.js
module.exports = {
  schema: {
    title: String,
    content: String
  }
}
```

Same game, change something in the model and Teil will automatically apply the
changes. Good bye server reload!

#### [Read more about Create Controllers And Models](https://mustardamus.github.io/teil/create-controllers-and-models)

### Automatically starting MongoDB

When you started Teil, there were no models and hence no database connection was
needed. You can use Teil just fine without any database.

But when you've created the `Article` model, Teil checked if you have a MongoDB
running. If not, it would start it automatically for you by forking a new
`mongod` process.

All relevant database files are saved in your project folder under `./db`, that
means everything is in one place.

#### [Read more about Database Connection](https://mustardamus.github.io/teil/database-connection)

### Models are instantly usable in controllers

Now lets actually use the `Article` model in a route. We can use
the ES2016 destructuring feature like we did with the `send` method (more on
that later).

Update the `GET /` route in `./controllers/articles.js` like so:

```javascript
'GET /' ({ send, Article }) {
  Article.find().exec().then(articles => send(articles))
}
```

As you can see Teil did some wiring for us and mapped the file
`./models/article.js` to the `Article` variable.

This is a
[Mongoose Model](http://mongoosejs.com/docs/models.html) with every feature
Mongoose provides. In this example it finds any `Article` and responds the
result.

Navigate to [localhost:3003/api/articles](http://localhost:3003/api/articles)
and you will see an empty Array, because there are no articles yet in the
database.

#### [Read more about Models To Controllers Wiring](https://mustardamus.github.io/teil/models-to-controllers-wiring)

### Use middlewares in routes

```javascript
'POST /': [
  ({ next, log }) => { // route middlewares can use destructuring too
    log('Route Middleware #1')
    next()
  },
  (req, res, next) => { // or the traditional express.js callback style
    console.log('Route Middleware #2')
    next()
  },
  ({ send }) => {
    send('Here will be the create endpoint...')
  }
]
```

```shell
curl -H "Content-Type: application/json" \
     -X POST http://localhost:3003/api/articles
```

- Make use of destructuring to have tight controllers
- Create fully fledged Mongoose models by simple objects
- Validate data before it hits your routes
- Validate and alter data when its leaving your routes
- Automatically load middleware

- Lovely logging
- Includes ready to use libraries like Lodash, Validator.js and Superstruct
- All configurable via a single file


## Create a simple Blog in 5 minutes

You'll need to have Node.js, NPM and MongoDB installed.

### Initialize a new Teil project

```bash
mkdir teil-blog
cd teil-blog
yarn init -y
yarn add teil
```

In the `package.json`, add the `dev` command:

```json
"scripts": {
  "dev": "teil"
}
```

And start the app:

```bash
yarn dev
```

### Create a `Post` model

Create the file `models/post.js` with the following code:

```javascript
module.exports = {
  options: {
    timestamps: true
  },

  schema: {
    title: { type: String, required: true },
    content: { type: String },

    excerpt: {
      type: String,
      validate: {
        validator: val => val.length <= 140,
        message: 'Excerpt must not exceed 140 characters'
      }
    }
  }
}
```

If your MongoDB weren't started already, Teil would do that for you. The new
model is picked up automatically and is ready to use in controllers.

Note that we use Mongoose's option to automatically create timestamps for us.

Also note how we define a Mongoose schema in the model and define a custom
validator for the `excerpt` field.

### Create a `Posts` controller

Create the file `controllers/posts.js` with the following code:

```javascript
module.exports = {
  'GET /' ({ send }) {
    send('index route')
  },

  'POST /create' ({ send }) {
    send('create route')
  }
}
```

Teil will automatically set up the routes for you at
[/api/posts](http://localhost:3003/api/posts) and
[/api/posts/create](http://localhost:3003/api/posts/create).

The filename is used as the resource-name, `posts`, in the route. Each exported
function has a name formatted as `[http-method] [express-route]`, and will
automatically mount under the parent resource in a RESTful way.

Note that we use destructuring in the first parameter of the function. `send`
is the same as `res.send` if we would use traditional Express.js callbacks.

### Creating a `Post`

Update the `POST /create` route like so:

```javascript
'POST /create' ({ send, body, Post }) {
  const post = new Post(body)
  post.save().then(() => send(post))
}
```

As you can see we get the `body` object from the context. This is the same as
`req.body` if we would traditional Express.js callbacks. This object contains
the `POST`ed data.

Next we get the `Post` model from the context. This is the Mongoose model we
have created just a second ago.

We create a new `Post` with the posted data and send back the object.

Lets try it out with `curl`:

```bash
curl -H "Content-Type: application/json" \
     -d '{"title":"Post 1","excerpt":"Post 1 excerpt","content":""}' \
     -X POST http://localhost:3003/api/posts/create
```

This will, as expected, return:

```json
{
  "_id":"5a6a0a74665a830d56bfe362",
  "title":"Post 1",
  "excerpt":"Post 1 excerpt",
  "content":"",
  "createdAt":"2018-01-25T16:48:52.620Z",
  "updatedAt":"2018-01-25T16:48:52.620Z",
  "__v":0
}
```

### Adding `body` validation

In our `Post` model we defined earlier, we forgot to set the `required`
validation to the `content` field. That's why we could create a `Post` without
content.

For the sake of this example, lets not add that validation to the model, but to
the route.

Change the `POST /create` route to:

```javascript
'POST /create': [
  {
    body: {
      title: 'isNotEmpty',
      excerpt: 'isNotEmpty',
      content: 'isNotEmpty'
    }
  },
  ({ send, body, Post }) => {
    const post = new Post(body)
    post.save().then(() => send(post))
  }
]
```

Note that `POST /create` is now an Array instead of a Function. We moved our
route handler Function to the end of the Array. The first Array item is an
Object that defines the validations we want to perform.

In this example we want to validate the `body` data. Each field should not be
empty.

Lets try creating a `Post` with a empty `content` field again:

```bash
curl -H "Content-Type: application/json" \
     -d '{"title":"Post 2","excerpt":"Post 2 excerpt","content":""}' \
     -X POST http://localhost:3003/api/posts/create
```

The request will fail with a 500 status and returns:

```
Expected a value of type `isNotEmpty` for `content` but received `""`.
```

Enter some content and the request will succeed as before returning the `Post`s
data.

### Listing all the posts

Now lets update the `GET /` route like so:

```javascript
'GET /' ({ send, Post }) {
  Post.find().exec().then(posts => send(posts))
}
```

Navigate to [/api/posts](http://localhost:3003/api/posts) to see all the `Post`s
we have created so far. Easy peasy.

### Altering the response data

Lets say in our index route we only want to return a bare minimum on data for
each `Post`.

Change the `GET /` route like so:

```javascript
'GET /': [
  {
    response ({ data, _: { pick } }) {
      return data.map(post => pick(post, '_id', 'title', 'excerpt'))
    }
  },
  ({ send, Post }) => {
    Post.find().exec().then(posts => send(posts))
  },
],
```

This is the same Array style we have created for the other route, the first item
is an Object that defines validations, and the second one is the route handler
Function.

Note that instead of a validation Object, we define `response` as a function. We
pass in the `data` that is send back, as well as the `pick` Function from
Lodash.

We `map` each `Post` and use the `pick` Function to only pick the fields we
actually want to return.

Navigate to [/api/posts](http://localhost:3003/api/posts) and see the much
slimmer response.


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

Generate a static version of the documentation.

#### `docs:publish`

Publish the generated documentation to `gh-pages`.

#### `docs`

Run `docs:generate` and `docs:publish` in sequence.

### `example`

Runs the full example in `./example`.
