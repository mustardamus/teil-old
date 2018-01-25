<template lang="md">
```javascript
module.exports = {
  schema: {
    title: String,
    content: String
  }
}
```

```javascript
module.exports = {
  schema ({ Types, validate })
    someId: Types.ObjectId,
    title: { type: String, required: true },
    email: {
      type: String,
      validate: [
        validate.String.isEmailLike,
        '{VALUE} is not a valid e-mail'
      ]
    },
    content: {
      type: String,
      validate: {
        validator (val) {
          return val.length > 140
        },
        message: 'content must have more than 140 characters'
      }
    }
  }
}
```
</template>
