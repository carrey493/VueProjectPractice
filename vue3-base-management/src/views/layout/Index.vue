
  <template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <Header />
      </el-header>
      <el-container>
        <el-aside>
          <Sidebar />
        </el-aside>
        <el-container>
          <el-main
            >
            <router-view></router-view>
          </el-main>
          <el-footer
            >
            <Footer />
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from "../../components/common/Header.vue";
import Footer from "../../components/common/Footer.vue";
import Sidebar from '@/components/common/Sidebar'
export default {
  components: { Header, Footer ,Sidebar},
  name: "Layout",
};
</script>

<style lang="less" scoped>

</style>