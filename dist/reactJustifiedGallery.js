'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLayoutJustified = require('react-layout-justified');

var _reactLayoutJustified2 = _interopRequireDefault(_reactLayoutJustified);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactImageLightbox = require('react-image-lightbox');

var _reactImageLightbox2 = _interopRequireDefault(_reactImageLightbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import cn from 'classnames';


var ReactJustifiedGallery = function (_Component) {
	_inherits(ReactJustifiedGallery, _Component);

	function ReactJustifiedGallery(props) {
		_classCallCheck(this, ReactJustifiedGallery);

		var _this = _possibleConstructorReturn(this, (ReactJustifiedGallery.__proto__ || Object.getPrototypeOf(ReactJustifiedGallery)).call(this, props));

		_this.onBind();
		_this.init();
		return _this;
	}

	_createClass(ReactJustifiedGallery, [{
		key: 'onBind',
		value: function onBind() {
			this.render = this.render.bind(this);
			this.init = this.init.bind(this);
			this.closeLightbox = this.closeLightbox.bind(this);
			this.generateInnerElements = this.generateInnerElements.bind(this);
			this.generateImageInfoForLightbox = this.generateImageInfoForLightbox.bind(this);

			this.closeLightbox = this.closeLightbox.bind(this);
			this.moveNext = this.moveNext.bind(this);
			this.movePrev = this.movePrev.bind(this);
			this.indexImages = this.indexImages.bind(this);
			this.onImageClicked = this.onImageClicked.bind(this);
		}
	}, {
		key: 'init',
		value: function init() {
			this.state = {
				images: this.indexImages(this.props.images),
				currentImageNum: null,
				isOpen: false
			};
		}
	}, {
		key: 'calculateAspectRatio',
		value: function calculateAspectRatio() {
			var images = this.props.images;

			var firstElemDimensions = images[0].dimensions;

			if (typeof firstElemDimensions === 'number') return images;

			return _lodash2.default.map(images, function (imageInfo) {
				return imageInfo.dimensions.width / imageInfo.dimensions.height;
			});
		}
	}, {
		key: 'generateInnerElements',
		value: function generateInnerElements() {
			var _this2 = this;

			var images = this.props.images;


			return _lodash2.default.map(images, function (image, index) {
				var styles = {
					width: '100%',
					height: '100%',
					backgroundSize: 'contain',
					backgroundImage: 'url(' + (image.thumbnailUrl || image.imageMainUrl) + ')'
				};

				return _react2.default.createElement('div', { onClick: _this2.onImageClicked.bind(_this2, image.index), key: index, style: styles });
			});
		}
	}, {
		key: 'generateImageInfoForLightbox',
		value: function generateImageInfoForLightbox() {}
	}, {
		key: 'indexImages',
		value: function indexImages(images) {
			return _lodash2.default.map(images, function (image, index) {
				image.index = index;
				return image;
			});
		}
	}, {
		key: 'onImageClicked',
		value: function onImageClicked(index) {
			this.setState({ isOpen: true, currentImageNum: index });
		}
	}, {
		key: 'closeLightbox',
		value: function closeLightbox() {
			this.setState({ isOpen: false, currentImageNum: null });
		}
	}, {
		key: 'moveNext',
		value: function moveNext() {
			this.setState({ currentImageNum: (this.state.currentImageNum + 1) % this.state.images.length });
		}
	}, {
		key: 'movePrev',
		value: function movePrev() {
			this.setState({ currentImageNum: (this.state.currentImageNum + this.state.currentImageNum.length - 1) % this.state.currentImageNum.length });
		}
	}, {
		key: 'render',
		value: function render() {
			var options = this.props.options;
			var _state = this.state;
			var images = _state.images;
			var currentImageNum = _state.currentImageNum;
			var isOpen = _state.isOpen;
			var shouldDisplayLightbox = options.shouldDisplayLightbox;
			var lightboxOptions = options.lightboxOptions;


			var justifiedLayoutOptions = _lodash2.default.pick(options, 'containerClass', 'boxClass', 'containerWidth', 'maxNumRows', 'containerPadding', 'boxSpacing', 'targetRowHeight', 'targetRowHeightTolerance');

			justifiedLayoutOptions.boxes = this.calculateAspectRatio();

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(_reactLayoutJustified2.default, {
					options: justifiedLayoutOptions,
					boxClass: justifiedLayoutOptions.boxClass,
					containerClass: justifiedLayoutOptions.containerClass,
					boxInnerElements: this.generateInnerElements()
				}),
				shouldDisplayLightbox && this.state.isOpen ? _react2.default.createElement(_reactImageLightbox2.default, _extends({
					mainSrc: images[this.state.currentImageNum].imageMainUrl,
					nextSrc: images[(this.state.currentImageNum + 1) % images.length].imageMainUrl,
					prevSrc: images[(this.state.currentImageNum + images.length - 1) % images.length].currentImageNum,

					onCloseRequest: this.closeLightbox,
					onMovePrevRequest: this.movePrev,
					onMoveNextRequest: this.moveNext
				}, lightboxOptions)) : null
			);
		}
	}]);

	return ReactJustifiedGallery;
}(_react.Component);

ReactJustifiedGallery.defaultProps = {
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
			imagePadding: 10
		},
		containerPadding: 10,
		boxSpacing: 10,
		targetRowHeight: 320,
		targetRowHeightTolerance: 0.4
	}
};
ReactJustifiedGallery.propTypes = {
	images: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
		imageMainUrl: _react2.default.PropTypes.string.isRequired,
		thumbnailUrl: _react2.default.PropTypes.string,
		dimensions: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.shape({
			width: _react2.default.PropTypes.number.isRequired,
			height: _react2.default.PropTypes.number.isRequired
		})]).isRequired
	})).isRequired,
	options: _react2.default.PropTypes.shape({
		containerClass: _react2.default.PropTypes.string,
		boxClass: _react2.default.PropTypes.string,
		containerWidth: _react2.default.PropTypes.number,
		maxNumRows: _react2.default.PropTypes.number,
		shouldDisplayLightbox: _react2.default.PropTypes.bool,
		lightboxOptions: _react2.default.PropTypes.shape({
			clickOutsideToClose: _react2.default.PropTypes.bool,
			enableZoom: _react2.default.PropTypes.bool,
			animationDisabled: _react2.default.PropTypes.bool,
			imagePadding: _react2.default.PropTypes.number
		}),
		containerPadding: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.shape({
			top: _react2.default.PropTypes.number.isRequired,
			right: _react2.default.PropTypes.number.isRequired,
			bottom: _react2.default.PropTypes.number.isRequired,
			left: _react2.default.PropTypes.number.isRequired
		})]),
		boxSpacing: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.shape({
			horizontal: _react2.default.PropTypes.string.isRequired,
			vertical: _react2.default.PropTypes.string.isRequired
		})]),
		targetRowHeight: _react2.default.PropTypes.number
	})
};
exports.default = ReactJustifiedGallery;