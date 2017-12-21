var path = require('path');
 
module.exports = {
  devtool: 'source-map',
  entry: './src/app.js',
  output: {
    filename: './build.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
	  inline:true,
	  port:5500
  }
};