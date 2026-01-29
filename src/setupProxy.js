const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://stageapi.monkcommerce.app",
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        "^/api": "",
      },
      onProxyReq: (proxyReq) => {
        // 🔥 REQUIRED HEADER
        proxyReq.setHeader("x-api-key", "72njgfa948d9aS7gs5");
      },
    })
  );
};