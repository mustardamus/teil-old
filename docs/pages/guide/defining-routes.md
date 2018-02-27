```javascript
module.exoports = {
  'GET /' (req, res) {
    res.send({ success: true })
  }
}
```

```javascript
module.exoports = {
  'GET /': [
    (req, res, next) => {
      console.log({ middleware: true })
      next()
    },
    (req, res) => {
      res.send({ handler: true })
    }
  ]
}
```
