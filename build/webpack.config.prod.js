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
      filename: "css/[name].[hash:8].css",
      chunkFilename: "css/[id].css",
    }),
    new optimizeCss({
      cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      },
      canPrint: true //是否将插件信息打印到控制台
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
      minRatio: 0.6 // 压缩比例，值为0 ~ 1
    })
  ]
})
