

const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = (app) => {
  app.use(createProxyMiddleware('/ListarChecklist',
  { target: 'https://api.gulosinho.com'  }))};