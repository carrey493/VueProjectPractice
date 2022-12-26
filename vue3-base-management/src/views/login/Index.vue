<template>
  <div class="login-wrap">
    <div class="form-wrap">
      <el-form :model="loginData" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="loginData.name" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginData.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button>退出</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "Login",
  /* setup() {
    // const data = reactive({});
    // do not use same name with ref

    const store = useStore();
    const count = store.state.number.count;
    const login = () => {
      console.log("login!");
      console.log(
        "初次获取count的值是",
        store.state.number.count,
        store.getters["number/countStatus"]
      );
      store
        .dispatch("number/setCountPromise", 100)
        .then((res) => {
          console.log("dispatch后的结果", res);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(
        "修改后的count的值是",
        store.state.number.count,store.getters,
        store.getters["number/countStatus"]
      );
    };

    const data = reactive({
      form: {
        name: "",
        password: "",
        num: count,
      },
      login,
      numStatus: store.getters["number/countStatus"],
    });

    return {
      ...toRefs(data),
    };
  }, */
  setup() {
    const store = useStore();
    const router = useRouter();
    const data = reactive({
      loginData: {
        name: "",
        password: "",
      },
    });
    const handleLogin = () => {
      store.commit("setUserInfo", data.loginData);
      localStorage.setItem('loginData',JSON.stringify(data.loginData))
      //跳转页面
      router.push({
        path: "/home",
      });
    };
    return {
      ...toRefs(data),
      handleLogin,
    };
  },
};
</script>

<style lang="less" scoped>
.login-wrap {
  width: 100vw;
  height: 100vh;
  background: rgb(34, 119, 230);
  position: relative;
  .form-wrap {
    width: 400px;
    height: 200px;
    padding: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 20px;
  }
}
</style>