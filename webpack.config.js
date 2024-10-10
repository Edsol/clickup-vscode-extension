const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/webView/index.tsx',
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: 'webview.js',
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', 'jsx'],
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
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'out'),
        },
        compress: true,
        hot: true,  // HMR disabilitato
        liveReload: false,  // Abilita il live reload
        port: 3000,
        allowedHosts: 'all',
        watchFiles: ['src/**/*'],
    },
};
