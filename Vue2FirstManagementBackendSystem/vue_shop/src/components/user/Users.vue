<template>
  <div>
  <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容"
          v-model="queryinfo.query" clearable @clear="getUserList">
        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
      </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 作用域插槽 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template >
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改角色" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色"
            placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"
              @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed">
    <!-- 内容主体区 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="adduser">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules"
      ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible"
    width="50%" @close="setRoleDialogClosed">
  <div>
    <p>当前的用户: {{userInfo.username}}</p>
    <p>当前的角色: {{userInfo.role_name}}</p>
    <p>分配新角色：
      <el-select v-model="selectedRoleId" placeholder="请选择">
        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
        </el-option>
      </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }
      cb(new Error('请输入合法的邮箱'));
    };
    // //验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        // 合法的邮箱
        return cb();
      }
      cb(new Error('请输入合法的手机号码'));
    };
    return {
      // 获取用户列表参数
      queryinfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前页数每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单验证规则
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名称',
            tigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名称在3~10个字符之间',
            tigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            tigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '用户密码在6~15个字符之间',
            tigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱账号',
            tigger: 'blur'

          },
          {
            validator: checkEmail,
            tigger: 'blur'
          },
          {
            min: 12,
            message: '请输入正确的邮箱账号',
            tigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            tigger: 'blur'
          },
          {
            validator: checkMobile,
            tigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '请输入12位手机号码',
            tigger: 'blur'
          }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱账号',
            tigger: 'blur'
          },
          {
            validator: checkEmail,
            tigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            tigger: 'blur'
          },
          {
            validator: checkMobile,
            tigger: 'blur'
          }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色数据列表
      roleList: [],
      // 已选中的角色Id值
      selectedRoleId: ''
    };
  },
  created () {
    this.getUserList();
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryinfo });
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败');
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryinfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newSize) {
      this.queryinfo.pagenum = newSize;
      this.getUserList();
    },
    // 监听 switch 开关状态的改变
    async userStateChanged (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}
      /state/${userinfo.mg_state}`);
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error('更新用户状态失败');
      }
      this.$message.success('更新用户状态成功');
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加新用户
    adduser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return null;
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm);

        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！');
        }

        this.$message.success('添加用户成功！');
        // 隐藏添加用户对话框
        this.addDialogVisible = false;
        // 重新获取用户列表数据
        this.getUserList();
      });
    },
    // 展示编辑用户对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id);

      if (res.meta.status !== 200) {
        return this.$message.error('查询用户失败！');
      }

      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRulesRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return;
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        });

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败');
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getUserList();
        // 提示修改成功
        this.$message.success('更新用户信息成功！');
      });
    },
    // 根据ID删除对应的用户信息
    async removeUserById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error);
      // 如果用户确认删除则返回值为字符串 confirm
      /// / 如果用户取消删除则返回值为字符串 concel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除');
      }

      const { data: res } = await this.$http.delete('users/' + id);

      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！');
      }
      this.$message.success('删除用户成功！');
      this.getUserList();
    },
    // 展示分配角色的对话框
    async setRole (userInfo) {
      this.userInfo = userInfo;

      // 在展示对话框签获取所有角色列表
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！');
      }

      this.roleList = res.data;

      this.setRoleDialogVisible = true;
    },
    // 点击按钮分配角色
    async saveRoleInfo () {
      if (!this.$message.error) {
        return this.$message.error('请选择要分配的角色！');
      }

      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`,
        { rid: this.selectedRoleId });

      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！');
      }

      this.$message.success('更新角色成功！');

      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed () {
      this.selectedRoleId = '';
      this.userInfo = {};
    }
  }
};
</script>

<style lang="less" scoped>

</style>
