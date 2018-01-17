webpackJsonp([0xf0978e2b5559],{481:function(n,a){n.exports={data:{site:{siteMetadata:{title:"High Redux"}},markdownRemark:{id:"/Users/fb/github/brigand/high-redux/docs/src/pages/intro.md absPath of file >>> MarkdownRemark",html:'<h2 id="what-is-high-redux"><a href="#what-is-high-redux" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>What is High Redux?</h2>\n<p>high-redux is a set of two primary abstractions for improving your react/redux app.\nYou can use either part on their own, or for best results, use them together.\nYou <strong>don’t</strong> need to rewrite your existing code. It’s fully compatible with\nexisting redux code, any redux middleware, <code>connect()</code>, <code>&#x3C;Provider></code>, etc.</p>\n<h2 id="install"><a href="#install" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Install</h2>\n<p>You can install it with <code>npm</code> or <code>yarn</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-sh"><code>npm install --save high-redux\nyarn add high-redux</code></pre>\n      </div>\n<p>You must also install <code>react</code>, <code>redux</code>, and <code>react-redux</code>, which you likely\nalready have. We’ll use the version you’ve installed to avoid duplicate code\nin the bundle.</p>\n<h2 id="makehr"><a href="#makehr" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>makeHr</h2>\n<p>The first abstraction is <a href="/makeHr"><code>makeHr</code></a> which creates an entity. This includes a reducer\nand selectors for that reducer. Unlike reducers you might write by hand, we generate\na highly flexible and future-proof state shape, while allowing you to ignore that\nin the basic cases of retrieving a value by id or similar.</p>\n<p>The state shape we use allows loading states, error states, and custom metadata\nfor each item the reducer manages. This also applies to lists, and key/value\ndata. We use the concept of a ‘default key’ and ‘named keys’, which work similarly\nto ES6 modules.</p>\n<p>This is a very basic example where we supposedly get a user object from an api. We’re\nnot specifying a key, so the ‘default key’ is used. In the future, we might need\nanother key-space for secondary information. You never run into a case where\nyou have to refactor the code using your reducer state when you need to track extra\ninformation.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> userHr <span class="token operator">=</span> <span class="token function">makeHr</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> <span class="token string">\'user\'</span><span class="token punctuation">,</span>\n  actions<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    FETCH_USER_SUCCESS<span class="token punctuation">:</span> <span class="token punctuation">(</span>s<span class="token punctuation">,</span> payload<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>\n      s<span class="token punctuation">.</span><span class="token function">setId</span><span class="token punctuation">(</span>payload<span class="token punctuation">.</span>id<span class="token punctuation">,</span> payload<span class="token punctuation">.</span>data<span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>For more information, see the <a href="/makeHr"><code>makeHr</code></a> documentation.</p>\n<h2 id="withprops"><a href="#withprops" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>withProps</h2>\n<p>The second abstraction is <a href="/withProps"><code>withProps</code></a> which is a wrapper around <code>react-redux</code>’s <code>connect</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token function-variable function">UserDisplay</span> <span class="token operator">=</span> <span class="token punctuation">(</span>props<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>\n  <span class="token operator">&lt;</span>div<span class="token operator">></span>\n    <span class="token punctuation">{</span>props<span class="token punctuation">.</span>data <span class="token operator">&amp;&amp;</span> <span class="token operator">&lt;</span>div<span class="token operator">></span>Hi<span class="token punctuation">,</span> <span class="token punctuation">{</span>props<span class="token punctuation">.</span>data<span class="token punctuation">.</span>name<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span><span class="token punctuation">}</span>\n  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">withProps</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token comment">// When props.id changes, dispatch { type: \'FETCH_USER\', payload: { userId: ownProps.id } }</span>\n  <span class="token punctuation">.</span><span class="token function">watchAndDispatch</span><span class="token punctuation">(</span><span class="token string">\'FETCH_USER\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> userId<span class="token punctuation">:</span> <span class="token string">\'id\'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token comment">// Create the prop \'data\' from `userHr`s state for the id we have in props</span>\n  <span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>s<span class="token punctuation">,</span> props<span class="token punctuation">)</span> <span class="token operator">=></span> s<span class="token punctuation">.</span>cars<span class="token punctuation">.</span><span class="token function">byId</span><span class="token punctuation">(</span>props<span class="token punctuation">.</span>id<span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n  <span class="token comment">// Generate our connect() and watchAndDispatch wrappers, and return the resulting</span>\n  <span class="token comment">// component.</span>\n  <span class="token punctuation">.</span><span class="token function">wrap</span><span class="token punctuation">(</span>UserDisplay<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>The above shows a very common case that would otherwise be very noisy: requiring\na class component implementing <code>componentDidMount</code> and <code>componentWillReceiveProps</code>\n(where you further have to diff props), the propTypes for the <code>FETCH_USER</code> action,\n5 lines for <code>mapStateToProps</code>, and at least 3 lines for <code>mapDispatchToProps</code>.</p>\n<p>From a technical perspective, with <code>watchAndDispatch</code> we avoid rendering in the\nstate before <code>watchAndDispatch</code> dispatches the <code>FETCH_USER</code> which might set a\nloading state or clear out the old data since it runs before <code>mapStateToProps</code>.\nThis can be a significant performance boost.</p>\n<p>The <code>.select</code> function has extra potential which will be explained in the <code>withProps</code>\nand <code>HrQuery</code> docs.</p>\n<p>For more information, see the <a href="/withProps"><code>withProps</code></a> documentation.</p>',frontmatter:{title:"Intro"}}},pathContext:{slug:"/intro/"}}}});
//# sourceMappingURL=path---intro-2528db3899aebe737297.js.map