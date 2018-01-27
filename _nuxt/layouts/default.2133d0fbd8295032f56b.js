webpackJsonp([0],{"4suj":function(t,n,e){"use strict";var i=e("G4fd");n.a={components:{TheNavigation:i.a}}},"7YgM":function(t,n){t.exports={name:"teil",version:"0.1.0",main:"lib/teil.js",bin:{teil:"bin/teil.js"},license:"MIT",scripts:{test:"jest -c jest.config.js --silent","test:watch":"jest -c jest.config.js --watch",lint:"eslint --ignore-path .eslintignore .","docs:dev":"cross-env PORT=9991 nuxt dev --config-file=docs.config.js","docs:generate":"nuxt generate --config-file=docs.config.js","docs:publish":"gh-pages -d docs/dist",docs:"run-s docs:generate docs:publish",example:"cd example && node ../bin/teil.js"},dependencies:{ansicolor:"^1.1.71",anymatch:"^2.0.0",chokidar:"^2.0.0",commander:"^2.13.0",express:"^4.16.2",glob:"^7.1.2","import-fresh":"^2.0.0",lodash:"^4.17.4",mongoose:"^5.0.1",ololog:"^1.1.84",pino:"^4.10.3","ps-node":"^0.1.6",shelljs:"^0.8.1",stacktracey:"^1.2.100",superstruct:"^0.5.0",validator:"^9.2.0"},devDependencies:{"@nuxtjs/bulma":"^1.1.0","@nuxtjs/markdownit":"^1.2.0","cross-env":"^5.1.3",eslint:"^4.16.0","eslint-config-standard":"^11.0.0-beta.0","eslint-friendly-formatter":"^3.0.0","eslint-plugin-import":"^2.8.0","eslint-plugin-node":"^5.2.1","eslint-plugin-promise":"^3.5.0","eslint-plugin-standard":"^3.0.1","gh-pages":"^1.1.0","highlight.js":"^9.12.0",jest:"^22.1.4","markdown-it-highlightjs":"^3.0.0","node-sass":"^4.7.2","npm-run-all":"^4.1.2",nuxt:"^1.1.1","sass-loader":"^6.0.6",supertest:"^3.0.0"}}},BFFw:function(t,n,e){var i=e("UAce");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);e("rjj0")("7c9f39bc",i,!1)},BrJG:function(t,n,e){"use strict";var i=e("7YgM");e.n(i);n.a={data:function(){return{version:i.version}}}},G4fd:function(t,n,e){"use strict";var i=e("BrJG"),s=e("kzUF"),a=e("VU/8")(i.a,s.a,!1,null,null,null);a.options.__file="docs/components/TheNavigation.vue",n.a=a.exports},UAce:function(t,n,e){(t.exports=e("FZ+f")(!1)).push([t.i,"body,html{background:#eee}#__layout,#__nuxt,#content,#navigation,body,html{height:100%}#content,#navigation{overflow:scroll;position:fixed}#content{background:#fff;border-left:5px solid #ddd}#content .content{margin:30px}#navigation .menu{margin:30px 0}",""])},eGHw:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=e("4suj"),s=e("f0hh"),a=!1;var o=function(t){a||e("BFFw")},l=e("VU/8")(i.a,s.a,!1,o,null,null);l.options.__file="docs/layouts/default.vue",n.default=l.exports},f0hh:function(t,n,e){"use strict";var i=function(){var t=this.$createElement,n=this._self._c||t;return n("div",{staticClass:"container"},[n("div",{staticClass:"columns is-gapless"},[n("div",{staticClass:"column is-3"},[n("div",{attrs:{id:"navigation"}},[n("the-navigation")],1)]),n("div",{staticClass:"column"},[n("div",{attrs:{id:"content"}},[n("nuxt",{staticClass:"content"})],1)])])])};i._withStripped=!0;var s={render:i,staticRenderFns:[]};n.a=s},kzUF:function(t,n,e){"use strict";var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("aside",{staticClass:"menu"},[e("h3",{staticClass:"menu-label"},[t._v("Version "+t._s(t.version))]),e("ul",{staticClass:"menu-list"},[e("li",[e("nuxt-link",{attrs:{to:"/"}},[t._v("\n        Teil Introduction\n      ")])],1)]),e("h3",{staticClass:"menu-label"},[t._v("Guide")]),e("ul",{staticClass:"menu-list"},[e("li",[e("nuxt-link",{attrs:{to:"/guide/installation"}},[t._v("\n        Installation\n      ")]),e("nuxt-link",{attrs:{to:"/guide/create-controllers-and-models"}},[t._v("\n        Create Controllers And Models\n      ")]),e("nuxt-link",{attrs:{to:"/guide/database-connection"}},[t._v("\n        Database Connection\n      ")]),e("nuxt-link",{attrs:{to:"/guide/models-to-controllers-wiring"}},[t._v("\n        Models To Controllers Wiring\n      ")]),e("nuxt-link",{attrs:{to:"/guide/routes-middleware"}},[t._v("\n        Routes Middleware\n      ")]),e("nuxt-link",{attrs:{to:"/guide/route-data-validation"}},[t._v("\n        Route Data Validation\n      ")]),e("nuxt-link",{attrs:{to:"/guide/model-schema-validation"}},[t._v("\n        Model Schema Validation\n      ")]),e("nuxt-link",{attrs:{to:"/guide/model-declaration"}},[t._v("\n        Model Declaration\n      ")]),e("nuxt-link",{attrs:{to:"/guide/validate-and-alter-response-data"}},[t._v("\n        Validate And Alter Response Data\n      ")]),e("nuxt-link",{attrs:{to:"/guide/route-handler-context"}},[t._v("\n        Route Handler Context\n      ")]),e("nuxt-link",{attrs:{to:"/guide/global-middleware"}},[t._v("\n        Global Middleware\n      ")]),e("nuxt-link",{attrs:{to:"/guide/static-files"}},[t._v("\n        Static Files\n      ")]),e("nuxt-link",{attrs:{to:"/guide/lovely-logging"}},[t._v("\n        Lovely Logging\n      ")]),e("nuxt-link",{attrs:{to:"/guide/single-file-configuration"}},[t._v("\n        Single File Configuration\n      ")]),e("nuxt-link",{attrs:{to:"/guide/extended-superstruct"}},[t._v("\n        Extended Superstruct\n      ")])],1)])])};i._withStripped=!0;var s={render:i,staticRenderFns:[]};n.a=s}});