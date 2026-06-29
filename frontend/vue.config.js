const webpack = require('webpack')

module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
   devServer: {
        port: 8081,
        host: '0.0.0.0',
        proxy: {
            '/user': { target: 'http://localhost:8080' },
            '/goods': { target: 'http://localhost:8080' },
            '/wish': { target: 'http://localhost:8080' },
            '/order': { target: 'http://localhost:8080' },
            '/message': { target: 'http://localhost:8080' },
            '/address': { target: 'http://localhost:8080' },
            '/order-address': { target: 'http://localhost:8080' },
            '/admin': { target: 'http://localhost:8080' },
            '/alipay': { target: 'http://localhost:8080' },
            '/statistics': { target: 'http://localhost:8080' },
            '/file': { target: 'http://localhost:8080' }
        }
   },
};
