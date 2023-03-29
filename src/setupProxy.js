const { createProxyMiddleware } = require('http-proxy-middleware'); 

module.exports = function(app){ 
	app.use( 
		createProxyMiddleware('/mng', { 
			target: 'http://mng.enuri.com:8080',
			changeOrigin: true 
		}) 
	) 
};