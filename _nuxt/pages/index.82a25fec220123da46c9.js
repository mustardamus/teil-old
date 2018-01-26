webpackJsonp([1],{"7TCL":function(s,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("9qQd"),t=n("MT1B"),o=n("VU/8")(a.a,t.a,!1,null,null,null);o.options.__file="docs/pages/index.vue",e.default=o.exports},"9qQd":function(s,e,n){"use strict";var a=n("G0wi"),t=n.n(a);e.a={computed:{readMe:function(){return t.a}}}},G0wi:function(s,e){s.exports='<section><h1>Teil</h1>\n<p>Developer friendly \'get shit done\' Node.js web framework based on\n<a href="https://expressjs.com/">Express.js</a> and <a href="https://www.mongodb.com/">MongoDB</a> via\n<a href="http://mongoosejs.com/">Mongoose</a>. Comes with batteries and charger - quickly\nsketch a working API server and get your MVP up and running in no-time.</p>\n<h2>Features</h2>\n<h3>Get started with a new project in under a minute</h3>\n<p>Initialize a new Node.js project and install Teil:</p>\n<pre><code class="hljs language-shell">mkdir teil-blog\ncd teil-blog\nnpm init -y\nnpm install teil\n</code></pre>\n<p>Add the <code>dev</code> command to <code>package.json</code>:</p>\n<pre><code class="hljs language-javascript"><span class="hljs-string">"scripts"</span>: {\n  <span class="hljs-string">"dev"</span>: <span class="hljs-string">"teil"</span>\n}\n</code></pre>\n<p>And start Teil with the <code>dev</code> command:</p>\n<pre><code class="hljs language-shell">npm run dev\n</code></pre>\n<p>From here on you do not need to restart the server. Every changes you make, like\nadding new routes, will be automatically applied.</p>\n<h4><a href="https://mustardamus.github.io/teil/installation">Read more about Installation</a></h4>\n<h3>Create new routes and models by simply creating files</h3>\n<ul>\n<li>Reload routes and models on file changes</li>\n<li>Make use of destructuring to have tight controllers</li>\n<li>Create fully fledged Mongoose models by simple objects</li>\n<li>Automatically wire models to controllers</li>\n<li>Validate data before it hits your routes</li>\n<li>Validate and alter data when its leaving your routes</li>\n<li>Automatically load middleware</li>\n<li>Automatically start and connect to MongoDB</li>\n<li>Lovely logging</li>\n<li>Includes ready to use libraries like Lodash, Validator.js and Superstruct</li>\n<li>All configurable via a single file</li>\n</ul>\n<h2>Create a simple Blog in 5 minutes</h2>\n<p>You\'ll need to have Node.js, NPM and MongoDB installed.</p>\n<h3>Initialize a new Teil project</h3>\n<pre><code class="hljs language-bash">mkdir teil-blog\n<span class="hljs-built_in">cd</span> teil-blog\nyarn init -y\nyarn add teil\n</code></pre>\n<p>In the <code>package.json</code>, add the <code>dev</code> command:</p>\n<pre><code class="hljs language-json"><span class="hljs-string">"scripts"</span>: {\n  <span class="hljs-attr">"dev"</span>: <span class="hljs-string">"teil"</span>\n}\n</code></pre>\n<p>And start the app:</p>\n<pre><code class="hljs language-bash">yarn dev\n</code></pre>\n<h3>Create a <code>Post</code> model</h3>\n<p>Create the file <code>models/post.js</code> with the following code:</p>\n<pre><code class="hljs language-javascript"><span class="hljs-built_in">module</span>.exports = {\n  <span class="hljs-attr">options</span>: {\n    <span class="hljs-attr">timestamps</span>: <span class="hljs-literal">true</span>\n  },\n\n  <span class="hljs-attr">schema</span>: {\n    <span class="hljs-attr">title</span>: { <span class="hljs-attr">type</span>: <span class="hljs-built_in">String</span>, <span class="hljs-attr">required</span>: <span class="hljs-literal">true</span> },\n    <span class="hljs-attr">content</span>: { <span class="hljs-attr">type</span>: <span class="hljs-built_in">String</span> },\n\n    <span class="hljs-attr">excerpt</span>: {\n      <span class="hljs-attr">type</span>: <span class="hljs-built_in">String</span>,\n      <span class="hljs-attr">validate</span>: {\n        <span class="hljs-attr">validator</span>: <span class="hljs-function"><span class="hljs-params">val</span> =&gt;</span> val.length &lt;= <span class="hljs-number">140</span>,\n        <span class="hljs-attr">message</span>: <span class="hljs-string">\'Excerpt must not exceed 140 characters\'</span>\n      }\n    }\n  }\n}\n</code></pre>\n<p>If your MongoDB weren\'t started already, Teil would do that for you. The new\nmodel is picked up automatically and is ready to use in controllers.</p>\n<p>Note that we use Mongoose\'s option to automatically create timestamps for us.</p>\n<p>Also note how we define a Mongoose schema in the model and define a custom\nvalidator for the <code>excerpt</code> field.</p>\n<h3>Create a <code>Posts</code> controller</h3>\n<p>Create the file <code>controllers/posts.js</code> with the following code:</p>\n<pre><code class="hljs language-javascript"><span class="hljs-built_in">module</span>.exports = {\n  <span class="hljs-string">\'GET /\'</span> ({ send }) {\n    send(<span class="hljs-string">\'index route\'</span>)\n  },\n\n  <span class="hljs-string">\'POST /create\'</span> ({ send }) {\n    send(<span class="hljs-string">\'create route\'</span>)\n  }\n}\n</code></pre>\n<p>Teil will automatically set up the routes for you at\n<a href="http://localhost:3003/api/posts">/api/posts</a> and\n<a href="http://localhost:3003/api/posts/create">/api/posts/create</a>.</p>\n<p>The filename is used as the resource-name, <code>posts</code>, in the route. Each exported\nfunction has a name formatted as <code>[http-method] [express-route]</code>, and will\nautomatically mount under the parent resource in a RESTful way.</p>\n<p>Note that we use destructuring in the first parameter of the function. <code>send</code>\nis the same as <code>res.send</code> if we would use traditional Express.js callbacks.</p>\n<h3>Creating a <code>Post</code></h3>\n<p>Update the <code>POST /create</code> route like so:</p>\n<pre><code class="hljs language-javascript"><span class="hljs-string">\'POST /create\'</span> ({ send, body, Post }) {\n  <span class="hljs-keyword">const</span> post = <span class="hljs-keyword">new</span> Post(body)\n  post.save().then(<span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> send(post))\n}\n</code></pre>\n<p>As you can see we get the <code>body</code> object from the context. This is the same as\n<code>req.body</code> if we would traditional Express.js callbacks. This object contains\nthe <code>POST</code>ed data.</p>\n<p>Next we get the <code>Post</code> model from the context. This is the Mongoose model we\nhave created just a second ago.</p>\n<p>We create a new <code>Post</code> with the posted data and send back the object.</p>\n<p>Lets try it out with <code>curl</code>:</p>\n<pre><code class="hljs language-bash">curl -H <span class="hljs-string">"Content-Type: application/json"</span> \\\n     -d <span class="hljs-string">\'{"title":"Post 1","excerpt":"Post 1 excerpt","content":""}\'</span> \\\n     -X POST http://localhost:3003/api/posts/create\n</code></pre>\n<p>This will, as expected, return:</p>\n<pre><code class="hljs language-json">{\n  <span class="hljs-attr">"_id"</span>:<span class="hljs-string">"5a6a0a74665a830d56bfe362"</span>,\n  <span class="hljs-attr">"title"</span>:<span class="hljs-string">"Post 1"</span>,\n  <span class="hljs-attr">"excerpt"</span>:<span class="hljs-string">"Post 1 excerpt"</span>,\n  <span class="hljs-attr">"content"</span>:<span class="hljs-string">""</span>,\n  <span class="hljs-attr">"createdAt"</span>:<span class="hljs-string">"2018-01-25T16:48:52.620Z"</span>,\n  <span class="hljs-attr">"updatedAt"</span>:<span class="hljs-string">"2018-01-25T16:48:52.620Z"</span>,\n  <span class="hljs-attr">"__v"</span>:<span class="hljs-number">0</span>\n}\n</code></pre>\n<h3>Adding <code>body</code> validation</h3>\n<p>In our <code>Post</code> model we defined earlier, we forgot to set the <code>required</code>\nvalidation to the <code>content</code> field. That\'s why we could create a <code>Post</code> without\ncontent.</p>\n<p>For the sake of this example, lets not add that validation to the model, but to\nthe route.</p>\n<p>Change the <code>POST /create</code> route to:</p>\n<pre><code class="hljs language-javascript"><span class="hljs-string">\'POST /create\'</span>: [\n  {\n    <span class="hljs-attr">body</span>: {\n      <span class="hljs-attr">title</span>: <span class="hljs-string">\'isNotEmpty\'</span>,\n      <span class="hljs-attr">excerpt</span>: <span class="hljs-string">\'isNotEmpty\'</span>,\n      <span class="hljs-attr">content</span>: <span class="hljs-string">\'isNotEmpty\'</span>\n    }\n  },\n  ({ send, body, Post }) =&gt; {\n    <span class="hljs-keyword">const</span> post = <span class="hljs-keyword">new</span> Post(body)\n    post.save().then(<span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> send(post))\n  }\n]\n</code></pre>\n<p>Note that <code>POST /create</code> is now an Array instead of a Function. We moved our\nroute handler Function to the end of the Array. The first Array item is an\nObject that defines the validations we want to perform.</p>\n<p>In this example we want to validate the <code>body</code> data. Each field should not be\nempty.</p>\n<p>Lets try creating a <code>Post</code> with a empty <code>content</code> field again:</p>\n<pre><code class="hljs language-bash">curl -H <span class="hljs-string">"Content-Type: application/json"</span> \\\n     -d <span class="hljs-string">\'{"title":"Post 2","excerpt":"Post 2 excerpt","content":""}\'</span> \\\n     -X POST http://localhost:3003/api/posts/create\n</code></pre>\n<p>The request will fail with a 500 status and returns:</p>\n<pre><code class="hljs">Expected a value of<span class="hljs-built_in"> type </span>`isNotEmpty` <span class="hljs-keyword">for</span> `content` but received `<span class="hljs-string">""</span>`.\n</code></pre>\n<p>Enter some content and the request will succeed as before returning the <code>Post</code>s\ndata.</p>\n<h3>Listing all the posts</h3>\n<p>Now lets update the <code>GET /</code> route like so:</p>\n<pre><code class="hljs language-javascript"><span class="hljs-string">\'GET /\'</span> ({ send, Post }) {\n  Post.find().exec().then(<span class="hljs-function"><span class="hljs-params">posts</span> =&gt;</span> send(posts))\n}\n</code></pre>\n<p>Navigate to <a href="http://localhost:3003/api/posts">/api/posts</a> to see all the <code>Post</code>s\nwe have created so far. Easy peasy.</p>\n<h3>Altering the response data</h3>\n<p>Lets say in our index route we only want to return a bare minimum on data for\neach <code>Post</code>.</p>\n<p>Change the <code>GET /</code> route like so:</p>\n<pre><code class="hljs language-javascript"><span class="hljs-string">\'GET /\'</span>: [\n  {\n    response ({ data, <span class="hljs-attr">_</span>: { pick } }) {\n      <span class="hljs-keyword">return</span> data.map(<span class="hljs-function"><span class="hljs-params">post</span> =&gt;</span> pick(post, <span class="hljs-string">\'_id\'</span>, <span class="hljs-string">\'title\'</span>, <span class="hljs-string">\'excerpt\'</span>))\n    }\n  },\n  ({ send, Post }) =&gt; {\n    Post.find().exec().then(<span class="hljs-function"><span class="hljs-params">posts</span> =&gt;</span> send(posts))\n  },\n],\n</code></pre>\n<p>This is the same Array style we have created for the other route, the first item\nis an Object that defines validations, and the second one is the route handler\nFunction.</p>\n<p>Note that instead of a validation Object, we define <code>response</code> as a function. We\npass in the <code>data</code> that is send back, as well as the <code>pick</code> Function from\nLodash.</p>\n<p>We <code>map</code> each <code>Post</code> and use the <code>pick</code> Function to only pick the fields we\nactually want to return.</p>\n<p>Navigate to <a href="http://localhost:3003/api/posts">/api/posts</a> and see the much\nslimmer response.</p>\n<h2>Development</h2>\n<h3>Commands (<code>yarn *</code>)</h3>\n<h4><code>test</code></h4>\n<p>Runs the tests.</p>\n<h4><code>test:watch</code></h4>\n<p>Re-run tests on file changes.</p>\n<h4><code>lint</code></h4>\n<p>Linting all the code.</p>\n<h4><code>docs:dev</code></h4>\n<p>Starts the <code>./docs</code> Nuxt app on <a href="http://localhost:9991">localhost:9991</a>.</p>\n<h4><code>docs:generate</code></h4>\n<p>Generate a static version of the documentation. TODO</p>\n<h4><code>docs:publish</code></h4>\n<p>Publish the generated documentation to <code>gh-pages</code>. TODO</p>\n<h4><code>docs</code></h4>\n<p>Run <code>docs:generate</code> and <code>docs:publish</code> in sequence. TODO</p>\n</section>\n'},MT1B:function(s,e,n){"use strict";var a=function(){var s=this.$createElement;return(this._self._c||s)("div",{domProps:{innerHTML:this._s(this.readMe)}})};a._withStripped=!0;var t={render:a,staticRenderFns:[]};e.a=t}});