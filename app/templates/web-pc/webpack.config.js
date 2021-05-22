const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const apiMocker = require('webpack-api-mocker');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const pathBuilder = require('path');
const processEnv = require('./process.env.js');

const entryPath = pathBuilder.resolve('src', 'index.ts');

const templateHtmlPath = pathBuilder.resolve('template.index.html');

function entry(env) {
    const {mode,output='./dist'}=env
    const isDev = mode === 'development';
    const splitChunks = {
        chunks: 'all',
        cacheGroups: {
            commons: {
                test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|redux|react-redux|axios|moment|antd)[\\/]/,
                name: 'commons',
                chunks: "all"
            },
            antd_icons: {
                test: /[\\/]node_modules[\\/]@ant-design[\\/]icons[\\/]/,
                name: 'antd_icons',
                chunks: "all",
                enforce: true
            }
        }
    };
    const outputParts = output.split('/');
    const targetPath = pathBuilder.resolve(...outputParts);
    const indexHtml = pathBuilder.resolve(...outputParts, 'index.html');
    return {
        mode: mode ? (mode === 'analyze' ? 'production' : mode) : 'production',
        devtool: false,
        entry: {
            bundle: entryPath
        },
        output: {
            path: targetPath,
            filename: isDev ? '[name].[hash:8].js' : '[name].[chunkhash:8].js'
        },
        optimization: isDev ? {
            noEmitOnErrors: true,
            minimize: false,
            namedChunks: true,
            splitChunks: splitChunks
        } : {
            noEmitOnErrors: true,
            minimize: true,
            namedChunks: true,
            splitChunks: splitChunks
        },
        resolve: {
            extensions: ['.js', '.ts', '.tsx', '.json', 'txt'],
            plugins: [
                new TsconfigPathsPlugin({configFile: "./tsconfig.json"})
            ]
        },
        module: {
            rules: [
                {
                    test: /\.js$|\.ts$|\.tsx$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(gif|png|jpg|jpeg)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 1024
                        }
                    }
                },
                {
                    test: /\.less$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true,
                                modifyVars: {}
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.less$/,
                    include: /(node_modules|bower_components)/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true,
                                modifyVars: {}
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|eot|woff|woff2|svg)$/,
                    use: ['file-loader']
                }
            ]
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.DefinePlugin({
                'process.env': processEnv(mode)
            }),
            new HtmlWebpackPlugin({
                plugin: 'html',
                filename: indexHtml,
                template: templateHtmlPath,
                inject: true
            })
        ].concat(mode === 'analyze' ? new BundleAnalyzerPlugin() : [])
    }
}

function buildDevServerConfig(output) {
    const outputParts = output.split('/');
    const targetPath = pathBuilder.resolve(...outputParts);
    const proxyConfig = {
        proxy: {
            '/api/*': {
                target: 'http://127.0.0.1:9090',
                secure: false
            },
            '/public/*': {
                target: 'http://127.0.0.1:9090',
                secure: false
            }
        }
    };
    return {
        historyApiFallback: {
            rewrites: {from: new RegExp('^/h5/*'), to: `/index.html`}
        },
        disableHostCheck: true,
        contentBase: targetPath,
        host: "0.0.0.0",
        port: 8080,
        ...proxyConfig
    };
}

module.exports = function (env) {
    const output = env.output || '../dist';
    var devServer = env.mode === 'development' ? {devServer: buildDevServerConfig(output)} : {};
    return Object.assign({}, entry(env), devServer);
};
