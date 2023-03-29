const withPlugins = require('next-compose-plugins')
const withTM = require("next-transpile-modules")([
  "@fullcalendar/core",
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
]);

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["100.100.100.198"],
    formats: ["image/webp"]
  },
}

module.exports = withPlugins([
  [
    withTM({
      webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      name: "removeViewBox",
                      active: false,
                    },
                  ],
                },
              },
            },
          ],
        });

        return config;
      },
    })
  ],
  nextConfig
])