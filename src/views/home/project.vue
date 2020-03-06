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
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
					<el-button type="primary" icon="el-icon-document-copy" v-print="'#printTest'" v-if="IsPC()">打印</el-button>
				</el-button-group>
			</el-form-item>
		</el-form>
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
				width="80px"
				align="center"
			>
				<template slot-scope="scope">
					<span>{{scope.row.typelist[index]}}</span>
				</template>
			</el-table-column>
		</el-table>
		<!-- <div class="el-table default-table" ref="table1">
			<span class="table-tr">合计</span>
			<span v-for="(item,index) in totalList" class="table-tr" :key="index">{{item}}</span>
		</div>-->
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
				limit: 20,
				starttime: '',
				enttime: ''
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
