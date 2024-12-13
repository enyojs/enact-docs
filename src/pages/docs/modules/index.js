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
		let imagesFromProps = [];
		for (let i = 0; i < data.image.edges.length; i++) {
			imagesFromProps.push(data.image.edges[i].node.publicURL);
		}
		const coreLogoIndex = imagesFromProps.findIndex(index => index.includes('core'));
		const i18nLogoIndex = imagesFromProps.findIndex(index => index.includes('i18n'));
		const moonstoneLogoIndex = imagesFromProps.findIndex(index => index.includes('moonstone'));
		const spotlightLogoIndex = imagesFromProps.findIndex(index => index.includes('spotlight'));
		const uiLogoIndex = imagesFromProps.findIndex(index => index.includes('ui'));
		const webosLogoIndex = imagesFromProps.findIndex(index => index.includes('webos'));

		const packageImages = {
			core: imagesFromProps[coreLogoIndex],
			i18n: imagesFromProps[i18nLogoIndex],
			moonstone: imagesFromProps[moonstoneLogoIndex],
			spotlight: imagesFromProps[spotlightLogoIndex],
			ui: imagesFromProps[uiLogoIndex],
			webos: imagesFromProps[webosLogoIndex]
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
