/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 16:31:28
 * @Last Modified by: gww
 * @Last Modified time: 2019-02-01 11:06:08
 */

let path = require('path')

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/otastarter': {
        // target: proxyIPs.WANLI,
        target: 'http://tapi240.mdguanjia.com/otastarter/', // 'http://192.168.0.31:8010/otastarter'
        changeOrigin: true,
        pathRewrite: {
          '^/otastarter': ''
        }
      }
    },
    host: '0.0.0.0',
    port: 1314,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false,
    devtool: 'eval-source-map',
    cssSourceMap: false,
    useEslint: true,
    showEslintErrorsInOverlay: false
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    // history路由打包到根路径
    assetsPublicPath: '/',
    productionSourceMap: false,
    devtool: '#source-map',
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
