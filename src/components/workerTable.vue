
<template>
  <el-table :data="list" style="width: 100%;" class="print-table" max-height="1000px">
    <el-table-column label="工人姓名" align="center" prop="name" width="100px"></el-table-column>
			<el-table-column label="地区" min-width="100px" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.address}}</span>
				</template>
			</el-table-column>
			<el-table-column label="身份证号" prop="id_card" width="100px" align="center"></el-table-column>
			<el-table-column label="手机号" width="100px" prop="tel" align="center"></el-table-column>
			<el-table-column label="工种" prop="job_type" width="100px" align="center"></el-table-column>
			<el-table-column label="性别" align="center" width="60px">
				<template slot-scope="scope">
					<span>{{scope.row.sex===1?'男':'女'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="当天体温" width="100px" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.temperature?scope.row.temperature+'度':''}}</span>
				</template>
			</el-table-column>
			<el-table-column label="紧急联系人" width="110px" prop="link_man" align="center"></el-table-column>
			<el-table-column label="状态" align="center" width="60px" v-if="is_wmadmin">
				<template slot-scope="scope">
					<el-tag :type="scope.row.status==0?'warning':scope.row.status==1?'success':'danger'">{{scope.row.status==0?'待审核':scope.row.status==1?'已通过':'已拒绝'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="签到状态" align="center" width="60px" v-if="is_wmadmin">
				<template slot-scope="scope">
					<el-tag :type="scope.row.is_attendance==0?'warning':'success'">{{scope.row.is_attendance==0?'未签到':'已签到'}}</el-tag>
				</template>
			</el-table-column>
			 <el-table-column label="审核签到状态" width="80px" align="center" v-if="is_wmadmin">
					<template slot-scope="scope">
					<el-tag :type="scope.row.sure_attendance==0?'warning':scope.row.sure_attendance==1?'success':'danger'">{{scope.row.sure_attendance==0?'待确认':scope.row.sure_attendance==1?'已确认':'未签到'}}</el-tag>
				</template>
			</el-table-column>
  </el-table>
</template>
<script>
export default {
	props: ['list', 'is_wmadmin'],
	created() {
		console.log(sessionStorage.getItem('is_wmadmin'))
		console.log(this.is_wmadmin)
	}
}
</script>
<style  type="text/css" media="print">
@page {
  size: A4 landscape;
}
.el-table tr td {
  color: #333 !important;
}
</style>
