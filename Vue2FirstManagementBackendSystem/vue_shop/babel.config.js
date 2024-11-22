/* jshint esversion: 6 */
// 这是项目发布阶段需要用到的 babel 插件
const prodPlugins = [];
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console');
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的插件
    ...prodPlugins,
    // 路由懒加载
    '@babel/plugin-syntax-dynamic-import'
  ]
};
