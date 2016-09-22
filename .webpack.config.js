const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const basicExampleConfig = {

};


module.exports = (type) => {
	const basicWebpackConfig = {
		watch: true,
		plugins: [
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.OccurenceOrderPlugin()
		],
		module: {
			loaders: [
				{
					test: /\.js?$/,
					exclude: /node_modules/,
					loader: 'babel',
					query: {
						presets: [
							'es2015',
							'react',
							{
								plugins: [
									"transform-class-properties",
									"transform-es2015-destructuring",
									"transform-object-rest-spread"
								]
							}
						]
					}
				},
				{
					test: /\.hbs$/,
					exclude: /node_modules/,
					loader: 'handlebars'
				}
			]
		}
	};

	switch(type) {
		case 'EXAMPLE:BASIC':
			const templatePath = path.join(__dirname, 'examples', 'basic', 'index.hbs');

			const templateConfig = {
				title: 'Basic gallery example',
				cache: true,
				host: 'http://127.0.0.1:3000',
				template: templatePath,
				inject: false
			};
			Object.assign(basicWebpackConfig, basicExampleConfig);
			basicWebpackConfig.plugins.push(new HtmlWebpackPlugin(templateConfig));
			break;
	}

	return basicWebpackConfig;
};
