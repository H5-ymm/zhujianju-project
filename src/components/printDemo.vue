
<template>
  <el-table :data="list" show-summary id="printTable" style="width: 100%;" class="print-table" max-height="2000px">
    <el-table-column label="工程名称" prop="name" width="55px" align="center"></el-table-column>
    <el-table-column label="工程地点" align="center" width="55px">
      <template slot-scope="scope">
        <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.address}}</span>
      </template>
    </el-table-column>
    <el-table-column label="项目类别" prop="type" width="55px" align="center"></el-table-column>
    <el-table-column label="建筑规模" width="55px" prop="scale" align="center"></el-table-column>
    <el-table-column label="工程造价" width="60px" prop="engineering_cost" align="center"></el-table-column>
    <el-table-column label="施工许可证号" width="60px" align="center">
      <template slot-scope="scope">
        <span>{{scope.row.make_license + ''}}</span>
      </template>
    </el-table-column>
    <el-table-column label="结构类型" prop="structure_type" align="center" width="55px"></el-table-column>
    <el-table-column label="监督注册号" align="center" width="55px">
      <template slot-scope="scope">
        <span>{{scope.row.monitoring_id + ''}}</span>
      </template>
    </el-table-column>
    <el-table-column label="建设单位及项目负责人" width="60px" align="center">
      <template slot-scope="scope">
        <div class="cell-item">
          <p>{{scope.row.construction_unit}}</p>
          <el-button type="text">{{scope.row.survey_user}}</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="勘查单位及项目负责人" width="60px" align="center">
      <template slot-scope="scope">
        <div class="cell-item">
          <p>{{scope.row.survey_unit}}</p>
          <el-button type="text">{{scope.row.survey_user}}</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="设计单位及项目负责人" width="60px" align="center">
      <template slot-scope="scope">
        <div class="cell-item">
          <p>{{scope.row.design_unit}}</p>
          <el-button type="text">{{scope.row.design_user}}</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="施工单位及项目负责人" width="60px" align="center">
      <template slot-scope="scope">
        <div class="cell-item">
          <p>{{scope.row.shigong_unit}}</p>
          <el-button type="text">{{scope.row.shigong_user}}</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="监理单位及项目负责人" width="60px" align="center">
      <template slot-scope="scope">
        <div class="cell-item">
          <p>{{scope.row.supervision_unit}}</p>
          <el-button type="text">{{scope.row.supervision_user}}</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="检测单位及项目负责人" width="60px" align="center">
      <template slot-scope="scope">
        <div class="cell-item">
          <p>{{scope.row.detection_unit}}</p>
          <el-button type="text">{{scope.row.detection_user}}</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="商砼单位及项目负责人" width="60px" align="center">
      <template slot-scope="scope">
        <div class="cell-item">
          <p>{{scope.row.commercialconcrete_unit}}</p>
          <el-button type="text">{{scope.row.commercialconcrete_unit}}</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="监督组" width="55px" align="center">
      <template slot-scope="scope">
        <span>{{scope.row.monitoring_group + ''}}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column label="计划竣工日期" width="55px" align="center">
      <template slot-scope="scope">
        <span>
          {{scope.row.endtime?
          $moment.unix(scope.row.endtime).format('YYYY-MM-DD'):''}}
        </span>
      </template>
    </el-table-column> -->
    <!-- <el-table-column label="层数" align="center" width="55px">
      <template slot-scope="scope">
        <span>{{scope.row.layers}}层</span>
      </template>
    </el-table-column>-->
  </el-table>
</template>
<script>
import { getImg } from "../utils/util.js";
export default {
  props: ['list'],
  methods: {
    getImg
  }
}
</script>
<style  type="text/css">
.print-table.el-table {
  /* transform: scale(0.9) !important; */
}
.print-table.el-table tr td {
  font-size: 10px !important;
  padding: 6px 0!important;
  color: #333 !important;
  /* transform: scale(0.8) !important; */
}
.print-table.el-table .cell-item {
  text-align: center;
}
.print-table.el-table th {
  padding: 0!important;
  margin-left: 0!important;
  margin-right: 0!important;
}
.print-table.el-table th > .cell {
  padding-left: 0 !important;
  padding-right: 0 !important;
  width: 55px!important;
}
.print-table.el-table .el-button{
  word-break: break-all;
}
.print-table.el-table .el-button{
   font-size: 10px !important;
   padding: 0 !important;
   white-space:normal;
}
</style>
