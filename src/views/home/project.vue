<template>
	<div>
		<el-form :inline="true" :model="query" class="query-form">
			<el-form-item class="query-form-item">
				<el-input v-model="query.keyword" class="width200" placeholder="项目名称"></el-input>
			</el-form-item>
			<el-form-item class="query-form-item">
				<el-date-picker
					v-model="timeList"
					value-format="timestamp"
					@change="changeTime"
					type="daterange"
					range-separator="-"
					class="width300"
					:picker-options="pickerOptions"
					unlink-panels
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
					<el-button type="primary" icon="el-icon-document-copy" @click="printView" v-if="IsPC()">打印</el-button>
				</el-button-group>
			</el-form-item>
		</el-form>
		<vue-easy-print :tableShow="false" ref="easyPrint" :onePageRow="10">
			<template>
				<printProject :list="newList" :options="options"></printProject>
			</template>
		</vue-easy-print>
		<el-table
			id="printTest"
			class="common-table"
			v-loading="loading"
			:data="newList"
			style="width: 100%;"
			ref="table"
			max-height="1000px"
		>
			<el-table-column
				:label="item.name"
				v-if="options.length"
				v-for="(item,index) in options"
				:key="index"
				align="center"
			>
				<template slot-scope="scope">
					<span>{{scope.row.typelist[index]}}</span>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:page-size="query.limit"
			@current-change="handleCurrentChange"
			layout="prev, pager, next,total"
			:total="total"
		></el-pagination>
	</div>
</template>
<script>
import {
	listCount
} from "../../api/workman/index";
import { geTypeAll } from "../../api/file/data"
import printProject from "../../components/printProject.vue";
import vueEasyPrint from "../../components/vue-easy-print";
export default {
	components: {
		printProject: printProject,
		vueEasyPrint: vueEasyPrint
	},
	data() {
		return {
			query: {
				keyword: '',
				page: 1,
				limit: 10,
				starttime: '',
				enttime: ''
			},
			pickerOptions: {
				shortcuts: [{
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}]
			},
			list: [],
			value: '',
			total: 0,
			loading: true,
			index: null,
			options: [],
			typelist: [],
			totalList: [],
			timeList: [],
			newList: []
		};
	},
	methods: {
		printView() {
			this.$refs.easyPrint.print()
		},
		changeTime(value) {
			this.params.starttime = value[0] ? value[0] : ''
			this.params.endtime = value[1] ? value[1] : ''
		},
		onReset() {
			this.query = {
				keyword: '',
				page: 1,
				limit: 20
			};
			this.getList();
		},
		getType(pid) {
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
		getNewList(list) {
			let arr = []
			arr = list.map(item => {
				item.typelist.unshift(item.name)
				return { typelist: item.typelist }
			})
			this.totalList.unshift('合计')
			arr.push({ typelist: this.totalList })
			return arr
		},
		getList() {
			this.newList = []
			this.totalList = []
			this.loading = true;
			listCount(this.query)
				.then(response => {
					this.loading = false;
					this.totalList = response.total || []
					let list = response.data || []
					this.total = response.count || 0;
					this.newList = this.getNewList(list)
				})
				.catch(() => {
					this.loading = false;
					this.list = [];
					this.totalList = []
					this.total = 0
				});
		},
	},
	mounted() {
		// 将参数拷贝进查询对象
		let query = this.$route.query;
		this.query = Object.assign(this.query, query);
		this.query.limit = parseInt(this.query.limit);
		// 加载表格数据
		// this.options = [{ "id": 7, "name": "管理人员", "pid": 3 }, { "id": 8, "name": "瓦工", "pid": 3 }, { "id": 9, "name": "钢筋工", "pid": 3 }, { "id": 10, "name": "木工", "pid": 3 }, { "id": 11, "name": "架子工", "pid": 3 }, { "id": 12, "name": "水暖工", "pid": 3 }, { "id": 13, "name": "电工", "pid": 3 }, { "id": 14, "name": "起重司机", "pid": 3 }, { "id": 15, "name": "模板工", "pid": 3 }, { "id": 28, "name": "混泥土工", "pid": 3 }, { "id": 29, "name": "临工", "pid": 3 }, { "id": 30, "name": "其他", "pid": 3 }, { "id": 32, "name": "焊工", "pid": 3 }, { "id": 33, "name": "信号司索工", "pid": 3 }]
		// this.options.unshift({ name: '项目名称' })
		// this.options.push({ name: '合计' })
		this.getType(3).then(res => {
			this.options = res || []
			this.options.unshift({ name: '项目名称' })
			this.options.push({ name: '合计' })
		})
		this.getList();
	}
}
</script>
<style lang="scss">
.el-table {
  &.default-table {
    font-size: 14px;
    color: #606266;
    line-height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    .table-tr {
      display: block;
      flex: auto;
      padding: 12px;
      text-align: center;
      line-height: 23px;
      &:nth-last-of-type(1) {
        min-width: 60px;
      }
      &:nth-of-type(1) {
        min-width: 100px;
      }
    }
  }
}
</style>
