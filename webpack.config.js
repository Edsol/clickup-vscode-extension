const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/webView/frontend/index.tsx',
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: 'webview.js',
    },
    resolve: {
        extensions: ['.js', '.tsx', 'jsx'],
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
                                        name: 'preset-default', // Specifica il nome del plugin per evitare l'errore
                                        params: {
                                            overrides: {
                                                // Personalizza le opzioni di ottimizzazione
                                                removeViewBox: false, // Mantieni 'viewBox' per ridimensionamento e portabilità
                                            },
                                        },
                                    },
                                ],
                            },
                            titleProp: true, // Aggiunge la prop 'title' al componente SVG React
                            ref: true, // Abilita il forwarding dei ref sui componenti SVG
                        },
                    },
                ],
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
