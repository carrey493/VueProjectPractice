<script setup></script>

<template>
  <div class="test">test scss</div>
  <!-- 一级路由出口组件 -->
  <RouterView />
</template>

<style scoped lang="scss">
.test {
  color: $priceColor;
}
</style>
