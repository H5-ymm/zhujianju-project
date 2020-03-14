
<template>
	<div>
		<p class="print-title">泾川县全县工人统计表</p>
		<el-table :data="list" style="width: 100%;" class="print-table" max-height="1000px">
			<el-table-column label="工人姓名" align="center" prop="name" width="60"></el-table-column>
			<el-table-column label="地区" width="60" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.address}}</span>
				</template>
			</el-table-column>
			<el-table-column label="身份证号" prop="id_card" width="55" align="center"></el-table-column>
			<el-table-column label="手机号" width="55" prop="tel" align="center"></el-table-column>
			<el-table-column label="工种" prop="job_type" width="50" align="center"></el-table-column>
			<el-table-column label="性别" align="center" width="60">
				<template slot-scope="scope">
					<span>{{scope.row.sex===1?'男':'女'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="当天体温" width="50" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.temperature?scope.row.temperature+'度':''}}</span>
				</template>
			</el-table-column>
			<el-table-column label="紧急联系人" width="50" prop="link_man" align="center"></el-table-column>
			<el-table-column label="状态" align="center" width="50" v-if="is_wmadmin">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.status==0?'warning':scope.row.status==1?'success':'danger'"
					>{{scope.row.status==0?'待审核':scope.row.status==1?'已通过':'已拒绝'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="签到状态" align="center" width="60" v-if="is_wmadmin">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.is_attendance==0?'warning':'success'"
					>{{scope.row.is_attendance==0?'未签到':'已签到'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="审核签到状态" width="50" align="center" v-if="is_wmadmin">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.sure_attendance==0?'warning':scope.row.sure_attendance==1?'success':'danger'"
					>{{scope.row.sure_attendance==0?'待确认':scope.row.sure_attendance==1?'已确认':'未签到'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="党员" align="center" width="60">
				<template slot-scope="scope">
					<span>{{scope.row.partymember===1?'是':'否'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="贫困户" align="center" width="70">
				<template slot-scope="scope">
					<span>{{scope.row.destitutemember===1?'是':'否'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="政府补助金额" prop="amount_of_grant" align="center" width="60"></el-table-column>
		</el-table>
	</div>
</template>
<script>
export default {
	props: ['list', 'is_wmadmin']
}
</script>
<style  type="text/css">
.print-title {
  font-size: 10px;
  font-weight: bold;
  width: 100%;
  text-align: center;
  color: #333 !important;
  padding: 10px 0 5px;
  margin: 0 !important;
}
.print-table.el-table td,
.print-table.el-table th {
  width: 55px !important;
  color: #333 !important;
  text-align: center;
}
.print-table.el-table .cell {
  padding-left: 0 !important;
  padding-right: 0 !important;
  width: 50px !important;
  line-height: 12px !important;
  font-size: 10px !important;
  text-align: center;
}
.print-table.el-table .cell span {
  font-size: 10px !important;
}
.print-table.el-table tbody td {
  padding: 6px 0 !important;
}
.print-table.el-table .el-tag {
  font-size: 10px !important;
  padding: 0 4px !important;
}
.print-table.el-table .el-button {
  font-size: 10px !important;
  padding: 0 !important;
  white-space: normal;
  word-break: break-all;
}
</style>
