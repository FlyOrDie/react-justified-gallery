import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Gallery from '../../lib/reactJustifiedGallery';

const images = [
	{
		imageMainUrl: 'http://fakeimg.pl/4000x2500/',
		thumbnailUrl: 'http://fakeimg.pl/1080x640/',
		dimensions: {
			width: 1080,
			height: 640,
		},
	},
	{
		imageMainUrl: 'http://fakeimg.pl/2500x4000/',
		thumbnailUrl: 'http://fakeimg.pl/640x1080/',
		dimensions: {
			width: 640,
			height: 1080,
		},
	},
	{
		imageMainUrl: 'http://fakeimg.pl/2500x2500/',
		thumbnailUrl: 'http://fakeimg.pl/1080x1080/',
		dimensions: {
			width: 1080,
			height: 1080,
		},
	},
	{
		imageMainUrl: 'http://fakeimg.pl/2500x4000/',
		thumbnailUrl: 'http://fakeimg.pl/640x1080/',
		dimensions: {
			width: 640,
			height: 1080,
		},
	},
	{
		imageMainUrl: 'http://fakeimg.pl/2500x2500/',
		thumbnailUrl: 'http://fakeimg.pl/1080x1080/',
		dimensions: {
			width: 1080,
			height: 1080,
		},
	},
	{
		imageMainUrl: 'http://fakeimg.pl/4000x2500/',
		thumbnailUrl: 'http://fakeimg.pl/1080x640/',
		dimensions: {
			width: 1080,
			height: 640,
		},
	},
	{
		imageMainUrl: 'http://fakeimg.pl/4000x2500/',
		thumbnailUrl: 'http://fakeimg.pl/1080x640/',
		dimensions: {
			width: 1080,
			height: 640,
		},
	},
	{
		imageMainUrl: 'http://fakeimg.pl/2500x4000/',
		thumbnailUrl: 'http://fakeimg.pl/640x1080/',
		dimensions: {
			width: 640,
			height: 1080,
		},
	},
	{
		imageMainUrl: 'http://fakeimg.pl/2500x2500/',
		thumbnailUrl: 'http://fakeimg.pl/1080x1080/',
		dimensions: {
			width: 1080,
			height: 1080,
		},
	},
	{
		imageMainUrl: 'http://fakeimg.pl/2500x2500/',
		thumbnailUrl: 'http://fakeimg.pl/1080x1080/',
		dimensions: {
			width: 1080,
			height: 1080,
		},
	},
];
// boxes: [0.5, 1.5, 1, 1.8, 0.4, 0.7, 0.9, 1.1, 1.7, 2, 2.1],
const options = {
	boxClass: 'justified-layout-box--custom',
	containerClass: 'justified-layout-container--custom',
	containerWidth: 500,
	boxSpacing: 5,
	targetRowHeight: 90,
	shouldDisplayLightbox: true,
	lightboxOptions: {
		clickOutsideToClose: true,
		enableZoom: false,
		animationDisabled: false,
		imagePadding: 50,
	},
	targetRowHeightTolerance: 0.4,
};

ReactDom.render(
	<Gallery
		images={ images }
		options={ options }
	/>,
	document.getElementById('gallery')
);
