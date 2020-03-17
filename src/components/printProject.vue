
<template>
	<div>
		<p class="print-title">泾川县全县用工统计表</p>
		<el-table
			id="printTest"
			class="project-table"
			:data="list"
			style="width: 100%;"
			ref="table"
			max-height="1000px"
		>
			<el-table-column
				:label="item.name"
				v-if="options.length"
				v-for="(item,index) in options"
				:key="index"
				width="50px"
				align="center"
			>
				<template slot-scope="scope">
					<span>{{scope.row.typelist[index]}}</span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
export default {
	props: ['list', 'options']
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
.project-table.el-table td {
  font-size: 10px !important;
  padding: 0 !important;
  color: #333 !important;
}
.project-table.el-table .cell-item {
  text-align: center;
}
.project-table.el-table th {
  font-size: 10px !important;
  padding: 0 !important;
}
.project-table.el-table th > .cell {
  padding-left: 0 !important;
  padding-right: 0 !important;
  width: 40px !important;
  line-height: 12px !important;
  font-size: 10px !important;
}
.project-table.el-table .cell span {
  font-size: 10px !important;
}
.project-table.el-table tbody td {
  padding: 6px 0 !important;
}

.project-table.el-table td > .cell {
  padding-left: 0 !important;
  padding-right: 0 !important;
  width: 40px !important;
  line-height: 12px !important;
  font-size: 10px !important;
}
.project-table.el-table .el-button {
  word-break: break-all;
}
.project-table.el-table .el-button {
  font-size: 10px !important;
  padding: 0 !important;
  white-space: normal;
}
</style>
