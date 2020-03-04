
<template>
  <el-table :data="list" show-summary id="printTable" style="width: 100%;" class="print-table" max-height="1000px">
    <el-table-column label="二维码" align="center">
      <template slot-scope="scope">
        <img :src="getImg(scope.row.qrcode)" v-if="scope.row.qrcode" class="qrcode" alt="">
        <span v-else class="qrcode-status">未生成</span>
      </template>
    </el-table-column>
    <el-table-column label="工程名称" prop="name" align="center" width="90px"></el-table-column>
    <el-table-column label="工程地点" align="center" width="90px">
      <template slot-scope="scope">
        <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.address}}</span>
      </template>
    </el-table-column>
    <el-table-column label="项目类别" prop="type" align="center" width="90px"></el-table-column>
    <el-table-column label="建筑规模" prop="scale" align="center" width="100px"></el-table-column>
    <el-table-column label="工程造价" prop="engineering_cost" align="center" width="100px"></el-table-column>
    <el-table-column label="施工许可证号" prop="structure_type" align="center"></el-table-column>
    <el-table-column label="结构类型" prop="structure_type" align="center" width="100px"></el-table-column>
    <el-table-column label="监督注册号" prop="structure_type" align="center"></el-table-column>
    <el-table-column label="建设单位及项目负责人" prop="structure_type" align="center"></el-table-column>
    <el-table-column label="勘查单位及项目负责人" prop="name" align="center">
      <template slot-scope="scope">
        <span></span>
      </template>
    </el-table-column>
    <el-table-column label="设计单位及项目负责人" prop="name" align="center">
      <template slot-scope="scope">
        <span></span>
      </template>
    </el-table-column>
    <el-table-column label="施工单位及项目负责人" prop="name" align="center">
      <template slot-scope="scope">
        <span></span>
      </template>
    </el-table-column>
    <el-table-column label="监理单位及项目负责人" prop="name" align="center">
      <template slot-scope="scope">
        <span></span>
      </template>
    </el-table-column>
    <el-table-column label="检测单位及项目负责人" prop="name" align="center">
      <template slot-scope="scope">
        <span></span>
      </template>
    </el-table-column>
    <el-table-column label="商砼单位及项目负责人" prop="name" align="center">
      <template slot-scope="scope">
        <span></span>
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
<style  type="text/css">
.qrcode {
  width: 50px;
  height: 50px;
}
.el-table tr td {
  color: #333!important;
}
</style>
