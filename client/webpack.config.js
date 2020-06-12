const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const {CheckerPlugin} = require("awesome-typescript-loader");
const PACKAGE = require("./package.json");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Library output details
let FILE_NAME = "game1";
let LIBRARY_NAME = PACKAGE.name;
let mode = "production";
process.argv.forEach((value, index, array) => {
    if (value === "--mode") {
        mode = array[index + 1];
    }
});
let isDev = mode === "development";
let isProd = !isDev;
console.error("mode: " + mode);
console.error("isDev: " + isDev);
console.error("isProd: " + isProd);
console.error("LIBRARY_NAME: " + LIBRARY_NAME);
// Build, source, etc paths
let PATHS = {
    entryPoint: "./ts/Main.ts",
    entryPointKey: "main",
    dist: path.resolve(__dirname, "dist"),
    nodeModules: path.resolve(__dirname, "node_modules")
};
console.warn("PATHS.nodeModules: " + PATHS.nodeModules);

// Webpack config
module.exports = {
    mode: mode,
    context: path.resolve("src"),
    entry: {
        [PATHS.entryPointKey]: [PATHS.entryPoint]
    },
    devtool: "source-map",
    output: {
        path: PATHS.dist,
        filename: "[name].js",
        libraryTarget: "umd",
        library: LIBRARY_NAME,
        umdNamedDefine: true
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    optimization: {
        minimize: isProd,
        minimizer: [new UglifyJsPlugin({
            include: /.js$/
        })]
    },
    module: {
        rules: [
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }, {
                test: /\.css/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                exclude: /node_modules/,
                query: {
                    declaration: false,
                }
            }]
    },
    plugins: [
        new CheckerPlugin(),
        new CopyPlugin([
            {
                from: PATHS.nodeModules + "/pixi.js/dist/" + (isDev ? "pixi.js" : "pixi.min.js"),
                to: PATHS.dist + "/libs/pixi.js"
            }, {
                from: PATHS.nodeModules + "/pixi.js/dist/" + (isDev ? "pixi.js.map" : "pixi.min.js.map"),
                to: PATHS.dist + "/libs/pixi.js.map"
            }, {
                from: PATHS.nodeModules + "/@pixi/filter-glow/dist/filter-glow.js",
                to: PATHS.dist + "/libs/filter-glow.js"
            }, {
                from: PATHS.nodeModules + "/howler/dist/" + (isDev ? "howler.js" : "howler.min.js"),
                to: PATHS.dist + "/libs/howler.js"
            }, {
                from: path.resolve(__dirname, "src/assets/config.json"),
                to: PATHS.dist + "/assets/config.json"
            }
        ]),
        new HtmlWebpackPlugin({
            favicon:"./assets/favicon/alf_like.jpg",
            cache:isProd,
            filename: "index.html",
            template: "./html/Main.html",
            chunks: ["main"]
        })
    ],
    externals: [
        // Thank you: https://www.proofbyexample.com/typescript-pixi-webpack.html
        {"pixi.js": "PIXI"},
        {"howler.js": "Howl"},
        {"@pixi/filter-glow": "GlowFilter"},
    ]
}