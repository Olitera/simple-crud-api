const path = require("path");
const nodeExternals = require('webpack-node-externals')

const config = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
    ],
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 4000,
  },
};

// export default config;
