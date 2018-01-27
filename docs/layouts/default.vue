<template>
  <div class="container">
    <div class="columns is-gapless">
      <div class="column is-3">
        <div id="navigation">
          <the-navigation  />
        </div>
      </div>
      <div class="column">
        <div id="content">
          <nuxt class="content" />
        </div>
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
html, body
  background: #eee

html, body, #__nuxt, #__layout, #navigation, #content
  height: 100%

#navigation, #content
  overflow: scroll
  position: fixed

#content
  background: white
  border-left: 5px solid #ddd

  .content
    margin: 30px

#navigation
  .menu
    margin: 30px 0
</style>
