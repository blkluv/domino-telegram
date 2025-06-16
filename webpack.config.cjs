const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './src/app.ts',
    //devtool: "inline-source-map",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    devServer: {
        static: path.join(__dirname, "dist"),
        compress: true,
        port: 4000,
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: 'src/assets/', to: 'assets'},
                {from: "html", to: ""}
            ]
        }),
        /*new HtmlWebpackPlugin({
            title: 'Development'
        })*/
    ]
};