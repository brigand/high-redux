webpackJsonp([0xe16ec6a30657],{483:function(a,e){a.exports={data:{site:{siteMetadata:{title:"High Redux"}},markdownRemark:{id:"/Users/fb/github/brigand/high-redux/docs/src/pages/HrStateWrapper.md absPath of file >>> MarkdownRemark",html:'<h2 id="basics"><a href="#basics" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Basics</h2>\n<p>You get <code>HrStateWrapper</code> instances inside the action handlers in <a href="/makeHr"><code>makeHr</code></a>.</p>\n<p>The wrapper allows you to perform efficient, high level updates to the state object without\nmutation.</p>\n<h2 id="methods"><a href="#methods" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Methods</h2>\n<!-- BEGIN_GENERATED CLASS HrStateWrapper -->\n<h3 id="hrstatewrapperconstructor"><a href="#hrstatewrapperconstructor" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::constructor</code></h3>\n<p>Signature: <code>new HrStateWrapper(path: StatePath)</code></p>\n<p>Creates a HrStateWrapper instance. This is typically done for you.</p>\n<h3 id="hrstatewrapperinvoke"><a href="#hrstatewrapperinvoke" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::invoke</code></h3>\n<p>Signature: <code>.invoke(fn: (s: HrStateWrapper) => mixed)</code></p>\n<p>Utility for running a function without breaking the chain. Receives the\n<code>HrStateWrapper</code> as an argument.</p>\n<h3 id="hrstatewrapperid"><a href="#hrstatewrapperid" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::id</code></h3>\n<p>Signature: <code>.id(id: string)</code></p>\n<p>Returns a state wrapper for the specified <code>id</code>. You can then call methods\nlike <code>.set</code> on it.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>s<span class="token punctuation">.</span><span class="token function">id</span><span class="token punctuation">(</span><span class="token string">\'some-id\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">set</span><span class="token punctuation">(</span><span class="token string">\'some-value\'</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3 id="hrstatewrapperlist"><a href="#hrstatewrapperlist" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::list</code></h3>\n<p>Signature: <code>.list()</code></p>\n<p>Returns a state wrapper for the list.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>s<span class="token punctuation">.</span><span class="token function">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">set</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'a\'</span><span class="token punctuation">,</span> <span class="token string">\'b\'</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3 id="hrstatewrapperkv"><a href="#hrstatewrapperkv" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::kv</code></h3>\n<p>Signature: <code>.kv(kvKey: string)</code></p>\n<p>Returns a state wrapper for the specified key in the key/value pair.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>s<span class="token punctuation">.</span><span class="token function">kv</span><span class="token punctuation">(</span><span class="token string">\'some-key\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">set</span><span class="token punctuation">(</span><span class="token string">\'some-value\'</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3 id="hrstatewrapperkey"><a href="#hrstatewrapperkey" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::key</code></h3>\n<p>Signature: <code>.key(key: string)</code></p>\n<p>Returns a state wrapper for the specified sub-key.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>s<span class="token punctuation">.</span><span class="token function">key</span><span class="token punctuation">(</span><span class="token string">\'some-key\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">id</span><span class="token punctuation">(</span><span class="token string">\'some-id\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">set</span><span class="token punctuation">(</span><span class="token string">\'foo\'</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3 id="hrstatewrapperqueryroot"><a href="#hrstatewrapperqueryroot" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::queryRoot</code></h3>\n<p>Signature: <code>.queryRoot()</code></p>\n<p>Get an <code>HrQuery</code> object for the state.</p>\n<h3 id="hrstatewrapperquery"><a href="#hrstatewrapperquery" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::query</code></h3>\n<p>Signature: <code>.query()</code></p>\n<h3 id="hrstatewrapperset"><a href="#hrstatewrapperset" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::set</code></h3>\n<p>Signature: <code>.set(value: any)</code></p>\n<p>Sets the currently focused item. See the examples for <code>id</code>/<code>list</code>/<code>kv</code></p>\n<h3 id="hrstatewrappersetids"><a href="#hrstatewrappersetids" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::setIds</code></h3>\n<p>Signature: <code>.setIds(pairs: Array&#x3C;[string, any]>)</code></p>\n<p>For each item in <code>pairs</code>, map the first item in the pair (the id) to the\nsecond item (the value).</p>\n<p>Often you’ll generate this with an <code>array.map</code> call.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>s<span class="token punctuation">.</span><span class="token function">setIdPairs</span><span class="token punctuation">(</span>items<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>x <span class="token operator">=></span> <span class="token punctuation">[</span>x<span class="token punctuation">.</span>id<span class="token punctuation">,</span> x<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\ns<span class="token punctuation">.</span><span class="token function">key</span><span class="token punctuation">(</span><span class="token string">\'some-key\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setIdPairs</span><span class="token punctuation">(</span>items<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>x <span class="token operator">=></span> <span class="token punctuation">[</span>x<span class="token punctuation">.</span>id<span class="token punctuation">,</span> x<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3 id="hrstatewrapperupdate"><a href="#hrstatewrapperupdate" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::update</code></h3>\n<p>Signature: <code>.update(updater: Function)</code></p>\n<p>Update an item with the given id by passing it to the ‘updater’ function.</p>\n<h3 id="hrstatewrappersetloading"><a href="#hrstatewrappersetloading" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::setLoading</code></h3>\n<p>Signature: <code>.setLoading()</code></p>\n<p>Set the focused item to a loading state. Also captures the loading state.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>s<span class="token punctuation">.</span><span class="token function">id</span><span class="token punctuation">(</span><span class="token string">\'some-id\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setLoading</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3 id="hrstatewrappersetloadingdone"><a href="#hrstatewrappersetloadingdone" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::setLoadingDone</code></h3>\n<p>Signature: <code>.setLoadingDone()</code></p>\n<p>Set the focused item to a completed loading state.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>s<span class="token punctuation">.</span><span class="token function">id</span><span class="token punctuation">(</span><span class="token string">\'some-id\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setLoadingDone</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3 id="hrstatewrapperseterror"><a href="#hrstatewrapperseterror" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::setError</code></h3>\n<p>Signature: <code>.setError(error: ?any)</code></p>\n<p>Set the focused item to an error state. Pass <code>null</code> to clear the error state.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>s<span class="token punctuation">.</span><span class="token function">id</span><span class="token punctuation">(</span><span class="token string">\'some-id\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setError</span><span class="token punctuation">(</span><span class="token punctuation">{</span> message<span class="token punctuation">:</span> <span class="token string">\'Oops\'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3 id="hrstatewrappersetmeta"><a href="#hrstatewrappersetmeta" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::setMeta</code></h3>\n<p>Signature: <code>.setMeta(metaKey: string, metaValue: any)</code></p>\n<p>Set custom metadata for the current item.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>s<span class="token punctuation">.</span><span class="token function">id</span><span class="token punctuation">(</span><span class="token string">\'some-id\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setMeta</span><span class="token punctuation">(</span><span class="token string">\'isNew\'</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3 id="hrstatewrappergetstate"><a href="#hrstatewrappergetstate" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::getState</code></h3>\n<p>Signature: <code>.getState()</code></p>\n<p>Compute the state by applying all update operations. Mostly for internal use.</p>\n<h3 id="hrstatewrapperroot"><a href="#hrstatewrapperroot" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::root</code></h3>\n<p>Signature: <code>.root()</code></p>\n<p>Get the root <code>HrStateWrapper</code> instance.</p>\n<h3 id="hrstatewrapper_pushop"><a href="#hrstatewrapper_pushop" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a><code>HrStateWrapper::_pushOp</code></h3>\n<p>Signature: <code>._pushOp(op: OpType, data: any, overrides: $Shape&#x3C;HrStateWrapperOp> = {})</code></p>\n<p>Internal: adds an operation to the queue</p>\n<!-- END_GENERATED -->\n<h2 id="summary"><a href="#summary" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Summary</h2>',frontmatter:{title:"HrStateWrapper"}}},pathContext:{slug:"/HrStateWrapper/"}}}});
//# sourceMappingURL=path---hr-state-wrapper-82347b06d2483c833f77.js.map