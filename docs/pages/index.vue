<template>
  <div v-html="readMe"/>
</template>

<script>
import ReadMe from '../../README.md'

export default {
  computed: {
    readMe () {
      return ReadMe
    }
  }
}
</script>
