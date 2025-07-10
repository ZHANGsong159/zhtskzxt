const { defineConfig } = require('@vue/cli-service');
const path = require('path');
console.log(process.env.VUE_APP_API_BASE_URL,'process.env.VUE_APP_API_BASE_URL');


module.exports = defineConfig({
  transpileDependencies: true,
  
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
    
    proxy: {
      '/fd': {
        target:`http://${process.env.VUE_APP_API_BASE_URL || 'localhost'}:8000`,
        ws: true,
        secure: false,
        changeOrigin: true,
        // pathRewrite: {
        //   '^/fd': ''
        // },
        proxyTimeout: 30000,
        logLevel: 'debug',
        headers: {
          'X-Forwarded-For': 'true'
        }
      },
    },
    
    https: false,
    
    static: {
      directory: path.join(__dirname, 'public'),
      watch: true
    }
  },
  
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/your-project-path/' : '/',
  
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'components': path.resolve(__dirname, 'src/components')
      }
    },
    performance: {
      hints: 'warning',
      maxEntrypointSize: 500000,
      maxAssetSize: 300000
    }
  },
  
  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  
  // 修复后的 CSS 配置
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.scss";`
      },
      less: {
        lessOptions: {  // 使用 lessOptions 包裹
          modifyVars: {
            'primary-color': '#1DA57A'
          },
          javascriptEnabled: true  // 通常需要启用 JS 支持
        }
      }
    }
  },
  
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(path.resolve(__dirname, 'src/icons'))
      .end();
      
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.resolve(__dirname, 'src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      });
  }
});