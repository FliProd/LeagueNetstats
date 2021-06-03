const path = require('path');

module.exports = {
    mode: "development",
    entry: ['babel-polyfill', path.resolve(__dirname, 'LeagueStats/frontend/src/index.js')],
    output: {
        // options related to how webpack emits results

        // where compiled files go prod vs dev
        path: path.resolve(__dirname, "LeagueStats/frontend/static/frontend/public/"),//"LeagueStats/static/frontend/public/"),//

        // where files are served from prod vs dev
        publicPath: "/frontend/static/frontend/public/",//"/static/frontend/public/",//
        filename: 'main.js',  // the same one we import in index.html
        sourceMapFilename: "main.js.map",
    },
    devtool: "source-map",
    module: {
        // configuration regarding modules
        rules: [
            {
                // regex test for js and jsx files
                test: /\.(js|jsx)?$/,
                // don't look in the node_modules/ folder
                exclude: /node_modules/,
                // for matching files, use the babel-loader
                use: {
                    loader: "babel-loader",
                    options: {presets: ["@babel/env"]}
                },
            }
        ],
    },
};