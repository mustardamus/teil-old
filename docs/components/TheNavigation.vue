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
        <nuxt-link to="/guide/model-schema-validation">
          Model Schema Validation
        </nuxt-link>
        <nuxt-link to="/guide/model-declaration">
          Model Declaration
        </nuxt-link>
        <nuxt-link to="/guide/validate-and-alter-response-data">
          Validate And Alter Response Data
        </nuxt-link>
        <nuxt-link to="/guide/route-handler-context">
          Route Handler Context
        </nuxt-link>
        <nuxt-link to="/guide/global-middleware">
          Global Middleware
        </nuxt-link>
        <nuxt-link to="/guide/static-files">
          Static Files
        </nuxt-link>
        <nuxt-link to="/guide/lovely-logging">
          Lovely Logging
        </nuxt-link>
        <nuxt-link to="/guide/single-file-configuration">
          Single File Configuration
        </nuxt-link>
        <nuxt-link to="/guide/extended-superstruct">
          Extended Superstruct
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
