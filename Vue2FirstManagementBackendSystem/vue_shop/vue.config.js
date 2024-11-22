// 自定义webpack配置
/* jshint esversion: 6 */
module.exports = {
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js');

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      });

      config.plugin('html').tap(args => {
        args[0].isProd = true;
        return args;
      });
    });

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js');

      config.plugin('html').tap(args => {
        args[0].isProd = false;
        return args;
      });
    });
  }
};
// configureWebpack 链式编程
// chainWebpack 操作对象
