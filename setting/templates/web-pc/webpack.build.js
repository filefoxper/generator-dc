/**
 * 生产环境 webpack 配置
 */
const fs = require('fs');
const pathBuilder = require('path');
// html 模版编译插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 基本 webpack 配置
const generateBaseConfig = require('./webpack.base.js');
const _ = require('lodash');

// 编译生产环境使用的html模版
const templateHtmlPath = pathBuilder.resolve('template.index.html');

module.exports = function (env) {
    const {output = './dist'} = env;
    const config = generateBaseConfig(env, 'production');
    const outputParts = output.split('/');
    return {
        ...config,
        resolve:{
            ...config.resolve,
            // 使用 agent-reducer/es 进行打包体积优化
            alias:{
                'agent-reducer': 'agent-reducer/es',
                'use-agent-reducer': 'use-agent-reducer/es',
            }
        },
        module:{
            rules:config.module.rules.concat([
                // 使用 agent-reducer/es 进行打包体积优化
                {
                    test: /\.js$|\.ts$|\.tsx$/,
                    include: /(node_modules\/agent-reducer\/es|node_modules\/use-agent-reducer\/es)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true
                            }
                        }
                    ]
                }
            ])
        },
        plugins:config.plugins.concat([
            new HtmlWebpackPlugin({
                plugin: 'html',
                filename: pathBuilder.resolve(...outputParts, 'index.html'),
                template: templateHtmlPath,
                inject: true
            })
        ])
    };
};