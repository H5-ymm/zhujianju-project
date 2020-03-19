
<template>
  <div>
    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item class="query-form-item">
        <el-input v-model="query.keyword" class="width200" placeholder="工程名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.com_id" class="width300" placeholder="请选择公司名称">
          <el-option v-for="item in options" :key="item.id" :label="item.com_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.type" class="width200" placeholder="请选择项目类别">
          <el-option v-for="item in projectType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.structure_type" class="width200" placeholder="请选择结构类型">
          <el-option v-for="item in sortList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
          <el-button type="primary" icon="el-icon-plus" @click.native="handleForm(null, null)">新增</el-button>
          <el-button type="primary" icon="el-icon-document-copy" @click="printView" v-if="IsPC()">打印</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <vue-easy-print :tableShow="false" ref="easyPrint" :onePageRow="10">
      <template>
        <printDemo :list="list" :spanArr="spanArr"></printDemo>
      </template>
    </vue-easy-print>
    <el-table v-loading="loading" :data="list" :span-method="objectSpanMethod" show-summary style="width: 100%;" class="common-table" max-height="1000px">
      <el-table-column label="施工许可证号" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.make_license + ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程名称" prop="name" align="center" width="90px"></el-table-column>
      <el-table-column label="工程地点" align="center" width="140px">
        <template slot-scope="scope">
          <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目类别" prop="type" align="center" width="90px"></el-table-column>
      <el-table-column label="建筑规模" prop="scale" align="center" width="100px"></el-table-column>
      <el-table-column label="工程造价" prop="engineering_cost" align="center" width="100px"></el-table-column>
      <el-table-column label="结构类型" prop="structure_type" align="center" width="100px"></el-table-column>
      <el-table-column label="监督注册号" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.monitoring_id + ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="建设单位及项目负责人" width="100px" align="center">
        <template slot-scope="scope">
          <div class="cell-item">
            <p>{{scope.row.construction_unit}}</p>
            <el-button type="text">{{scope.row.construction_user}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="勘查单位及项目负责人" width="100px" align="center">
        <template slot-scope="scope">
          <div class="cell-item">
            <p>{{scope.row.survey_unit}}</p>
            <el-button type="text">{{scope.row.survey_user}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="设计单位及项目负责人" width="100px" align="center">
        <template slot-scope="scope">
          <div class="cell-item">
            <p>{{scope.row.design_unit}}</p>
            <el-button type="text">{{scope.row.design_user}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="施工单位及项目负责人" width="100px" align="center">
        <template slot-scope="scope">
          <div class="cell-item">
            <p>{{scope.row.shigong_unit}}</p>
            <el-button type="text">{{scope.row.shigong_user}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="监理单位及项目负责人" width="100px" align="center">
        <template slot-scope="scope">
          <div class="cell-item">
            <p>{{scope.row.supervision_unit}}</p>
            <el-button type="text">{{scope.row.supervision_user}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="检测单位及项目负责人" width="100px" align="center">
        <template slot-scope="scope">
          <div class="cell-item">
            <p>{{scope.row.detection_unit}}</p>
            <el-button type="text">{{scope.row.detection_user}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商砼单位及项目负责人" width="100px" align="center">
        <template slot-scope="scope">
          <div class="cell-item">
            <p>{{scope.row.commercialconcrete_unit}}</p>
            <el-button type="text">{{scope.row.commercialconcrete_user}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="监督组" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.monitoring_group + ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划竣工日期" align="center" width="110px">
        <template slot-scope="scope">
          <span>
            {{scope.row.endtime?
            $moment.unix(scope.row.endtime).format('YYYY-MM-DD'):''}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="层数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.layers}}层</span>
        </template>
      </el-table-column>
      <el-table-column label="二维码" align="center">
        <template slot-scope="scope">
          <img :src="getImg(scope.row.qrcode)" v-if="scope.row.qrcode" class="qrcode" alt="">
          <span v-else class="qrcode-status">未生成</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click.native="viewDetail(scope.$index, scope.row)">查看</el-button>
          <!-- <el-button type="text" size="small" @click.native="viewQrcode(scope.$index, scope.row)">二维码</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="12">
        <el-pagination :page-size="query.limit" @current-change="handleCurrentChange" layout="prev, pager, next,total" :total="total" class="pagination"></el-pagination>
        <span class="count">项目总数 : {{count}}</span>
      </el-col>
    </el-row>
    <!--表单-->
    <el-dialog :title="formMap[formName]" :visible.sync="formVisible" :before-close="hideForm" width="66%" top="5vh" class="form-dialog">
      <el-form :model="formData" :inline="true" label-width="150px" label-position="right" class="form" :rules="addRules" ref="dataForm">
        <el-form-item label="用户名" prop="username">
          <el-input :readonly="formMap[formName]=='编辑'" v-model="formData.username" placeholder="请输入用户名" class="width240" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="formMap[formName]=='新增'">
          <el-input v-model="formData.password" placeholder="请输入密码" class="width240" type="password" auto-complete="off"></el-input>
          <p>不设置默认：123456</p>
        </el-form-item>
        <el-form-item label="工程名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入工程名称" class="width240" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目类别" prop="type">
          <el-select v-model="formData.type" class="width240" placeholder="请选择">
            <el-option v-for="item in projectType" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工程地点" required>
          <div class="width240 select-input">
            <selectCity @change="districtChange" :address="address"></selectCity>
          </div>
          <el-input v-model="formData.address" placeholder="请输入工程详细地点" class="width240" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="结构类型" prop="structure_type">
          <el-select v-model="formData.structure_type" class="width240" placeholder="请选择结构类型">
            <el-option v-for="item in sortList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建筑规模" prop="scale">
          <el-input class="width240" placeholder="请输入建筑规模" v-model="formData.scale" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="建筑层数" prop="layers">
          <el-input class="width240" placeholder="请输入建筑层数" v-model="formData.layers" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="工程造价" prop="engineering_cost">
          <el-input class="width240" placeholder="请输入工程造价" v-model="formData.engineering_cost" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="计划开工日期" prop="starttime">
          <el-date-picker type="date" format="yyyy-MM-dd" v-model="formData.starttime" class="width240" value-format="timestamp" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="计划竣工日期" class="date-item" prop="endtime">
          <el-date-picker v-model="formData.endtime" type="date" format="yyyy-MM-dd" value-format="timestamp" class="width240" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="建筑工程规划许可证" class="date-item" prop="license">
          <el-input class="width240" placeholder="请输入建筑工程规划许可证" v-model="formData.license" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="施工许可证" prop="make_license">
          <el-input class="width240" placeholder="请输入施工许可证" v-model="formData.make_license" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图纸审查批准编号" prop="tzscpz">
          <el-input class="width240" placeholder="请输入图纸审查批准编号" v-model="formData.tzscpz" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="消防审查合格证号" prop="firecontrol_license">
          <el-input class="width240" placeholder="请输入消防审查合格证号" v-model="formData.firecontrol_license" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="监督备案登记号" prop="monitoring_id">
          <el-input class="width240" placeholder="请输入监督备案登记号" v-model="formData.monitoring_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="建设单位" prop="construction_unit">
          <div class="width240">
            <el-select @focus="selectCompany(16)" v-model="formData.construction_unit" placeholder="请选择建设单位" filterable class="width240 select-input">
              <el-option v-for="item in options" :key="item.id" :label="`${item.com_name}/${item.corporation_name}`" :value="item.id">
                <span class="lable-left">{{ item.com_name }}</span>
                <span class="lable-right">法人代表：{{ item.corporation_name }}</span>
              </el-option>
            </el-select>
            <el-input placeholder="请输入建设单位负责人" v-model="formData.construction_user" auto-complete="off"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="勘查单位" prop="survey_unit">
          <div class="width240">
            <el-select @focus="selectCompany(17)" v-model="formData.survey_unit" placeholder="请选择勘查单位" class="width240 select-input">
              <el-option v-for="item in options" :key="item.id" :label="`${item.com_name}/${item.corporation_name}`" :value="item.id">
                <span class="lable-left">{{ item.com_name }}</span>
                <span class="lable-right">法人代表：{{ item.corporation_name }}</span>
              </el-option>
            </el-select>
            <el-input placeholder="请输入勘查单位负责人" v-model="formData.survey_user" auto-complete="off"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="设计单位" prop="design_unit">
          <div class="width240">
            <el-select @focus="selectCompany(18)" v-model="formData.design_unit" placeholder="请选择设计单位" class="width240 select-input">
              <el-option v-for="item in options" :key="item.id" :label="`${item.com_name}/${item.corporation_name}`" :value="item.id">
                <span class="lable-left">{{ item.com_name }}</span>
                <span class="lable-right">法人代表：{{ item.corporation_name }}</span>
              </el-option>
            </el-select>
            <!-- </tooltip> -->
            <el-input placeholder="请输入设计单位负责人" v-model="formData.design_user" auto-complete="off"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="施工单位" prop="shigong_unit">
          <div class="width240">
            <el-select @focus="selectCompany(19)" v-model="formData.shigong_unit" placeholder="请选择施工单位" class="width240 select-input">
              <el-option v-for="item in options" :key="item.id" :label="`${item.com_name}/${item.corporation_name}`" :value="item.id">
                <span class="lable-left">{{ item.com_name }}</span>
                <span class="lable-right">法人代表：{{ item.corporation_name }}</span>
              </el-option>
            </el-select>
            <el-input placeholder="请输入施工单位负责人" v-model="formData.shigong_user" auto-complete="off"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="supervision_unit" label="监理单位">
          <div class="width240">
            <el-select @focus="selectCompany(20)" v-model="formData.supervision_unit" placeholder="请选择监理单位" class="width240 select-input">
              <el-option v-for="item in options" :key="item.id" :label="`${item.com_name}/${item.corporation_name}`" :value="item.id">
                <span class="lable-left">{{ item.com_name }}</span>
                <span class="lable-right">法人代表：{{ item.corporation_name }}</span>
              </el-option>
            </el-select>
            <el-input placeholder="请输入监理单位负责人" v-model="formData.supervision_user" auto-complete="off"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="detection_unit" label="检测单位">
          <div class="width240">
            <el-select @focus="selectCompany(21)" v-model="formData.detection_unit" placeholder="请选择检测单位" class="width240 select-input">
              <el-option v-for="item in options" :key="item.id" :label="`${item.com_name}/${item.corporation_name}`" :value="item.id">
                <span class="lable-left">{{ item.com_name }}</span>
                <span class="lable-right">法人代表：{{ item.corporation_name }}</span>
              </el-option>
            </el-select>
            <el-input placeholder="请输入检测单位负责人" v-model="formData.detection_user" auto-complete="off"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="commercialconcrete_unit" label="商砼单位">
          <div class="width240">
            <el-select v-model="formData.commercialconcrete_unit" placeholder="请选择商砼单位" class="width240 select-input" @focus="selectCompany(31)">
              <el-option v-for="item in options" :key="item.id" :label="`${item.com_name}/${item.corporation_name}`" :value="item.id">
                <span class="lable-left">{{ item.com_name }}</span>
                <span class="lable-right">法人代表：{{ item.corporation_name }}</span>
              </el-option>
            </el-select>
            <el-input placeholder="请输入商砼单位负责人" v-model="formData.commercialconcrete_user" auto-complete="off"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="监督组" prop="monitoring_group">
          <el-input class="width240" placeholder="请输入监督组负责人" v-model="formData.monitoring_group" auto-complete="off"></el-input>
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
  getProjectList,
  addProject,
  deleteProject,
  updateProject,
  getDetail,
  getitemcount,
  getqrcode
} from "../../api/project/index";
import { getCorporationCompany } from "../../api/company/index"
import { geTypeAll } from "../../api/file/data"
import selectCity from "../../components/selectCity.vue";
import printDemo from "../../components/printDemo.vue";
import { getImg, checkNum } from "../../utils/util.js";
import vueEasyPrint from "../../components/vue-easy-print";
const formJson = {
  username: '',
  password: '',
  name: '',
  type: '',
  structure_type: '',
  scale: '',
  layers: '',
  engineering_cost: '',
  starttime: '',
  endtime: '',
  license: '',
  tzscpz: '',
  construction_unit: '',
  construction_user: '',
  survey_unit: '',
  survey_user: '',
  design_unit: '',
  design_user: '',
  shigong_unit: '',
  shigong_user: '',
  supervision_unit: '',
  supervision_user: '',
  detection_unit: '',
  detection_user: '',
  monitoring_group: '',
  provinceid: '',
  cityid: '',
  areaid: '',
  address: '',
  commercialconcrete_unit: ''
};
export default {
  components: {
    selectCity: selectCity,
    printDemo: printDemo,
    vueEasyPrint: vueEasyPrint
  },
  data () {
    let validatereg = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (!checkNum(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      roles: [],
      query: {
        keyword: '',
        page: 1,
        limit: 10,
      },
      list: [],
      total: 0,
      loading: true,
      index: null,
      formName: null,
      address: [620000, 620800, 620821],
      formMap: {
        add: "新增",
        edit: "编辑"
      },
      options: [],
      options1: [],
      projectType: [],
      sortList: [],
      formLoading: false,
      formVisible: false,
      formData: formJson,
      formRules: {},
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入工程名称", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择项目类别", trigger: "change" }
        ],
        structure_type: [
          { required: true, message: "请选择结构类型", trigger: "change" }
        ],
        scale: [
          { required: true, message: "请输入建筑规模", trigger: "blur" },
          { validator: validatereg, trigger: 'blur' }
        ],
        layers: [
          { required: true, message: "请输入层数", trigger: "blur" },
        ],
        engineering_cost: [
          { required: true, message: "请输入工程造价", trigger: "blur" },
          { validator: validatereg, trigger: 'blur' }
        ],
        starttime: [
          { required: true, message: "请选择开工时间", trigger: "change" }
        ],
        endtime: [
          { required: true, message: "请选择竣工时间", trigger: "change" }
        ],
        license: [
          { required: true, message: "请输入建筑工程规划许可证", trigger: "blur" }
        ],
        make_license: [
          { required: true, message: "请输入施工许可证", trigger: "blur" }
        ],
        tzscpz: [
          { required: true, message: "请输入图纸审查批准号", trigger: "blur" }
        ],
        firecontrol_license: [
          { required: true, message: "请输入消防审查合格证号", trigger: "blur" }
        ],
        monitoring_id: [
          { required: true, message: "请输入监督备案号", trigger: "blur" }
        ],
        monitoring_group: [
          { required: true, message: "请输入监督组", trigger: "blur" }
        ],
        construction_unit: [
          { required: true, message: "请选择建设单位", trigger: "change" }
        ],
        survey_unit: [
          { required: true, message: "请选择勘查单位", trigger: "change" }
        ],
        design_unit: [
          { required: true, message: "请选择设计单位", trigger: "change" }
        ],
        shigong_unit: [
          { required: true, message: "请选择施工单位", trigger: "change" }
        ],
        supervision_unit: [
          { required: true, message: "请选择监理单位", trigger: "change" }
        ],
        detection_unit: [
          { required: true, message: "请选择检测单位", trigger: "change" }
        ],
        commercialconcrete_unit: [
          { required: true, message: "请选择商砼单位", trigger: "change" }
        ]
      },
      deleteLoading: false,
      spanArr: [],
      count: 0
    };
  },
  computed: {
    tableData () {
      return { store_name: 'ceshi', detail: this.list }
    }
  },
  mounted () {
    // 将参数拷贝进查询对象
    let query = this.$route.query;
    this.query = Object.assign(this.query, query);
    this.query.limit = parseInt(this.query.limit);
    // 加载表格数据
    this.getList();
    this.getCompany()
    this.getCount()
    this.getType(1).then(res => {
      this.projectType = res
    })
    this.getType(2).then(res => {
      this.sortList = res
    })
    this.formData.provinceid = 620000
    this.formData.cityid = 620800
    this.formData.areaid = 620821
  },
  methods: {
    getImg,
    selectCompany (index) {
      this.getCompany(index)
    },
    viewQrcode (row) {
      getqrcode({ id: row.id }).then(res => {
        if (res) {
          let url = getImg(res)
          this.$alert(`<img src=${url} />`, '二维码', {
            dangerouslyUseHTMLString: true
          }).then(() => {
            console.log(1)
          })
            .catch(action => {
              console.log(action)
            });
        }
      })
    },
    districtChange (val) {
      this.formData.provinceid = val[0]
      this.formData.cityid = val[1]
      this.formData.areaid = val[2]
    },
    getCount () {
      getitemcount().then(res => {
        this.count = res || 0
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    tableDatas () {
      let contactDot = 0;
      this.list.forEach((item, index) => {
        item.index = index;
        if (index === 0) {
          this.spanArr.push(1);
        } else {
          if (item.make_license === this.list[index - 1].make_license) {
            this.spanArr[contactDot] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            contactDot = index;
          }
        }
      })
    },
    getCompany (type_id) {
      let params = {
        keyword: '',
        type_id: type_id ? type_id : ''
      }
      getCorporationCompany(params).then(res => {
        this.options = res || []
      })
    },
    getType (pid) {
      let params = {
        pid: pid,
        keyword: ''
      }
      return new Promise((resolve, reject) => {
        geTypeAll(params).then(res => {
          resolve(res)
        }).catch(() => {
          reject()
        })
      })
    },
    printView () {
      this.$refs.easyPrint.print()
    },
    viewDetail (index, row) {
      this.$router.push('projectDetail?id=' + row.id)
    },
    onReset () {
      this.$router.push({
        path: ""
      });
      this.query = {
        keyword: "",
        page: 1,
        limit: 20
      };
      this.getList();
    },
    onSubmit () {
      this.$router.push({
        path: "",
        query: this.query
      });
      this.getList();
    },
    handleCurrentChange (val) {
      this.query.page = val;
      this.getList();
    },
    getList () {
      this.loading = true;
      getProjectList(this.query)
        .then(response => {
          this.loading = false;
          console.log(response.data)
          this.list = response.data || [];
          this.total = response.count || 0;
          this.tableDatas()
        })
        .catch(() => {
          this.loading = false;
          this.list = [];
          this.total = 0;
          this.roles = [];
        });
    },
    // 刷新表单
    resetForm () {
      if (this.$refs["dataForm"]) {
        // 清空验证信息表单
        this.$refs["dataForm"].clearValidate();
        // 刷新表单
        this.$refs["dataForm"].resetFields();
      }
    },
    // 隐藏表单
    hideForm () {
      // 更改值
      this.formVisible = !this.formVisible;
      // 清空表单
      this.resetForm();
      return true;
    },
    // 显示表单
    handleForm (index, row) {
      this.formVisible = true;
      this.formData = JSON.parse(JSON.stringify(formJson));
      if (row !== null) {
        this.getProjectDetail(row.id)
      }
      this.formName = "add";
      this.formRules = this.addRules;
      if (index !== null) {
        this.index = index;
        this.formName = "edit";
        delete this.addRules.username
        this.formRules = this.addRules;
      }
    },
    getProjectDetail (id) {
      getDetail({ id }).then(res => {
        console.log(res)
        this.formData = res || {}
        this.formData.structure_type = Number(this.formData.structure_type)
        let starttime = this.$moment.unix(this.formData.starttime).format('YYYY-MM-DD')
        let endtime = this.$moment.unix(this.formData.endtime).format('YYYY-MM-DD')
        this.formData.starttime = this.$moment(starttime).valueOf()
        console.log(this.formData.starttime)
        console.log(this.formData.endtime)
        this.formData.endtime = this.$moment(endtime).valueOf()
        if (this.formData.provinceid) {
          this.address = [this.formData.provinceid, this.formData.cityid, this.formData.areaid]
        }
      })
    },
    editProject (data) {
      updateProject(data).then(response => {
        if (response) {
          this.formLoading = false;
          this.$message.success("操作成功");
          this.formVisible = false;
          this.getList()
          // 刷新表单
          this.resetForm();
        }
      });
    },
    formSubmit () {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (!this.formData.provinceid) {
            this.$message.warning('请选择工程地点')
          } else if (!this.formData.address) {
            this.$message.warning('请输入工程详细地址')
          } else if (this.formData.starttime - this.formData.endtime > 0) {
            this.$message.warning('开始时间不能大于竣工时间')
          } else if (!this.formData.construction_user) {
            this.$message.warning('请输入建设单位负责人')
          } else if (!this.formData.survey_user) {
            this.$message.warning('请输入勘查单位负责人')
          } else if (!this.formData.design_user) {
            this.$message.warning('请输入设计单位负责人')
          } else if (!this.formData.shigong_user) {
            this.$message.warning('请输入施工单位负责人')
          } else if (!this.formData.supervision_user) {
            this.$message.warning('请输入监理单位负责人')
          } else if (!this.formData.detection_user) {
            this.$message.warning('请输入检测单位负责人')
          } else if (!this.formData.commercialconcrete_user) {
            this.$message.warning('请输入商砼单位负责人')
          } else {
            this.formLoading = true;
            let starttime = this.formData.starttime + ''
            starttime = starttime.substring(0, 10)
            let endtime = this.formData.endtime + ''
            endtime = endtime.substring(0, 10)
            let data = Object.assign({}, this.formData, { starttime: starttime, endtime: endtime });
            if (this.formData.id) {
              this.editProject(data)
            } else {
              addProject(data).then(response => {
                if (response) {
                  this.formLoading = false;
                  this.$message.success("操作成功");
                  this.formVisible = false;
                  this.getList()
                  // 刷新表单
                  this.resetForm();
                }
              });
            }
          }
        }
      });
    },
    // 删除
    handleDel (index, row) {
      if (row.id) {
        this.$confirm("确认删除该项目吗?", "提示", {
          type: "warning"
        })
          .then(() => {
            let para = { id: row.id };
            this.deleteLoading = true;
            deleteProject(para)
              .then(response => {
                this.deleteLoading = false;
                if (response.code) {
                  this.$message.error(response.message);
                  return false;
                }
                this.$message.success("操作成功");
                // 刷新数据
                this.list.splice(index, 1);
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
  }
};
</script>
<style lang="scss">
.select-input {
  margin-bottom: 5px;
}
.cell-item {
  text-align: center;
  .el-button {
    padding: 0 5px;
    white-space: normal;
  }
}
.date-item {
  .el-input--prefix {
    .el-input__inner {
      :focus {
        padding-left: 30px;
      }
    }
  }
}
.lable-left {
  float: left;
}
.lable-right {
  float: right;
  color: #8492a6;
  font-size: 13px;
}
.qrcode {
  width: 80px;
  height: 80px;
}
.qrcode-status {
  color: #f56c6c;
}
.pagination {
  float: left;
}
.count {
  color: #333;
  margin-top: 15px;
  display: inline-block;
}
</style>
