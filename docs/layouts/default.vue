<template>
  <div class="container">
    <div class="columns">
      <div class="column is-3">
        <the-navigation id="navigation" />
      </div>
      <div class="column">
        <nuxt id="content" class="content" />
      </div>
    </div>
  </div>
</template>

<script>
import TheNavigation from '../components/TheNavigation'

export default {
  components: { TheNavigation }
}
</script>

<style lang="sass">
#navigation, #content
  margin-top: 30px
</style>
