const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// The path to the cesium source code
const cesiumSource = 'node_modules/cesium/Source/';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
    // mode: 'development',
    entry: {app:'./lib/lib.js'},
      output: {
      	path: path.resolve(__dirname, 'dist'),
          filename: '[name].bundle.js',
          library: 'CesiumSensorVolumes',
              libraryTarget: 'umd',
                      // Needed by Cesium for multiline strings
                      sourcePrefix: ''
      },
      
        // externals: {
        // 	cesium: 'Cesium'
        // },
            amd: {
            		// Enable webpack-friendly use of require in cesium
            		toUrlUndefined: true
            	},
            	node: {
            		// Resolve node module use of fs
            		fs: "empty"
            	},
          resolve: {
          	alias: {
          		// Cesium module name
          		cesium: path.resolve(__dirname, cesiumSource,"Cesium.js")
          	}
          },
      plugins: [
      	// new HtmlWebpackPlugin({
      	// 	template: 'src/index.html'
      	// }),
      	// Copy Cesium Assets, Widgets, and Workers to a static directory
      	new CopyWebpackPlugin([{
      		from: path.join(cesiumSource, cesiumWorkers),
      		to: 'Workers'
      	}]),
      	new CopyWebpackPlugin([{
      		from: path.join(cesiumSource, 'Assets'),
      		to: 'Assets'
      	}]),
      	new CopyWebpackPlugin([{
      		from: path.join(cesiumSource, 'Widgets'),
      		to: 'Widgets'
      	}]),
      	new webpack.DefinePlugin({
      		// Define relative base path in cesium for loading assets
      		CESIUM_BASE_URL: JSON.stringify('')
      	}),
      	// // Split cesium into a seperate bundle
      	// new webpack.optimization.splitChunks({
      	// 	name: 'cesium',
      	// 	minChunks: function (module) {
      	// 		return module.context && module.context.indexOf('cesium') !== -1;
      	// 	}
      	// })
      ],
      optimization:{
          splitChunks:{
              name: "cesium",
                    		// minChunks: function (module) {
                    		// 	return module.context && module.context.indexOf('cesium') !== -1;
                    		// }
          }
      },
      module: {
       		rules: [
                         {
                         	test: /\.js$/,
                         	use: ["source-map-loader"],
                         	enforce: "pre"
                         }
                   ,{
      	test: /\.(glsl|vs|fs|vert|frag)$/,
      	exclude: /node_modules/,
      	use: [
      		'raw-loader',
      		'glslify-loader'
      	]
      }]
    }
};