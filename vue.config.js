const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    proxy:{
      '/api':{
        target:'https://www.liulongbin.top:8888/api/private/v1/',
        changeOrigin:true,
        pathRewrite:{
          '/api':''
        }
      }

    }
  }
})
