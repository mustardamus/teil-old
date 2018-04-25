import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _7451878c = () => import('../docs/pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)
const _f857f3e6 = () => import('../docs/pages/guide/route-data-validation.vue' /* webpackChunkName: "pages/guide/route-data-validation" */).then(m => m.default || m)
const _6d33ffa2 = () => import('../docs/pages/guide/models-to-controllers-wiring.vue' /* webpackChunkName: "pages/guide/models-to-controllers-wiring" */).then(m => m.default || m)
const _7258ab0a = () => import('../docs/pages/guide/routes-middleware.vue' /* webpackChunkName: "pages/guide/routes-middleware" */).then(m => m.default || m)
const _4a62779f = () => import('../docs/pages/guide/single-file-configuration.vue' /* webpackChunkName: "pages/guide/single-file-configuration" */).then(m => m.default || m)
const _5bff4c4c = () => import('../docs/pages/guide/lovely-logging.vue' /* webpackChunkName: "pages/guide/lovely-logging" */).then(m => m.default || m)
const _6ebe4612 = () => import('../docs/pages/guide/extended-superstruct.vue' /* webpackChunkName: "pages/guide/extended-superstruct" */).then(m => m.default || m)
const _04b2fcc5 = () => import('../docs/pages/guide/database-connection.vue' /* webpackChunkName: "pages/guide/database-connection" */).then(m => m.default || m)
const _fcd5e05a = () => import('../docs/pages/guide/static-files.vue' /* webpackChunkName: "pages/guide/static-files" */).then(m => m.default || m)
const _69a2b9d6 = () => import('../docs/pages/guide/model-schema-validation.vue' /* webpackChunkName: "pages/guide/model-schema-validation" */).then(m => m.default || m)
const _1efbe191 = () => import('../docs/pages/guide/global-middleware.vue' /* webpackChunkName: "pages/guide/global-middleware" */).then(m => m.default || m)
const _cf57ca96 = () => import('../docs/pages/guide/installation.vue' /* webpackChunkName: "pages/guide/installation" */).then(m => m.default || m)
const _f04cf92a = () => import('../docs/pages/guide/model-declaration.vue' /* webpackChunkName: "pages/guide/model-declaration" */).then(m => m.default || m)
const _558706e6 = () => import('../docs/pages/guide/validate-and-alter-response-data.vue' /* webpackChunkName: "pages/guide/validate-and-alter-response-data" */).then(m => m.default || m)
const _5f2f30dc = () => import('../docs/pages/guide/create-controllers-and-models.vue' /* webpackChunkName: "pages/guide/create-controllers-and-models" */).then(m => m.default || m)
const _4fd4fdbd = () => import('../docs/pages/guide/route-handler-context.vue' /* webpackChunkName: "pages/guide/route-handler-context" */).then(m => m.default || m)



const scrollBehavior = (to, from, savedPosition) => {
  // SavedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition
  } else {
    let position = {}
    // If no children detected
    if (to.matched.length < 2) {
      // Scroll to the top of the page
      position = { x: 0, y: 0 }
    }
    else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
      // If one of the children has scrollToTop option set to true
      position = { x: 0, y: 0 }
    }
    // If link has anchor, scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/teil/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'is-active',
    scrollBehavior,
    routes: [
		{
			path: "/",
			component: _7451878c,
			name: "index"
		},
		{
			path: "/guide/route-data-validation",
			component: _f857f3e6,
			name: "guide-route-data-validation"
		},
		{
			path: "/guide/models-to-controllers-wiring",
			component: _6d33ffa2,
			name: "guide-models-to-controllers-wiring"
		},
		{
			path: "/guide/routes-middleware",
			component: _7258ab0a,
			name: "guide-routes-middleware"
		},
		{
			path: "/guide/single-file-configuration",
			component: _4a62779f,
			name: "guide-single-file-configuration"
		},
		{
			path: "/guide/lovely-logging",
			component: _5bff4c4c,
			name: "guide-lovely-logging"
		},
		{
			path: "/guide/extended-superstruct",
			component: _6ebe4612,
			name: "guide-extended-superstruct"
		},
		{
			path: "/guide/database-connection",
			component: _04b2fcc5,
			name: "guide-database-connection"
		},
		{
			path: "/guide/static-files",
			component: _fcd5e05a,
			name: "guide-static-files"
		},
		{
			path: "/guide/model-schema-validation",
			component: _69a2b9d6,
			name: "guide-model-schema-validation"
		},
		{
			path: "/guide/global-middleware",
			component: _1efbe191,
			name: "guide-global-middleware"
		},
		{
			path: "/guide/installation",
			component: _cf57ca96,
			name: "guide-installation"
		},
		{
			path: "/guide/model-declaration",
			component: _f04cf92a,
			name: "guide-model-declaration"
		},
		{
			path: "/guide/validate-and-alter-response-data",
			component: _558706e6,
			name: "guide-validate-and-alter-response-data"
		},
		{
			path: "/guide/create-controllers-and-models",
			component: _5f2f30dc,
			name: "guide-create-controllers-and-models"
		},
		{
			path: "/guide/route-handler-context",
			component: _4fd4fdbd,
			name: "guide-route-handler-context"
		}
    ],
    
    
    fallback: false
  })
}
