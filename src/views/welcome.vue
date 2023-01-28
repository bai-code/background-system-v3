<template>
  <div class="welcome">
    <h2>Welcome</h2>
    <h3>欢迎登录电商管理系统</h3>
  </div>
</template>

<style scoped lang="less">
  div.welcome{
  text-align: center;
    h2,h3{
      font-weight: bolder;
      // background: linear-grad;
      background-image: linear-gradient(red 0, green 100%);
      -webkit-background-clip:text;
      color: transparent;
    }
    h2{
      font-size: 36px;
    }
    h3{
      font-size: 30px;
      margin-top: 20px;
    }
  }
</style>