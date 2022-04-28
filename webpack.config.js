const path = require('path');
const keysTransformer = require('ts-transformer-keys/transformer').default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const devMode = process.env.NODE_ENV !== "production"

module.exports = {
    mode: devMode ? "development" : "production",
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        // make sure not to set `transpileOnly: true` here, otherwise it will not work
                        getCustomTransformers: program => ({
                            before: [
                                keysTransformer(program)
                            ]
                        })
                    }
                }
                
            },
            {
                test: /\.css$/i,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    'css-loader',
                    "postcss-loader",
                ],
            },
        ],
        
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        host: 'localhost',
        port: 8080,
    },
    experiments: {
        asyncWebAssembly: true,
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
};