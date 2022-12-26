<template>
  <div class="common-sidebar">
    <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :router="true"
      @open="handleOpen"
      @close="handleClose"
    >
    <el-menu-item index="/home"
            ><el-icon :size="20"> <HomeFilled /> </el-icon>首页</el-menu-item
          >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><List /></el-icon>
          <span>列表</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/commodity"
            ><el-icon :size="20"> <Goods /> </el-icon>商品列表</el-menu-item
          >
          <el-menu-item index="/commodity"
            ><el-icon :size="20"> <User /> </el-icon>用户列表</el-menu-item
          >
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Stamp /></el-icon>
          <span>权限</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/commodity">权限管理</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Layout",
  setup() {
    /* const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    }; */
  },
};
</script>

<style lang="less" scoped>
.common-sidebar {
  width: 200px;
  height: calc(100vh - 60px);
}
</style>