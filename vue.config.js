const { defineConfig } = require('@vue/cli-service')
const path = require('path')

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
  },
  pluginOptions:{
    'style-resources-loader':{
      preProcessor:'less',
      patterns:[
        path.resolve(__dirname, './src/tools/globalStyle.less')
      ]
    }
  }
})
