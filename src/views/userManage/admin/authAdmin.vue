<template>
  <div class="user-box">
    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item class="query-form-item">
        <el-input v-model="query.username" placeholder="用户名"></el-input>
      </el-form-item>
      <!-- <el-form-item class="query-form-item">
        <el-select v-model="query.status" placeholder="状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </el-form-item>-->
      <!-- <el-form-item class="query-form-item">
        <el-select v-model="query.role_id" placeholder="角色">
          <el-option label="全部角色" value=""></el-option>
          <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-button-group>
          <el-button type="primary" icon="el-icon-refresh" @click="onReset"></el-button>
          <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click.native="handleForm(null,null)">新增</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      class="common-table"
      :data="list"
      style="width: 100%;"
      max-height="800"
    >
      <el-table-column label="用户 ID" align="center" prop="id" fixed></el-table-column>
      <el-table-column label="用户名" prop="username" align="center" fixed></el-table-column>
      <el-table-column label="昵称" prop="nickname" align="center" fixed></el-table-column>
      <!-- <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status | statusFilterType"
          >{{scope.row.status | statusFilterName}}</el-tag>
        </template>
      </el-table-column>-->
      <!-- <el-table-column label="登录时间" with="300" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_time }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="query.limit"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>
    <!--表单-->
    <el-dialog
      :title="formMap[formName]"
      :visible.sync="formVisible"
      :before-close="hideForm"
      width="85%"
      top="5vh"
    >
      <el-form :model="formData" :rules="formRules" ref="dataForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="formData.checkPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="formData.is_wmadmin" clearable placeholder="请选择角色">
            <el-option label="监督组" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideForm">取消</el-button>
        <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  authAdminList,
  authAdminRoleList,
  authAdminSave,
  authAdminDelete
} from "../../../api/auth/authAdmin";
const formJson = {
  password: "",
  username: "",
  status: 0,
  roles: '',
  is_wmadmin: '',
  nickname: ''
};
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      roles: [],
      rolesList: [],
      query: {
        username: "",
        status: "",
        page: 1,
        limit: 20,
        role_id: ""
      },
      list: [],
      total: 0,
      loading: true,
      index: null,
      formName: null,
      formMap: {
        add: "新增",
        edit: "编辑"
      },
      formLoading: false,
      formVisible: false,
      formData: formJson,
      formRules: {},
      addRules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "请输入昵称", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        checkPassword: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur"
          },
          { validator: validatePass2, trigger: "blur" }
        ]
      },
      editRules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "请输入昵称", trigger: "blur" }]
      },
      deleteLoading: false
    };
  },
  methods: {
    onReset() {
      this.$router.push({
        path: ""
      });
      this.query = {
        username: "",
        status: "",
        page: 1,
        limit: 20,
        role_id: ""
      };
      this.getList();
    },
    onSubmit() {
      this.$router.push({
        path: "",
        query: this.query
      });
      this.getList();
    },
    handleCurrentChange(val) {
      this.query.page = val;
      this.getList();
    },
    getList() {
      this.loading = true;
      authAdminList(this.query)
        .then(response => {
          this.loading = false
          this.list = response.admin_list.data || [];
          this.total = response.admin_list.total
        })
        .catch(() => {
          this.loading = false;
          this.total = 0
          this.list = [];
          this.roles = [];
        });
    },
    getRoleList() {
      authAdminRoleList(this.query)
        .then(response => {
          this.roles = response || [];
        })
        .catch(() => {
          this.roles = [];
        });
    },
    // 刷新表单
    resetForm() {
      if (this.$refs["dataForm"]) {
        // 清空验证信息表单
        this.$refs["dataForm"].clearValidate();
        // 刷新表单
        this.$refs["dataForm"].resetFields();
      }
    },
    // 隐藏表单
    hideForm() {
      // 更改值
      this.formVisible = !this.formVisible;
      this.formLoading = false;
      this.deleteLoading = false;
      // 清空表单
      this.resetForm();
      return true;
    },
    // 显示表单
    handleForm(index, row) {
      this.formVisible = true;
      this.formData = JSON.parse(JSON.stringify(formJson));
      if (row !== null) {
        this.formData = Object.assign({}, row);
      }
      this.formName = "add";
      this.formRules = this.addRules;
      if (index !== null) {
        this.index = index;
        this.formName = "edit";
        this.formRules = this.editRules;
      }
    },
    formSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.formLoading = true;
          this.formData.status = 0
          delete this.formData.checkPassword
          let data = Object.assign({}, this.formData);
          authAdminSave(data, this.formName).then(response => {
            if (response) {
              this.formLoading = false;
              this.$message.success("操作成功");
              this.formVisible = false;
              this.getList()
              // 刷新表单
              this.resetForm();
            } else {
              this.$message.error("操作失败");
            }
          })
        }
      });
    },
    // 删除
    handleDel(index, row) {
      if (row.id) {
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        })
          .then(() => {
            let para = { id: row.id };
            this.deleteLoading = true;
            authAdminDelete(para)
              .then(response => {
                this.deleteLoading = false;
                console.log(response)
                if (response == 'SUCCESS') {
                  this.getList()
                  this.$message.success("操作成功")
                } else {
                  this.$message.error("操作失败")
                }
              })
              .catch(() => {
                this.deleteLoading = false;
              });
          })
          .catch(() => {
            this.$message.info("取消删除");
          });
      }
    }
  },
  filters: {
    statusFilterType(status) {
      const statusMap = {
        0: "success",
        1: "danger"
      };
      return statusMap[status];
    },
    statusFilterName(status) {
      const statusMap = {
        1: "禁用",
        0: "正常"
      };
      return statusMap[status];
    }
  },
  created() {
    // 将参数拷贝进查询对象
    let query = this.$route.query;
    this.query = Object.assign(this.query, query);
    this.query.limit = parseInt(this.query.limit);
    // 加载表格数据
    this.getList();
    // 加载角色列表
    // this.getRoleList();
  }
};
</script>
<style lang="scss">
.user-box {
  .el-select {
    width: 100%;
  }
}
.query-form {
  .el-input--suffix .el-input__inner {
    padding-right: 35px;
    &:focus {
      padding-right: 35px;
    }
  }
}
</style>
