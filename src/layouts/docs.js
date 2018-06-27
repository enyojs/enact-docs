import React from 'react';
import PropTypes from 'prop-types';

import Page from '../components/Page';
import TOCList from '../components/TOCList';

export default class DocsLayout extends React.Component {
	static propTypes = {
		children: PropTypes.func
	}

	render () {
		const {children, ...rest} = this.props;
		return (
			<Page
				// title={rest.data.site.siteMetadata.title}
				nav
				{...rest}
			>
				<TOCList modules={[...rest.data.markdownMetadata.edges, ...rest.data.jsMetadata.edges]} location={rest.location} />
				{children()}
			</Page>
		);
	}
}

export const query = graphql`
	query DocsLayoutQuery {
		site {
			siteMetadata {
				title
			}
		}

		docsPages: allSitePage(
			filter:{
				path:{regex: "/\/docs/"}
			}
		) {
			edges {
				node {
					path
					context{
						title
					}
				}
			}
		}

		markdownMetadata: allMarkdownRemark(
			filter:{
				fields:{
					slug: {regex: "/docs\\//"}
				}
			}
		) {
			edges{
				node{
					fields {
						slug
					}
					frontmatter {
						title
					}
				}
			}
		}
		jsMetadata: allJavascriptFrontmatter (
			filter:{
				fields:{
					slug: {regex: "/docs\\//"}
				}
			}
		) {
			edges{
				node{
					fields {
						slug
					}
					fileAbsolutePath
					frontmatter {
						title
					}
				}
			}
		}
	}
`;

