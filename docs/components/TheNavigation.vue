<template>
  <aside class="menu">
    <h3 class="menu-label">Version {{ version }}</h3>
    <ul class="menu-list">
      <li>
        <nuxt-link to="/">
          Teil Introduction
        </nuxt-link>
      </li>
    </ul>

    <h3 class="menu-label">Guide</h3>
    <ul class="menu-list">
      <li>
        <nuxt-link to="/guide/installation">
          Installation
        </nuxt-link>
        <nuxt-link to="/guide/create-controllers-and-models">
          Create Controllers And Models
        </nuxt-link>
        <nuxt-link to="/guide/database-connection">
          Database Connection
        </nuxt-link>
        <nuxt-link to="/guide/models-to-controllers-wiring">
          Models To Controllers Wiring
        </nuxt-link>
        <nuxt-link to="/guide/routes-middleware">
          Routes Middleware
        </nuxt-link>
        <nuxt-link to="/guide/route-data-validation">
          Route Data Validation
        </nuxt-link>
        <nuxt-link to="/guide/controllers">
          Controllers
        </nuxt-link>
        <nuxt-link to="/guide/models">
          Models
        </nuxt-link>
      </li>
    </ul>
  </aside>
</template>

<script>
import { version } from '../../package.json'

export default {
  data () {
    return { version }
  }
}
</script>
