/**
 * 开发环境 webpack 配置
 */
const pathBuilder = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 建立在基础配置基础上
const generateBaseConfig = require('./webpack.base.js');

// 被代理服务器（请求转入服务器）
// const localUrl = 'http://192.168.100.1:9090';

// 开发环境 html 模版
const templateHtmlPath = pathBuilder.resolve('template.index.html');

// 开发环境配置入口
module.exports = function (env) {
    const {output = './dist'} = env;
    const config = generateBaseConfig(env, 'development');
    const outputParts = output.split('/');
    const targetPath = pathBuilder.resolve(...outputParts);
    return {
        ...config,
        optimization: {
            // 开发环境舍弃 minimize 和 minimizer 压缩配置，以达到编译速度提升的效果
            splitChunks: config.optimization.splitChunks
        },
        // 使用开发环境 html 模版
        plugins:config.plugins.concat([
            new HtmlWebpackPlugin({
                plugin: 'html',
                filename: pathBuilder.resolve(...outputParts, 'index.html'),
                template: templateHtmlPath,
                inject: true
            })
        ]),
        // 配置开发虚拟服务
        devServer: {
            // 刷新时，让当前域名下的url访问 index.html
            historyApiFallback: true,
            // 热编译
            hot: true,
            // 不检查访问机器IP，即允许其他机器访问开发虚拟服务
            disableHostCheck: true,
            // 服务器主目录配置
            contentBase: targetPath,
            // 虚拟服务器IP
            host: "0.0.0.0",
            serveIndex: false,
            // 虚拟服务器端口
            port: 8080,
            // 指定代理url
            // proxy: {
            //     '/api/*': {
            //         target: localUrl,
            ////         注意，如果使用一些特殊服务器，加上 changeOrigin，如不加虚拟服务转发时会变成 http://localhost:8080/https://some.place.com/api/xxxx
            //         changeOrigin: true,
            //         secure: false
            //     },
            //     '/public/*': {
            //         target: localUrl,
            //         secure: false
            //     }
            // }
        }
    };
};