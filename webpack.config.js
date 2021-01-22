/*
 * @Descripttion: 
 * @version: 
 * @Author: xds
 * @Date: 2020-12-15 21:33:09
 * @LastEditors: xds
 * @LastEditTime: 2020-12-28 16:01:27
 */
const path = require('path');
const MiniCssPlugin = require('mini-css-extract-plugin'); // css提取
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 导入htmlwebpackplugin

require("@babel/polyfill");

module.exports = {
  entry: ['@babel/polyfill', './src/js/main.js'], // 入口文件
  mode: 'development', // 开发模式
  
  output: {
    // 构建后的文件名（这里指js）
    filename: 'bundle.js',
    // 构建后文件存放的位置
    path: path.resolve(__dirname, './build')
  },

  module: {
    rules: [
      // 配置css loader
      {test: /\.css$/, use: ['style-loader', 'css-loader']},

      // 配置less loader
      {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},

      // 配置scss loader
      {test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},

      // 配置图片读取
      {
        test: /\.(gif|png|jpe?g)$/, 
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]', // 构建文件名和目录设置，[name].[ext]为占位符
              esModule: false, // 是否启用es6模块系统
              puildPath: 'build', // 输出的根目录
            }
          }
        ]
      },

      // bable setting
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
        },
        exclude: '/node_modules/',
      }
    ]
  },

  // 开发服务器配置
  devServer: {
    //URL的根目录
    contentBase: path.resolve(__dirname, 'build'),
    //HTTP服务端口
    port: 8888
  },

  // 插件配置
  plugins: [
    new MiniCssPlugin({
      filename: 'css/[name].css',
    }),

    // 实例化 html自动更新插件
    new HtmlWebpackPlugin({
      chunks: ['main'], // 该文件引用的chunks数组， 等下解释：
      filename: 'index.html', // 构建后的文件
      template: 'index.html', // 源文件
    })
  ]
};
