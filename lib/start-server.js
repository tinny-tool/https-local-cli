const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const sslDir = path.join(process.cwd(), 'ssl');

function startServer(port, directory, proxyTarget, proxyPath) {
  const app = express();

  if (proxyTarget && proxyPath) {
    console.log(`Proxying requests from ${proxyPath} to ${proxyTarget}`);
    app.use(proxyPath, createProxyMiddleware({ 
      target: proxyTarget, 
      changeOrigin: true,
      pathRewrite: {
        [`^${proxyPath}`]: '', // 移除代理路径前缀
      },
    }));
  }
  
  if (directory) {
    app.use(express.static(directory));
  } else {
    app.get('/', (req, res) => {
      res.send('Hello, HTTPS world!');
    });
  }

  const httpsOptions = {
    key: fs.readFileSync(path.join(sslDir, 'localhost.key')),
    cert: fs.readFileSync(path.join(sslDir, 'localhost.crt')),
  };

  https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`HTTPS server running on https://localhost:${port}`);
    if (proxyTarget && proxyPath) {
      console.log(`Proxying ${proxyPath} to ${proxyTarget}`);
    }
    console.log('Remember to add the certificates to your system trust store.');
  });
}

module.exports = startServer;
