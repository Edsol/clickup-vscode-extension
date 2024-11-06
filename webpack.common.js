const path = require('path');

module.exports = {
    entry: './src/webView/frontend/index.tsx',
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: 'webview.js',
    },
    resolve: {
        extensions: ['.js', '.tsx', '.jsx'],
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@resources': path.resolve(__dirname, 'resources'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
                    }
                }
            },
            {
                test: /\.resources\/official_icons\/dark\/.svg$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgo: true,
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: 'preset-default',
                                        params: {
                                            overrides: {
                                                removeViewBox: false,
                                            },
                                        },
                                    },
                                ],
                            },
                            titleProp: true,
                            ref: true,
                        },
                    },
                ],
            },
        ],
    }
};
