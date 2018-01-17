const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const getCdResolve = require('./src/componentdown/getCdResolve');

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(limit: 1000) {
              edges {
                node {
                  html
                  fileAbsolutePath
                  fields {
                    slug
                  }
                }
              }
            }
            site {
              siteMetadata {
                title
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
          return;
        }

        // Create blog posts pages.
        _.each(result.data.allMarkdownRemark.edges, edge => {
          createPage({
            path: edge.node.fields.slug,
            component: getCdResolve(blogPost, edge.node.fileAbsolutePath, {
              html: edge.node.html,
              site: result.data.site,
            }),
            context: {
              slug: edge.node.fields.slug,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
