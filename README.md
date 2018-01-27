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

#### [Read more about Installation](https://mustardamus.github.io/teil/guide/installation)

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

#### [Read more about Create Controllers And Models](https://mustardamus.github.io/teil/guide/create-controllers-and-models)

### Automatically starting MongoDB

When you started Teil, there were no models and hence no database connection was
needed. You can use Teil just fine without any database.

But when you've created the `Article` model, Teil checked if you have a MongoDB
running. If not, it would start it automatically for you by forking a new
`mongod` process.

All relevant database files are saved in your project folder under `./db`, that
means everything is in one place.

#### [Read more about Database Connection](https://mustardamus.github.io/teil/guide/database-connection)

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

#### [Read more about Models To Controllers Wiring](https://mustardamus.github.io/teil/guide/models-to-controllers-wiring)

### Using middlewares in routes

Since Teil is based on Express.js, you can use any compatible middleware,
globally (more on that later) or for specific routes.

Lets see that in action by adding a `POST /` route to the
`./controllers/authors.js` file:

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

As you can see, for this route we are defining an Array instead of a Function.
Each item can be a middleware Function, the last item is the route handler.

You can make use of destructuring in the middleware just as in the route
handler, as seen in the first middleware that uses Teil's logger (more on that
later), or use the traditional `(req, res, next)` middleware style.

By the way, you can use the traditional `(req, res)` style in the route handler
as well, however, using the destructuring style looks pretty sweet and brings
some additional features as we will see later.

Lets try out the new route by using `curl`:

```shell
curl -H "Content-Type: application/json" \
     -X POST http://localhost:3003/api/articles
```

You'll see a pretty log of the first, and a regular log of the second
middleware. The server returns as expected the response string.

#### [Read more about Routes Middleware](https://mustardamus.github.io/teil/guide/routes-middleware)

### Validate data before it arrives at the route

When we created the `Article` model, we didn't add any validation to it (more on
model validation later), that means one could add an article without a `title`
and `content`.

Lets change that by validating the data that is arriving at the server. If the
validation fails, the route handler isn't even called.

Let's change the `POST /` route of `./controllers/articles.js`:

```javascript
'POST /': [
  {
    body: {
      title: 'isNotEmpty',
      content: 'isNotEmpty'
    }
  },

  ({ next }) => next(), // middleware #1
  (req, res, next) => next(), // middleware #2

  ({ send, body, Article }) => {
    const article = new Article(body)
    article.save().then(() => send(article))
  }
]
```

For clarity, the middlewares have been compressed. What's new in the route
handler (always the last item in the Array) is that we grab the `body` (the
payload of the `POST` request) and the `Article` model. We create a new
[Mongoose Document](http://mongoosejs.com/docs/api.html#Document), save and
return it.

Note the first Object of the Array. There we define a `body` field, which is a
validation schema used by the
[Superstruct](https://github.com/ianstormtaylor/superstruct) library. With the
`isNotEmpty` rule we say that both `title` and `content` of the `body` can not
be empty.

Lets try creating an article without content:

```shell
curl -H "Content-Type: application/json" \
     -d '{"title":"Example Post","content":""}' \
     -X POST http://localhost:3003/api/articles
```

The request will fail with a status code of `500` and returns:

```shell
Expected a value of type `isNotEmpty` for `content` but received `""`.
```

Sweet! Lets try the same request but with some content - as expected it returns
the created document:

```javascript
{
  "_id":"5a6b899b03d643073d58ab2e",
  "title":"Example Post",
  "content":"Example Content",
  "__v":0
}
```

#### [Read more about Route Data Validation](https://mustardamus.github.io/teil/guide/route-data-validation)

### Data validation in model schemas

Mongoose supports
[custom validations](http://mongoosejs.com/docs/validation.html#custom-validators)
out of the box. Teil extends this with many validations provided by
[Validator.js](https://github.com/chriso/validator.js).

Lets add a optional `authorEmail` field to the `Author` model at
`./models/author.js`:

```javascript
// ./models/article.js
module.exports = {
  schema ({ validator: { isEmail } }) {
    return {
      title: { type: String, required: true },
      content: { type: String, required: true },

      authorEmail: {
        type: String,
        validate: {
          validator: val => val.length === 0 || isEmail(val),
          message: '{VALUE} is not a valid E-Mail'
        }
      }
    }
  }
}
```

As you can see, the `schema` isn't an Object anymore, but a Function that is
using destructuring again. This Function must return the schema Object.

For `title` and `content` the `required` validation that Mongoose is providing
is used.

We added a new `authorEmail` field. There we make use of Mongoose's custom
validations. On top of that we use the `isEmail` validator from Validator.js,
and make it optional by checking the length of the string.

Since we already validating data on the route, we need to extend that schema as
well, in `./controllers/authors.js`:

```javascript
body: {
  title: 'isNotEmpty',
  content: 'isNotEmpty',
  authorEmail: 'string?'
}
```

The `?` tells Superstruct that the value of `authorEmail` is an optional String.

Lets try creating an article with an invalid `authorEmail`:

```shell
curl -H "Content-Type: application/json" \
     -d '{"title":"Example Post","content":"Example Content","authorEmail":"nope"}' \
     -X POST http://localhost:3003/api/articles
```

This request is failing with a status code of `500` and is returning:

```shell
Article validation failed: authorEmail: nope is not a valid E-Mail
```

Posting no `authorEmail` or a valid E-Mail works fine. Easy peasy.

#### [Read more about Model Schema Validation](https://mustardamus.github.io/teil/guide/model-schema-validation)

### Create fully fledged Mongoose models by simple declarative objects

Mongoose models are powerful. Teil adds some abstraction to all the features and
makes it pretty simple to define fully fledged models.

Lets add a [virtual field](http://mongoosejs.com/docs/api.html#Virtualtype)
`excerpt` for example by adding this to `./models/article.js`:

```javascript
virtuals: {
  excerpt: {
    get () {
      if (typeof this.content === 'string') {
        return this.content.substr(0, 140) + '...'
      }
    }
  }
},

options: {
  toObject: { virtuals: true }
}
```

Here `virtuals` is an Object that holds all virtual fields, the key name is also
the name of the virtual field, `excerpt` in this example. This field has a
getter, represented by the `get()` method.

In this method we check if the type `content` of the document (`this`) is a
String (remember, we've created articles without content), and if so, return
the first 140 characters of the `content` value.

Below the `virtuals` there is an `options` Object defined. We want the excerpt
to be included when we return the document in JSON format. Therefore we set
the `virtuals` option of
[toObject](http://mongoosejs.com/docs/api.html#document_Document-toObject) to
`true`.

#### [Read more about Model Declaration](https://mustardamus.github.io/teil/guide/model-declaration)

### Validate and alter response data before it's leaving the route

Since we now have the `excerpt` field, we don't necessarily want to return the
`content` of an article when listing all articles. Let's edit the `GET /` route
of `./controllers/articles.js` like this:

```javascript
'GET /': [
  {
    response ({ data, _: { pick }}) {
      return data.map(article => pick(article, ['_id', 'title', 'excerpt']))
    }
  },

  ({ send, Article }) => {
    Article.find().exec().then(articles => send(articles))
  }
]
```

The `GET /` Function became an Array. The validation schema Object is the first
item of that Array, the route handler Function is the second.

Here we could have defined an Object for the `response` validation schema, like
we saw before with `body`. Instead we pass an custom method. Via destructuring
we pick the `data` (that is the data that we responded with `send()`) as well as
the [pick](https://lodash.com/docs/4.17.4#pick) method of Lodash.

We map over each article and pick only the `_id`, `title` and `excerpt` fields.
Then we return the newly Array.

As stated before, this is an additional feature of the destructured `send()`
method. It would not work with the regular `res.send()` or `res.json()` of
Express.js.

When we navigate to the
[localhost:3003/api/articles](http://localhost:3003/api/articles) URL we will
see the trimmed down articles:

```javascript
[
  {
    "_id": "5a6b90d303d643073d58ab39",
    "title": "Example Post",
    "excerpt": "Example Content..."
  }
]
```

This is a super neat way of staying in control which data is leaving your API.

#### [Read more about Validate And Alter Response Data](https://mustardamus.github.io/teil/guide/validate-and-alter-response-data)

### Tight controllers by using destructuring

#### [Read more about Route Handler Context](https://mustardamus.github.io/teil/guide/route-handler-context)

### Automatically load global middleware

#### [Read more about Global Middleware](https://mustardamus.github.io/teil/guide/global-middleware)

### Automatically serving static files

#### [Read more about Static Files](https://mustardamus.github.io/teil/guide/static-files)

### Lovely logging

#### [Read more about Lovely Logging](https://mustardamus.github.io/teil/guide/lovely-logging)

### All configurable via a single config file

#### [Read more about Single File Configuration](https://mustardamus.github.io/teil/guide/single-file-configuration)

### And some more features to save you time

#### [Read more about Extended Superstruct](https://mustardamus.github.io/teil/guide/extended-superstruct)


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
