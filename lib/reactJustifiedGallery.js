import React, { Component } from 'react';
import JustifiedLayout from 'react-layout-justified';
// import cn from 'classnames';
import _ from 'lodash';
import Lightbox from 'react-image-lightbox';

class ReactJustifiedGallery extends Component {
	static defaultProps = {
		options: {
			containerClass: 'justified-gallery-container',
			boxClass: 'justified-gallery-box',
			containerWidth: 530,
			maxNumRows: Number.POSITIVE_INFINITY,
			shouldDisplayLightbox: true,
			lightboxOptions: {
				clickOutsideToClose: true,
				enableZoom: false,
				animationDisabled: false,
				imagePadding: 10,
			},
			containerPadding: 10,
			boxSpacing: 10,
			targetRowHeight: 320,
			targetRowHeightTolerance: 0.4,
		},
	}

	static propTypes = {
		images: React.PropTypes.arrayOf(React.PropTypes.shape({
			imageMainUrl: React.PropTypes.string.isRequired,
			thumbnailUrl: React.PropTypes.string,
			dimensions: React.PropTypes.oneOfType([
				React.PropTypes.number,
				React.PropTypes.shape({
					width: React.PropTypes.number.isRequired,
					height: React.PropTypes.number.isRequired,
				}),
			]).isRequired,
		})).isRequired,
		options: React.PropTypes.shape({
			containerClass: React.PropTypes.string,
			boxClass: React.PropTypes.string,
			containerWidth: React.PropTypes.number,
			maxNumRows: React.PropTypes.number,
			shouldDisplayLightbox: React.PropTypes.bool,
			lightboxOptions: React.PropTypes.shape({
				clickOutsideToClose: React.PropTypes.bool,
				enableZoom: React.PropTypes.bool,
				animationDisabled: React.PropTypes.bool,
				imagePadding: React.PropTypes.number,
			}),
			containerPadding: React.PropTypes.oneOfType([
				React.PropTypes.number,
				React.PropTypes.shape({
					top: React.PropTypes.number.isRequired,
					right: React.PropTypes.number.isRequired,
					bottom: React.PropTypes.number.isRequired,
					left: React.PropTypes.number.isRequired,
				}),
			]),
			boxSpacing: React.PropTypes.oneOfType([
				React.PropTypes.number,
				React.PropTypes.shape({
					horizontal: React.PropTypes.string.isRequired,
					vertical: React.PropTypes.string.isRequired,
				}),
			]),
			targetRowHeight: React.PropTypes.number,
		}),
	}

	constructor(props) {
		super(props);

		this.onBind();
		this.init();
	}

	onBind() {
		this.render = this.render.bind(this);
		this.init = this.init.bind(this);
		this.closeLightbox = this.closeLightbox.bind(this);
		this.generateInnerElements = this.generateInnerElements.bind(this);

		this.closeLightbox = this.closeLightbox.bind(this);
		this.moveNext = this.moveNext.bind(this);
		this.movePrev = this.movePrev.bind(this);
		this.indexImages = this.indexImages.bind(this);
		this.onImageClicked = this.onImageClicked.bind(this);
	}

	init() {
		this.state = {
			images: this.props.images,
			currentImageNum: null,
			isOpen: false,
		};
	}

	calculateAspectRatio() {
		const { images } = this.props;
		const firstElemDimensions = images[0].dimensions;

		if (typeof firstElemDimensions === 'number') return images;

		return _.map(images, imageInfo => imageInfo.dimensions.width / imageInfo.dimensions.height);
	}

	generateInnerElements() {
		const { images } = this.props;
		const indexedImages = this.indexImages(images);

		return _.map(indexedImages, (image, index) => {
			const styles = {
				width: '100%',
				height: '100%',
				backgroundSize: 'contain',
				backgroundImage: `url(${image.thumbnailUrl || image.imageMainUrl})`,
			};

			return <div onClick={ this.onImageClicked.bind(this, image.index) } key={ index } style={ styles }></div>;
		});
	}

	indexImages(images) {
		return _.map(images, (image, index) => {
			image.index = index;
			return image;
		});
	}

	onImageClicked(index) {
		this.setState({ isOpen: true, currentImageNum: index });
	}

	closeLightbox() {
		this.setState({ isOpen: false, currentImageNum: null });
	}

	moveNext() {
		this.setState({ currentImageNum: (this.state.currentImageNum + 1) % this.state.images.length });
	}

	movePrev() {
		this.setState({ currentImageNum: (this.state.currentImageNum + this.state.currentImageNum.length - 1) % this.state.currentImageNum.length });
	}

	render() {
		const { options } = this.props;
		const { images, currentImageNum, isOpen} = this.state;
		const { shouldDisplayLightbox, lightboxOptions } = options;

		const justifiedLayoutOptions = _.pick(options,
			'containerClass',
			'boxClass',
			'containerWidth',
			'maxNumRows',
			'containerPadding',
			'boxSpacing',
			'targetRowHeight',
			'targetRowHeightTolerance',
		);

		justifiedLayoutOptions.boxes = this.calculateAspectRatio();

		return (
			<div>
				<JustifiedLayout
					options={ justifiedLayoutOptions }
					boxClass={ justifiedLayoutOptions.boxClass }
					containerClass={ justifiedLayoutOptions.containerClass }
					boxInnerElements={ this.generateInnerElements() }
				/>
				{ (shouldDisplayLightbox && this.state.isOpen) ? <Lightbox
					mainSrc={images[this.state.currentImageNum].imageMainUrl}
					nextSrc={images[(this.state.currentImageNum + 1) % images.length].imageMainUrl}
					prevSrc={images[(this.state.currentImageNum + images.length - 1) % images.length].currentImageNum}

					onCloseRequest={this.closeLightbox}
					onMovePrevRequest={this.movePrev}
					onMoveNextRequest={this.moveNext}
					{ ...lightboxOptions }
				/> : null }
			</div>
		);
	}
}

export default ReactJustifiedGallery;
