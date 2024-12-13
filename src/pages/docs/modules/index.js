import {graphql, withPrefix} from 'gatsby';
import {StaticImage as Image} from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import {Component} from 'react';
import {Helmet} from 'react-helmet';

import {Row} from '@enact/ui/Layout';
import GridItem from '../../../components/GridItem';
import Page from '../../../components/DocsPage';
import SiteSection from '../../../components/SiteSection';
import SiteTitle from '../../../components/SiteTitle';

import libraryDescriptions from '../../../data/libraryDescription.json';

import css from '../../../css/main.module.less';
import componentCss from './index.module.less';

export const frontmatter = {
	title: 'API Libraries',
	description: 'Enact API Documentation'
};

const Doc = class ReduxDocList extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired
	};

	render () {
		const {data} = this.props;
		// TODO: pre-filter
		const componentDocs = data.modulesList.edges.filter((page) =>
			page.node.fields.slug.includes('/docs/modules/'));
		let lastLibrary;
		let coreLogo, i18nLogo, sandstoneLogo, spotlightLogo, uiLogo, webosLogo;
		// assign each library its logo
		for (let i = 0; i < data.image.edges.length; i ++) {
			if (data.image.edges[i].node.publicURL.includes('core')) {
				coreLogo = data.image.edges[i].node.publicURL;
			} else if (data.image.edges[i].node.publicURL.includes('i18n')) {
				i18nLogo = data.image.edges[i].node.publicURL;
			} else if (data.image.edges[i].node.publicURL.includes('sandstone')) {
				sandstoneLogo = data.image.edges[i].node.publicURL;
			} else if (data.image.edges[i].node.publicURL.includes('spotlight')) {
				spotlightLogo = data.image.edges[i].node.publicURL;
			} else if (data.image.edges[i].node.publicURL.includes('ui')) {
				uiLogo = data.image.edges[i].node.publicURL;
			} else if (data.image.edges[i].node.publicURL.includes('webos')) {
				webosLogo = data.image.edges[i].node.publicURL;
			}
		}

		const packageImages = {
			core: coreLogo,
			i18n: i18nLogo,
			sandstone: sandstoneLogo,
			spotlight: spotlightLogo,
			ui: uiLogo,
			webos: webosLogo
		};

		return (
			<Page {...this.props}>
				<SiteTitle {...this.props} title={frontmatter.title}>
					<SiteSection className={css.libraryList + ' covertLinks'}>
						<Helmet>
							<meta name="description" content={frontmatter.description} />
						</Helmet>
						<h1 className={css.withCaption}><Image className={css.image} alt="Building blocks" loading="eager" placeholder="none" src="../images/modules.svg" />{frontmatter.title}</h1>
						<div className={css.caption}>
							<p>Select a library to explore the Enact API</p>
						</div>
						<Row wrap style={{margin: '0 3em'}}>
							{componentDocs.map((section, index) => {
								const linkText = section.node.fields.slug.replace('/docs/modules/', '').replace(/\/$/, '');
								const library = linkText.split('/')[0];
								if (library && libraryDescriptions[library] && library !== lastLibrary) {
									lastLibrary = library;
									const image = libraryDescriptions[library].icon ?
										withPrefix(libraryDescriptions[library].icon) :
										packageImages[library];
									return (
										<GridItem
											className={componentCss.gridItem}
											key={index}
											to={section.node.fields.slug}
											description={libraryDescriptions[library].description}
											style={{marginBottom: '1em'}}
											version={libraryDescriptions[library].version}
										>
											<img className={componentCss.image} alt="" src={image} />
											<strong>{library}</strong> Library
										</GridItem>
									);
								}
							})}
						</Row>
					</SiteSection>
				</SiteTitle>
			</Page>
		);
	}
};

export const jsonQuery = graphql`
	query modulesDoc {
		modulesList: allJsonDoc(
			sort: {fields: {slug: ASC}}
		) {
			edges {
				node {
					fields {
						slug
					}
				}
			}
		}
		image: allFile(
			filter: {extension: {in: "svg"}, relativeDirectory: {eq: "docs/images"}, name: {regex: "/package/"}, publicURL: {}}
		) {
			edges {
				node {
					publicURL
				}
			}
		}
	}
`;

export default Doc;
