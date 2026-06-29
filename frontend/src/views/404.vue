<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/404.svg" alt="404" />
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__headline">找不到页面了</div>
        <div class="bullshit__info">请检查您输入的网址是否正确，或点击下面的按钮返回首页。</div>
        <router-link to="/" class="bullshit__return-home">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.wscn-http404-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.wscn-http404 {
  text-align: center;
  .pic-404 { position: relative; }
  .bullshit {
    margin-top: 30px;
  }
  .bullshit__oops { font-size: 72px; font-weight: bold; color: #1482f0; }
  .bullshit__headline { font-size: 20px; margin: 10px 0; }
  .bullshit__info { color: #666; margin-bottom: 20px; }
  .bullshit__return-home { display: inline-block; padding: 10px 30px; background: #1482f0; color: #fff; border-radius: 4px; text-decoration: none; }
}
</style>
