<template>
  <div class="common-header flex space-between">
    <div class="header-title flex">
      <img class="title-logo" src="../../assets/logo.png" alt="" />
      <h1 class="title-name">Vue3管理后台</h1>
    </div>
    <div class="header-user flex">
      <div class="user-avatar">
        <el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        ></el-avatar>
      </div>
      <div class="user-logout">
        <el-button type="primary" @click="loginOut">退出</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  name: "CommonHeader",
  setup() {
    const store = useStore();
    const router = useRouter();
    const loginOut = () => {
      localStorage.removeItem("loginData");
      store.commit("setUserInfo", {});
      router.push({
        path: "/login",
      });
    };
    return { loginOut };
  },
};
</script>

<style lang="less" scoped>
.common-header {
  background-color: #409eff;
  padding: 0 20px;
  .header-title {
    .title-logo {
      width: 60px;
      height: 60px;
    }
    .title-name {
      font-size: 25px;
      line-height: 60px;
      color: white;
    }
  }
  .header-user {
    cursor: pointer;
    .user-avatar {
      margin: 8.8px 0;
    }
    .user-logout {
      line-height: 60px;
      margin-left: 10px;
    }
  }
}
</style>