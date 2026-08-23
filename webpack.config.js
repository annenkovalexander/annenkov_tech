const path = require("path");

const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isProduction = process.env.NODE_ENV === "production";
const shouldAnalyze = process.env.ANALYZE === "true";

const postcssOptions = {
  postcssOptions: {
    plugins: [
      require("@zeecoder/postcss-container-query"),
      require("postcss-preset-env")({
        features: {
          "nesting-rules": true,
        },
      }),
    ],
  },
};

const getStyleLoaders = ({ modules = false } = {}) => [
  isProduction ? MiniCssExtractPlugin.loader : "style-loader",

  {
    loader: "css-loader",
    options: {
      modules: modules
        ? {
            localIdentName: isProduction
              ? "[hash:base64:6]"
              : "[name]__[local]___[hash:base64:5]",
          }
        : undefined,

      importLoaders: 2,
      sourceMap: !isProduction,
    },
  },

  {
    loader: "postcss-loader",
    options: {
      ...postcssOptions,
      sourceMap: !isProduction,
    },
  },

  {
    loader: "sass-loader",
    options: {
      sourceMap: !isProduction,
    },
  },
];

module.exports = {
  mode: isProduction ? "production" : "development",

  target: "web",

  entry: {
    main: path.resolve(__dirname, "./src/index.tsx"),
  },

  devtool: isProduction ? "source-map" : "eval-source-map",

  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },

      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: "babel-loader",
      },

      {
        test: /\.html$/i,
        use: {
          loader: "html-loader",
          options: {
            sources: {
              list: [
                "...",
                {
                  tag: "script",
                  attribute: "src",
                  type: "src",
                  filter: (tag, attribute, attributes) => {
                    const src = attributes?.src || "";

                    return src.endsWith(".js");
                  },
                },
              ],
            },
          },
        },
      },

      {
        test: /\.module\.scss$/i,
        use: getStyleLoaders({
          modules: true,
        }),
      },

      {
        test: /\.scss$/i,
        exclude: /\.module\.scss$/i,
        use: getStyleLoaders(),
      },

      {
        test: /\.module\.css$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",

          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: isProduction
                  ? "[hash:base64:6]"
                  : "[name]__[local]___[hash:base64:5]",
              },

              importLoaders: 0,
              sourceMap: !isProduction,
            },
          },
        ],
      },

      {
        test: /\.css$/i,
        exclude: /\.module\.css$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",

          {
            loader: "css-loader",
            options: {
              importLoaders: 0,
              sourceMap: !isProduction,
            },
          },
        ],
      },

      {
        test: /\.(png|jpe?g|gif|webp|svg)$/i,
        type: "asset/resource",

        generator: {
          filename: "images/[name].[contenthash][ext]",
        },
      },

      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",

        generator: {
          filename: "fonts/[name].[contenthash][ext]",
        },
      },
    ],
  },

  plugins: [
    new ESLintPlugin({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      scriptLoading: "defer",
    }),

    new Dotenv({
      systemvars: true,
    }),

    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[name].[contenthash].chunk.css",
    }),

    ...(shouldAnalyze
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "bundle-report.html",
            generateStatsFile: true,
            statsFilename: "stats.json",
          }),
        ]
      : []),
  ],

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },

  output: {
    path: path.resolve(__dirname, "./dist"),

    filename: "js/[name].[contenthash].js",

    chunkFilename: "js/[name].[contenthash].chunk.js",

    assetModuleFilename: "assets/[name].[contenthash][ext]",

    clean: true,

    publicPath: process.env.PUBLIC_PATH || "/",

    uniqueName: "only-digital",

    crossOriginLoading: "anonymous",
  },

  optimization: {
    minimize: isProduction,

    moduleIds: "deterministic",

    chunkIds: "deterministic",

    runtimeChunk: {
      name: "runtime",
    },

    splitChunks: {
      chunks: "all",

      minSize: 20 * 1024,

      maxAsyncRequests: 20,

      maxInitialRequests: 20,

      name: false,

      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          idHint: "vendors",
        },

        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },

  performance: {
    hints: isProduction ? "warning" : false,

    maxAssetSize: 300 * 1024,

    maxEntrypointSize: 300 * 1024,
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "./dist"),
    },

    compress: true,

    historyApiFallback: true,

    port: 4001,

    hot: true,

    open: false,
  },

  stats: {
    preset: "normal",

    colors: true,

    assets: true,

    chunks: true,

    modules: false,

    children: false,
  },
};