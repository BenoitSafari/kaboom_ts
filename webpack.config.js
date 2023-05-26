const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const webpackConfig = () => ({
    entry: path.resolve(__dirname, "./src/game.ts"),
    devtool: "source-map",
    devServer: {
        static: "./dist",
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "game.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: "Zelda Kaboom",
            hash: true,
        }),
        new CopyPlugin({
            patterns: ["./assets/sprites"],
        }),
    ],
});

module.exports = webpackConfig;
