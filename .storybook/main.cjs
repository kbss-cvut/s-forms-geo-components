/*module.exports = {
    "stories": [
      "../src/!**!/!*.stories.mdx",
      "../src/!**!/!*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons": [
      "@storybook/addon-links",
      "@storybook/addon-essentials",
      "@storybook/addon-interactions"
    ],
    "framework": "@storybook/react"
}*/

const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = {
    "stories": [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons": [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions"
    ],
    "framework": "@storybook/react",
    webpackFinal: async (config, { configType }) => {
        // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
        // You can change the configuration based on that.
        // 'PRODUCTION' is used when building the static version of storybook.

        // Make whatever fine-grained changes you need
        config.module.rules.push({
            test: /\.jsx?$/,
            use: [
                {
                    loader: "babel-loader",
                    options: { presets: ['@babel/env','@babel/preset-react'] }
                }
            ],
            include: [path.resolve(__dirname, '../'),
                path.resolve(__dirname, '../node_modules/@react-leaflet/core'),
                path.resolve(__dirname, '../node_modules/react-leaflet')],

        });

        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        });
        // Return the altered config
        return config;
    },
};

