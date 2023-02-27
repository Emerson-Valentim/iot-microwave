const path = require('path');

module.exports = {
	entry: './src/index.ts',
  target: "node",
  optimization: {
    minimize: false,
  },
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
        options: {
          transpileOnly: true,
        },
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
    libraryTarget: "commonjs",
		filename: 'index.js',
		path: path.resolve(__dirname, 'build'),
	},
};
