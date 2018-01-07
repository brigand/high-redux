webpackJsonp([0xdc9a17534acd],{484:function(n,s){n.exports={data:{site:{siteMetadata:{title:"High Redux"}},markdownRemark:{id:"/Users/fb/github/brigand/high-redux/docs/src/pages/HrState.md absPath of file >>> MarkdownRemark",html:'<h2 id="basics"><a href="#basics" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Basics</h2>\n<p>HrState is the internal data shape for your high-redux reducers. Normally you\ndon’t interact with it directly, but instead go through the the <a href="/HrQuery">HrQuery</a>\ninterface. Documenting it here might help you understand how high-redux works.</p>\n<p>We’ll start with the formal type definition, and then go into examples. Note that\nthis describes an interface (a defined type of JS primitives), not a <code>class</code>. It’s\ntypically wrapped in an <code>HrStateWrapper</code> class instance to allow updates, or\nan <code>HrQuery</code> class instance to query it for data.</p>\n<h2 id="type"><a href="#type" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Type</h2>\n<p>If you’re unfamiliar with type annotation syntax, don’t worry about it. The examples\nshould give you a better idea of how it looks. The full structure of the state:</p>\n<!-- BEGIN_GENERATED TYPE HrState -->\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">export</span> type HrState <span class="token operator">=</span> <span class="token punctuation">{</span>\n  isHrState<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n  byId<span class="token punctuation">:</span> HrStateById<span class="token punctuation">,</span>\n  lists<span class="token punctuation">:</span> HrStateList<span class="token punctuation">,</span>\n  kv<span class="token punctuation">:</span> HrStateKv<span class="token punctuation">,</span>\n  <span class="token comment">// TODO: implement this in some way</span>\n  <span class="token comment">// receipts: { [key: string]: any },</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<!-- END_GENERATED TYPE -->\n<!-- BEGIN_GENERATED TYPE HrStateById -->\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>type HrStateById <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token punctuation">[</span>type<span class="token punctuation">:</span> string<span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token punctuation">{</span> <span class="token punctuation">[</span>id<span class="token punctuation">:</span> string<span class="token punctuation">]</span><span class="token punctuation">:</span> HrStateDesc<span class="token operator">&lt;</span>any<span class="token operator">></span> <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<!-- END_GENERATED TYPE -->\n<!-- BEGIN_GENERATED TYPE HrStateList -->\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>type HrStateList <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token punctuation">[</span>type<span class="token punctuation">:</span> string<span class="token punctuation">]</span><span class="token punctuation">:</span> HrStateDesc<span class="token operator">&lt;</span>Array<span class="token operator">&lt;</span>any<span class="token operator">>></span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<!-- END_GENERATED TYPE -->\n<!-- BEGIN_GENERATED TYPE HrStateKv -->\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>type HrStateKv <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token punctuation">[</span>type<span class="token punctuation">:</span> string<span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token punctuation">{</span> <span class="token punctuation">[</span>id<span class="token punctuation">:</span> string<span class="token punctuation">]</span><span class="token punctuation">:</span> HrStateDesc<span class="token operator">&lt;</span>any<span class="token operator">></span> <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<!-- END_GENERATED TYPE -->\n<p>You may notice the <code>HrStateDesc</code> types. They’re a consistent interface to describing\na record in state. While in classic redux you often store data without any metadata,\nhaving this available by default ensures you can track things like loading and error\nstates as your code evolves.</p>\n<p>There’s also the ‘etc’ property, where you can put any custom data you want.</p>\n<!-- BEGIN_GENERATED TYPE HrStateDesc -->\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">export</span> type HrStateDesc<span class="token operator">&lt;</span>T<span class="token operator">></span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  loading<span class="token punctuation">:</span> boolean<span class="token punctuation">,</span>\n  hasError<span class="token punctuation">:</span> boolean<span class="token punctuation">,</span>\n  error<span class="token punctuation">:</span> <span class="token operator">?</span>any<span class="token punctuation">,</span>\n  value<span class="token punctuation">:</span> T<span class="token punctuation">,</span>\n  loadingStartTime<span class="token punctuation">:</span> number<span class="token punctuation">,</span>\n  loadingCompleteTime<span class="token punctuation">:</span> number<span class="token punctuation">,</span>\n  etc<span class="token punctuation">:</span> Object<span class="token punctuation">,</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<!-- END_GENERATED TYPE HrStateDesc -->\n<h2 id="examples"><a href="#examples" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Examples</h2>\n<p>First, let’s look at what a blank state looks like. We simply return the\n<code>HrStateWrapper</code> without making any changes.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> reducer <span class="token punctuation">}</span> <span class="token operator">=</span> hr<span class="token punctuation">.</span><span class="token function">makeHr</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'example\'</span><span class="token punctuation">,</span>\n  actions<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    TEST<span class="token punctuation">:</span> s <span class="token operator">=></span> s<span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> state <span class="token operator">=</span> <span class="token function">runReducer</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> <span class="token punctuation">{</span> type<span class="token punctuation">:</span> <span class="token string">\'TEST\'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">print</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<!-- BEGIN_GENERATED FROM_CODE_ABOVE -->\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token punctuation">{</span>\n  <span class="token string">"isHrState"</span><span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n  <span class="token string">"byId"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"lists"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"kv"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<!-- END_GENERATED FROM_CODE_ABOVE -->\n<p>Now it gets a little more interesting. We’re setting an item by id using the\ndefault key, which is the same as <code>s.key(\'[[default]]\').id(...</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> reducer <span class="token punctuation">}</span> <span class="token operator">=</span> hr<span class="token punctuation">.</span><span class="token function">makeHr</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'example\'</span><span class="token punctuation">,</span>\n  actions<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    SET_ID<span class="token punctuation">:</span> <span class="token punctuation">(</span>s<span class="token punctuation">,</span> payload<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>\n      s<span class="token punctuation">.</span><span class="token function">id</span><span class="token punctuation">(</span>payload<span class="token punctuation">.</span>id<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">set</span><span class="token punctuation">(</span>payload<span class="token punctuation">.</span>data<span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> state <span class="token operator">=</span> <span class="token function">runReducer</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  type<span class="token punctuation">:</span> <span class="token string">\'SET_ID\'</span><span class="token punctuation">,</span>\n  payload<span class="token punctuation">:</span> <span class="token punctuation">{</span> id<span class="token punctuation">:</span> <span class="token string">\'123\'</span><span class="token punctuation">,</span> data<span class="token punctuation">:</span> <span class="token punctuation">{</span> name<span class="token punctuation">:</span> <span class="token string">\'John\'</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">print</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<!-- BEGIN_GENERATED FROM_CODE_ABOVE -->\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token punctuation">{</span>\n  <span class="token string">"isHrState"</span><span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n  <span class="token string">"byId"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"[[default]]"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"123"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"loading"</span><span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n        <span class="token string">"hasError"</span><span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n        <span class="token string">"error"</span><span class="token punctuation">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>\n        <span class="token string">"value"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n          <span class="token string">"name"</span><span class="token punctuation">:</span> <span class="token string">"John"</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"loadingStartTime"</span><span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n        <span class="token string">"loadingCompleteTime"</span><span class="token punctuation">:</span> <span class="token number">1515293027801</span><span class="token punctuation">,</span>\n        <span class="token string">"etc"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"lists"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"kv"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<!-- END_GENERATED FROM_CODE_ABOVE -->\n<p>We could set some metadata with object. In this case, we set the loading state,\nand it also captures <code>loadingStartTime</code> for us.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> reducer <span class="token punctuation">}</span> <span class="token operator">=</span> hr<span class="token punctuation">.</span><span class="token function">makeHr</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'example\'</span><span class="token punctuation">,</span>\n  actions<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    FETCH_USER_START<span class="token punctuation">:</span> <span class="token punctuation">(</span>s<span class="token punctuation">,</span> payload<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>\n      s<span class="token punctuation">.</span><span class="token function">id</span><span class="token punctuation">(</span>payload<span class="token punctuation">.</span>id<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setLoading</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> state <span class="token operator">=</span> <span class="token function">runReducer</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  type<span class="token punctuation">:</span> <span class="token string">\'FETCH_USER_START\'</span><span class="token punctuation">,</span>\n  payload<span class="token punctuation">:</span> <span class="token punctuation">{</span> id<span class="token punctuation">:</span> <span class="token string">\'123\'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">print</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<!-- BEGIN_GENERATED FROM_CODE_ABOVE -->\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token punctuation">{</span>\n  <span class="token string">"isHrState"</span><span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n  <span class="token string">"byId"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"[[default]]"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"123"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"loading"</span><span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n        <span class="token string">"hasError"</span><span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n        <span class="token string">"error"</span><span class="token punctuation">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>\n        <span class="token string">"value"</span><span class="token punctuation">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>\n        <span class="token string">"loadingStartTime"</span><span class="token punctuation">:</span> <span class="token number">1515293027805</span><span class="token punctuation">,</span>\n        <span class="token string">"loadingCompleteTime"</span><span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n        <span class="token string">"etc"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"lists"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"kv"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<!-- END_GENERATED FROM_CODE_ABOVE -->\n<p>The key/value store works identically to the <code>id</code> store, but <code>list</code> is somewhat\ndifferent. Instead of each item having its own descriptor, the entire list\nhas one descriptor.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> reducer <span class="token punctuation">}</span> <span class="token operator">=</span> hr<span class="token punctuation">.</span><span class="token function">makeHr</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'example\'</span><span class="token punctuation">,</span>\n  actions<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    FETCH_LETTERS_SUCCESS<span class="token punctuation">:</span> <span class="token punctuation">(</span>s<span class="token punctuation">,</span> payload<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>\n      s<span class="token punctuation">.</span><span class="token function">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">set</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> state <span class="token operator">=</span> <span class="token function">runReducer</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  type<span class="token punctuation">:</span> <span class="token string">\'FETCH_LETTERS_SUCCESS\'</span><span class="token punctuation">,</span>\n  payload<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">\'a\'</span><span class="token punctuation">,</span> <span class="token string">\'b\'</span><span class="token punctuation">,</span> <span class="token string">\'c\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">print</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<!-- BEGIN_GENERATED FROM_CODE_ABOVE -->\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token punctuation">{</span>\n  <span class="token string">"isHrState"</span><span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n  <span class="token string">"byId"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"lists"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"[[default]]"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"loading"</span><span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n      <span class="token string">"hasError"</span><span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n      <span class="token string">"error"</span><span class="token punctuation">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>\n      <span class="token string">"value"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>\n        <span class="token string">"a"</span><span class="token punctuation">,</span>\n        <span class="token string">"b"</span><span class="token punctuation">,</span>\n        <span class="token string">"c"</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token string">"loadingStartTime"</span><span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n      <span class="token string">"loadingCompleteTime"</span><span class="token punctuation">:</span> <span class="token number">1515293027806</span><span class="token punctuation">,</span>\n      <span class="token string">"etc"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"kv"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<!-- END_GENERATED FROM_CODE_ABOVE -->\n<p>For all of the types, you can also set a custom key.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> reducer <span class="token punctuation">}</span> <span class="token operator">=</span> hr<span class="token punctuation">.</span><span class="token function">makeHr</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'example\'</span><span class="token punctuation">,</span>\n  actions<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    FETCH_LETTERS_SUCCESS<span class="token punctuation">:</span> <span class="token punctuation">(</span>s<span class="token punctuation">,</span> payload<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>\n      s<span class="token punctuation">.</span><span class="token function">key</span><span class="token punctuation">(</span><span class="token string">\'my-key\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">set</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> state <span class="token operator">=</span> <span class="token function">runReducer</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  type<span class="token punctuation">:</span> <span class="token string">\'FETCH_LETTERS_SUCCESS\'</span><span class="token punctuation">,</span>\n  payload<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">\'a\'</span><span class="token punctuation">,</span> <span class="token string">\'b\'</span><span class="token punctuation">,</span> <span class="token string">\'c\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">print</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<!-- BEGIN_GENERATED FROM_CODE_ABOVE -->\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token punctuation">{</span>\n  <span class="token string">"isHrState"</span><span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n  <span class="token string">"byId"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"lists"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"my-key"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"loading"</span><span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n      <span class="token string">"hasError"</span><span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n      <span class="token string">"error"</span><span class="token punctuation">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>\n      <span class="token string">"value"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>\n        <span class="token string">"a"</span><span class="token punctuation">,</span>\n        <span class="token string">"b"</span><span class="token punctuation">,</span>\n        <span class="token string">"c"</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token string">"loadingStartTime"</span><span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n      <span class="token string">"loadingCompleteTime"</span><span class="token punctuation">:</span> <span class="token number">1515293027807</span><span class="token punctuation">,</span>\n      <span class="token string">"etc"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"kv"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<!-- END_GENERATED FROM_CODE_ABOVE -->\n<p>We could go into many more examples, but this should give you the general idea.</p>\n<h2 id="summary"><a href="#summary" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Summary</h2>\n<p>The <code>HrState</code> type is a future-proof interface to managing redux state. It makes\nfew assumptions about how you want to use it.</p>',
frontmatter:{title:"HrState"}}},pathContext:{slug:"/HrState/"}}}});
//# sourceMappingURL=path---hr-state-e583f714346b91064c9d.js.map