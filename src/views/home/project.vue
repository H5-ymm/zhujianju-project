<template>
	<div>
		<el-form :inline="true" :model="query" class="query-form">
			<el-form-item class="query-form-item">
				<el-input v-model="query.keyword" class="width200" placeholder="项目名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
					<el-button type="primary" icon="el-icon-document-copy" v-print="'#printTest'">打印</el-button>
				</el-button-group>
			</el-form-item>
		</el-form>
		<el-table
			id="printTest"
			class="common-table"
			v-loading="loading"
			:data="list"
			style="width: 100%;"
			max-height="500px"
		>
			<el-table-column label="项目名称" align="center" prop="name" width="120px"></el-table-column>
			<el-table-column
				:label="item.name"
				v-if="options.length"
				:key="index"
				v-for="(item,index) in options"
				width="100px"
				align="center"
			>
				<template slot-scope="scope">
					<span>{{scope.row.typelist[index]}}</span>
				</template>
			</el-table-column>
			<el-table-column label="合计" align="center" min-width="120px" fixed="right">
				<template slot-scope="scope">
					<span>{{scope.row.typelist[scope.row.typelist.length-1]}}</span>
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
export default {
	data() {
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
			typelist: []
		};
	},
	methods: {
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
		getList() {
			this.loading = true;
			listCount(this.query)
				.then(response => {
					this.loading = false;
					this.list = response.data || [];
					this.total = response.count || 0;
				})
				.catch(() => {
					this.loading = false;
					this.list = [];
					this.total = 0
				});
		},
	},
	created() {
		// 将参数拷贝进查询对象
		let query = this.$route.query;
		this.query = Object.assign(this.query, query);
		this.query.limit = parseInt(this.query.limit);
		// 加载表格数据
		this.getList();
		this.getType(3).then(res => {
			this.options = res || []
		})
	}
}

</script>
