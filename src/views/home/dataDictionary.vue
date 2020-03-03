<template>
  <div>
    <el-row type="flex" justify="space-between" class="code-row-bg">
      <el-col :span="4" class="el-menu-left">
        <el-menu default-active="1" class="el-menu-vertical" @select="fetchData">
          <el-menu-item index="1">项目类别</el-menu-item>
          <el-menu-item index="2">结构类别</el-menu-item>
          <el-menu-item index="3">工种</el-menu-item>
          <el-menu-item index="4">企业类型</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="16">
        <el-row>
          <el-form :inline="true" :model="query" class="query-form">
            <el-form-item class="query-form-item">
              <el-input v-model="query.keyword" class="width200" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
                <el-button type="primary" icon="el-icon-plus" @click.native="add">新增</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table
            class="common-table"
            v-loading="loading"
            :data="list"
            style="width: 100%;"
            max-height="600px"
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="名称" align="center" prop="name"></el-table-column>
            <el-table-column label="操作" align="center" min-with="150px" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native="edit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :page-size="query.limit"
            @current-change="handleCurrentChange"
            layout="prev, pager, next,total"
            :total="total"
          ></el-pagination>
        </el-row>
      </el-col>
      <el-dialog
        title="添加"
        :visible.sync="formVisible"
        :before-close="hideForm"
        width="40%"
        top="5vh"
        class="form-dialog"
      >
        <el-form :model="modalData">
          <el-form-item label="名称" label-width="100px">
            <el-input v-model="modalData.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import { geTypeAll, addTypeData, editType, typeList } from "../../api/file/data"
export default {
  data() {
    return {
      value: '',
      postOption: [
        {
          label: '1',
          value: 1
        },
        {
          label: '2',
          value: 2
        },
        {
          label: '3',
          value: 3
        }
      ],
      list: [],
      modalData: {},
      loading: false,
      formVisible: false,
      query: {
        keyword: '',
        pid: '',
        page: 1,
        limit: 10
      },
      total: 0,
      menus: []
    }
  },
  created() {
    this.query.pid = 0
    this.fetchData()
    this.getList()
  },
  methods: {
    fetchData(key) {
      this.query.pid = key || 1
      this.loading = true
      this.getList()
    },
    getList() {
      typeList(this.query).then(res => {
        this.loading = false
        if (!this.query.pid) {
          this.menus = res
        } else {
          this.list = res.data
          this.total = res.count
        }
      })
    },
    searchData() {
      this.getList()
    },
    hideForm() {
      this.formVisible = false
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getList()
    },
    add() {
      this.modalData = {}
      this.formVisible = true
    },
    edit(data) {
      this.modalData = data
      this.formVisible = true
    },
    editData() {
      let params = {
        id: this.modalData.id,
        name: this.modalData.name
      }
      editType(params).then(res => {
        if (res) {
          this.fetchData(this.query.pid)
          this.$message.success('修改成功')
          this.formVisible = false
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    save() {
      this.modalData.pid = this.query.pid
      if (this.modalData.id) {
        this.editData()
      } else {
        addTypeData(this.modalData).then(res => {
          if (res) {
            this.fetchData(this.query.pid)
            this.$message.success('保存成功')
            this.modalData = {}
            this.formVisible = false
          } else {
            this.$message.error('保存失败')
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" >
.el-menu-left {
  margin-top: 20px;
}
</style>
