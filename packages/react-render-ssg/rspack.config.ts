import type { Configuration } from "@rspack/cli";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const args = process.argv.slice(2);
const map = args.reduce((acc, arg) => {
  const [key, value] = arg.split("=");
  acc[key] = value || "";
  return acc;
}, {} as Record<string, string>);
const outputFileName = map["--output-filename"];

const config: Configuration = {
  context: __dirname,
  entry: {
    index: "./.temp/client-side-entry.tsx",
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  builtins: {
    define: {
      "__DEV__": JSON.stringify(isDev),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.PUBLIC_URL": JSON.stringify("."),
    },
    pluginImport: [
      {
        libraryName: "@arco-design/web-react",
        customName: "@arco-design/web-react/es/{{ member }}",
        style: true,
      },
      {
        libraryName: "@arco-design/web-react/icon",
        customName: "@arco-design/web-react/icon/react-icon/{{ member }}",
        style: false,
      },
    ],
  },
  module: {
    rules: [
      { test: /\.svg$/, type: "asset" },
      {
        test: /\.less$/,
        use: [
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
                importLoaders: true,
                localIdentName: "[name]__[hash:base64:5]",
              },
            },
          },
        ],
        type: "css",
      },
    ],
  },
  devtool: isDev ? "source-map" : false,
  target: "es5",
  output: {
    chunkLoading: "jsonp",
    chunkFormat: "array-push",
    publicPath: isDev ? "" : "./",
    path: path.resolve(__dirname, "dist"),
    filename: isDev
      ? "[name].bundle.js"
      : outputFileName
      ? `${outputFileName}.js`
      : "[name].[contenthash].js",
    chunkFilename: isDev ? "[name].chunk.js" : "[name].[contenthash].js",
    assetModuleFilename: isDev ? "[name].[ext]" : "[name].[contenthash].[ext]",
  },
};

export default config;

// https://www.rspack.dev/
