import React from 'react'
import Link from 'gatsby-link'
import { Container } from 'react-responsive-grid'
import Sidebar from '../components/Sidebar'
import './index.css';

import { rhythm, scale } from '../utils/typography'
import '../css/prism.css';

class Template extends React.Component {
  render() {
    const { location, children } = this.props
    let header

    let rootPath = `/`
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      rootPath = __PATH_PREFIX__ + `/`
    }

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={'/'}
          >
            High Redux Docs
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: 0,
            marginBottom: rhythm(-1),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={'/'}
          >
            High Redux Docs
          </Link>
        </h3>
      )
    }
    return (
      <Container
      >
        <div className="HR__Page">
          <div className="HR__Sidebar">
            <Sidebar items={this.props.data.allMarkdownRemark.edges.map(x => x.node)} />
          </div>
          <div
            className="HR__Content"
            style={{
              maxWidth: rhythm(24),
              padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
            }}
          >
            {header}
            {children()}
          </div>
        </div>
      </Container>
    )
  }
}

export const query = graphql`
  query SidebarQuery {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___lesson], order: ASC }
    ) {
      edges {
        node {
          fields {
            slug
          }
          excerpt
          timeToRead
          frontmatter {
            title
          }
        }
      }
    }
  }
`

export default Template
