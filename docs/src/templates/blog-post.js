import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'

import { rhythm, scale } from '../utils/typography'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    let html = post.html;

    let rootPath = `/`
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      rootPath = __PATH_PREFIX__ + `/`

      html = html.replace(/(<a[^]*?href=")([^"]+)(")/g, (m, prefix, href, suffix) => {
        let newHref = href;
        if (href[0] === '/') {
          newHref = rootPath + href.slice(1);
          console.log(newHref)
        }

        return prefix + newHref + suffix;
      });
    }

    return (
      <div id="foo">
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <h1>{}</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
      }
    }
  }
`
