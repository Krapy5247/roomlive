module.exports = {
  mongoURL: 'mongodb://localhost/test001',
  http_port: 7000, //可修改
  https_port: 7001, //可修改
  cors_config: {
    origin: [
      '127.0.0.1:7001','127.0.0.1:7000' //請修改
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};
