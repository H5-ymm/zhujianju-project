
<template>
  <el-table :data="list" show-summary id="printTable" style="width: 100%;" class="print-table" max-height="2000px">
    <el-table-column label="二维码" align="center">
      <template slot-scope="scope">
        <img :src="getImg(scope.row.qrcode)" v-if="scope.row.qrcode" class="qrcode" alt="">
        <span v-else class="qrcode-status">未生成</span>
      </template>
    </el-table-column>
    <el-table-column label="工程名称" prop="name" align="center" ></el-table-column>
    <el-table-column label="工程地点" align="center" >
      <template slot-scope="scope">
        <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.address}}</span>
      </template>
    </el-table-column>
    <el-table-column label="项目类别" prop="type" align="center" ></el-table-column>
    <el-table-column label="建筑规模" prop="scale" align="center"></el-table-column>
    <el-table-column label="工程造价" prop="engineering_cost" align="center"></el-table-column>
    <el-table-column label="施工许可证号" prop="make_license" align="center"></el-table-column>
    <el-table-column label="结构类型" prop="structure_type" align="center"></el-table-column>
    <el-table-column label="监督注册号" prop="monitoring_id" align="center"></el-table-column>
     <el-table-column label="建设单位及项目负责人" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.construction_unit}}</p>
          <el-button type="text">{{scope.row.survey_user}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="勘查单位及项目负责人"  align="center">
        <template slot-scope="scope">
          <p>{{scope.row.survey_unit}}</p>
          <el-button type="text">{{scope.row.survey_user}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="设计单位及项目负责人" align="center">
         <template slot-scope="scope">
          <p>{{scope.row.design_unit}}</p>
          <el-button type="text">{{scope.row.design_user}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="施工单位及项目负责人" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.shigong_unit}}</p>
          <el-button type="text">{{scope.row.shigong_user}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="监理单位及项目负责人" align="center">
         <template slot-scope="scope">
          <p>{{scope.row.supervision_unit}}</p>
          <el-button type="text">{{scope.row.supervision_user}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="检测单位及项目负责人" align="center">
        <template slot-scope="scope">
           <p>{{scope.row.detection_unit}}</p>
           <el-button type="text">{{scope.row.detection_user}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="商砼单位及项目负责人" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.commercialconcrete_unit}}</p>
          <el-button type="text">{{scope.row.commercialconcrete_unit}}</el-button>
        </template>
      </el-table-column>
    <el-table-column label="监督组" prop="monitoring_group" align="center"></el-table-column>
    <el-table-column label="计划竣工日期" align="center">
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
<style  type="text/css" scoped>
.print-table .qrcode {
  width: 50px;
  height: 50px;
}
.print-table.el-table {
  transform: translate(100px, -100px) rotate(90deg);
  height: 2000px !important;
}
.print-table.el-table tr td {
  font-size: 10px !important;
  color: #333 !important;
}
</style>
