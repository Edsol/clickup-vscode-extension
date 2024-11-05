const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'out'),
        },
        compress: true,
        hot: true,
        liveReload: true,
        port: 3000,
        allowedHosts: 'all',
        watchFiles: ['src/**/*'],
    },
});
