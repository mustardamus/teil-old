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

## Fixing Avvio Package

Unfortunately
[this line](https://github.com/mcollina/avvio/blob/b4e2fab72679c5b1a643ce2c2a7fc4bff8f361f5/boot.js#L178)
in the [Avvio](https://github.com/mcollina/avvio) package (which is a dependency
of Fastify) makes trouble when re-loading routes in development.

This is hotfixed with the
[patch-package](https://github.com/ds300/patch-package) package. But it needs to
be done everytime a new version of Avvio is released. Here is how:

1. Open the `node_modules/avvio/boot.js` file
2. Locate the following code in the `Boot.prototype._addPlugin` function:

```javascript
if (this.booted) {
  throw new Error('root plugin has already booted')
}
```

3. And replace it with this code:

```javascript
if (this.booted) {
  if (process.env.NODE_ENV === 'production') { // hotfix by teil to make route re-loading work in development
    throw new Error('root plugin has already booted')
  }
}
```

4. Run `yarn patch-package avvio`
