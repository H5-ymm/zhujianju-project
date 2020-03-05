<template>
	<div>
		<el-form :inline="true" :model="query" class="query-form">
			<el-form-item class="query-form-item">
				<el-input v-model="query.keyword" class="width200" placeholder="项目名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
					<el-button type="primary" icon="el-icon-document-copy" v-print="'#printTest'" v-if="IsPC()">打印</el-button>
				</el-button-group>
			</el-form-item>
		</el-form>
		<el-table id="printTest" show-summary :summary-method="getSummaries" class="common-table" v-loading="loading" :data="list" style="width: 100%;" max-height="1000px">
			<el-table-column label="项目名称" align="center" prop="name" min-width="100px"></el-table-column>
			<el-table-column :label="item.name" v-if="options.length" v-for="(item,index) in options" :key="index" width="80px" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.typelist[index]}}</span>
				</template>
			</el-table-column>
			<el-table-column label="合计" align="center" min-width="80px" fixed="right">
				<template slot-scope="scope">
					<span>{{scope.row.typelist[scope.row.typelist.length-1]}}</span>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :page-size="query.limit" @current-change="handleCurrentChange" layout="prev, pager, next,total" :total="total"></el-pagination>
	</div>
</template>
<script>
import {
	listCount
} from "../../api/workman/index";
import { geTypeAll } from "../../api/file/data"
export default {
	data () {
		return {
			query: {
				keyword: '',
				page: 1,
				limit: 20
			},
			list: [],
			value: '',
			total: 0,
			loading: true,
			index: null,
			options: [],
			typelist: [],
			totalList: []
		};
	},
	methods: {
		getSummaries (param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}
				sums[index] = this.totalList.reduce((prev, curr) => {
					const value = Number(curr);
					return value;
				}, 0);
			});

			return sums;
		},
		onReset () {
			this.query = {
				keyword: '',
				page: 1,
				limit: 20
			};
			this.getList();
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
			listCount(this.query)
				.then(response => {
					this.loading = false;
					this.totalList = response.total
					this.list = response.data || [];
					this.total = response.count || 0;
					this.options = [{ "id": 7, "name": "管理人员", "pid": 3 }, { "id": 8, "name": "瓦工", "pid": 3 }, { "id": 9, "name": "钢筋工", "pid": 3 }, { "id": 10, "name": "木工", "pid": 3 }, { "id": 11, "name": "架子工", "pid": 3 }, { "id": 12, "name": "水暖工", "pid": 3 }, { "id": 13, "name": "电工", "pid": 3 }, { "id": 14, "name": "起重司机", "pid": 3 }, { "id": 15, "name": "模板工", "pid": 3 }, { "id": 28, "name": "混泥土工", "pid": 3 }, { "id": 29, "name": "临工", "pid": 3 }, { "id": 30, "name": "其他", "pid": 3 }, { "id": 32, "name": "焊工", "pid": 3 }, { "id": 33, "name": "信号司索工", "pid": 3 }]
				})
				.catch(() => {
					this.loading = false;
					this.list = [];
					this.totalList = []
					this.total = 0
				});
		},
	},
	created () {
		// 将参数拷贝进查询对象
		let query = this.$route.query;
		this.query = Object.assign(this.query, query);
		this.query.limit = parseInt(this.query.limit);
		// 加载表格数据
		this.getList();


		// this.getType(3).then(res => {
		// 		this.options = res || []
		// 		let arr = []
		// 		this.list.map((item, index) => {
		// 			let arr1 = []
		// 			this.options.forEach((val, ind) => {
		// 				arr1.push({ label: val.name, num: item.typelist[ind] })
		// 			})
		// 			return arr1.unshift({ label: '项目名称', num: item.name })
		// 		})
		// 		console.log(arr1)
		// 	})
	}
}

</script>
