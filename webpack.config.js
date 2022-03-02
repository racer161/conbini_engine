const path = require('path');
const keysTransformer = require('ts-transformer-keys/transformer').default;

module.exports = {
    mode: 'development',
    entry: './example/index.tsx',
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader',
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
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
};