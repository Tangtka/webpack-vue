const webpackConfig = require('./../webpack.config.js');
const {merge} = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')     //清除dist
const MiniCssExtractPlugin = require("mini-css-extract-plugin")   //提取css
const optimizeCss = require('optimize-css-assets-webpack-plugin'); // 引入cssnano配置压缩选项
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
const HappyPack = require('happypack');     //单进程转多进程
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');    // 缓存第三方模块 hard-source-webpack-plugin ，这个插件会去对比修改了哪些配置，只去打包修改过了的配置 第一次打包速度正常，第二次打包速度能提升 50%+
const CompressionWebpackPlugin = require('compression-webpack-plugin');  // g-zip压缩可以将已经压缩过的js，css再次压缩一遍，减少了打包大小，需要nginx配置
const MinifyPlugin = require("babel-minify-webpack-plugin"); //loader的时候由于文件大小通常非常大，所以会慢很多，所以这个插件有个作用，就是可以在loader的时候进行优化，减少一定的文件体积。
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //js后处理，具有剔除注释、代码压缩等功能。

module.exports = merge(webpackConfig, {
  mode: 'production',
  devtool: 'none',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            }
          }, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            }
          }, 'css-loader', 'postcss-loader', 'sass-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: ['happypack/loader?id=happyBabel'],
        exclude: /node_modules/,
        include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].css",
    }),
    new optimizeCss({
      cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      },
      canPrint: false //是否将插件信息打印到控制台
    }),
    new HappyPack({
      id: 'happyBabel',
      loaders: ['babel-loader?cacheDirectory'],
      threadPool: happyThreadPool
    }),
    new HardSourceWebpackPlugin(),
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test:  /\.(js|css)$/,
      threshold: 10240, // 只有大小大于10k的资源会被处理
      minRatio: 0.8 // 压缩比例，值为0 ~ 1
    }),
    new MinifyPlugin(),
    new UglifyJsPlugin({
      test: /\.js($|\?)/i
    })
  ]
})
