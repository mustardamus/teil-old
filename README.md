# Teil

Developer friendly Node.js web framework based on Express.js. Comes with
batteries and charger, quickly sketch an API server and get your MVP up and
running in no-time.

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

Generate a static version of the documentation. TODO

#### `docs:publish`

Publish the generated documentation to `gh-pages`. TODO

#### `docs`

Run `docs:generate` and `docs:publish` in sequence. TODO
