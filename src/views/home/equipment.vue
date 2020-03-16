<template>
	<div>
		<el-form :inline="true" :model="query" class="query-form">
			<el-form-item class="query-form-item">
				<el-input v-model="query.keyword" class="width200" placeholder="设备编号"></el-input>
			</el-form-item>
			<el-form-item class="query-form-item">
				<el-date-picker
					v-model="timeList"
					value-format="timestamp"
					@change="changeTime"
					type="daterange"
					range-separator="-"
					class="width300"
					unlink-panels
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				></el-date-picker>
			</el-form-item>
			<!-- <el-form-item class="query-form-item">
				<el-date-picker v-model="query.date" value-format="timestamp" type="date" placeholder="选择日期时间"></el-date-picker>
			</el-form-item>-->
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
					<el-button type="primary" icon="el-icon-plus" @click.native="handleForm(null, null)">新增</el-button>
				</el-button-group>
			</el-form-item>
		</el-form>
		<vue-easy-print :tableShow="false" ref="easyPrint" :onePageRow="10">
			<template>
				<workerTable :list="list" :is_wmadmin="is_wmadmin"></workerTable>
			</template>
		</vue-easy-print>
		<el-table
			class="common-table"
			id="printTest"
			v-loading="loading"
			:data="list"
			:row-class-name="tableRowClassName"
			style="width: 100%;"
			max-height="1000px"
		>
			<el-table-column label="起重设备编号" align="center" prop="number" width="110px"></el-table-column>
			<el-table-column label="设备类型" prop="type" width="110px" align="center"></el-table-column>
			<el-table-column label="项目名称" prop="name" min-width="110px" align="center"></el-table-column>
			<el-table-column label="报备日期" width="170px" align="center">
				<template slot-scope="scope">
					<span>
						{{scope.row.endtime?
						$moment.unix(scope.row.report_date).format('YYYY-MM-DD'):''}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="到检日期" width="110px" align="center">
				<template slot-scope="scope">
					<span>
						{{scope.row.endtime?
						$moment.unix(scope.row.check_date).format('YYYY-MM-DD'):''}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="司机" width="110px" prop="driver" align="center"></el-table-column>
			<el-table-column
				label="操作"
				v-if="!is_wmadmin"
				class="no-print"
				align="center"
				min-width="120px"
				fixed="right"
			>
				<template slot-scope="scope">
					<el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click.native="viewDetail(scope.$index, scope.row)">查看</el-button>
					<!-- <el-button type="text" size="small" @click.native="handleDel(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:page-size="query.limit"
			@current-change="handleCurrentChange"
			layout="prev, pager, next,total"
			:total="total"
		></el-pagination>
		<!--表单-->
		<el-dialog title="提示" :visible.sync="dialogVisible" width="36%" :before-close="handleClose">
			<el-radio-group v-model="status">
				<el-radio :label="1">通过</el-radio>
				<el-radio :label="2">拒绝</el-radio>
			</el-radio-group>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleCheck">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog
			:title="formMap[formName]"
			:visible.sync="formVisible"
			:before-close="hideForm"
			width="40%"
			top="5vh"
			class="form-dialog"
		>
			<el-form
				:model="formData"
				:inline="true"
				label-width="160px"
				label-position="right"
				class="form"
				:rules="addRules"
				ref="dataForm"
			>
				<el-form-item label="起重设备编号" prop="number">
					<el-input
						class="width240"
						:readonly="readonly"
						@change="changeInput"
						placeholder="请输入起重设备编号"
						v-model="formData.number"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="设备类型" prop="type">
					<el-select v-model="formData.type" :disabled="readonly" class="width240" placeholder="请选择设备类型">
						<el-option
							v-for="(item, index) in options"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="项目名称" prop="name">
					<el-select v-model="query.name" filterable class="width240" placeholder="请选择项目名称">
						<el-option
							v-for="(item, index) in projectList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="报备日期" prop="report_date">
					<el-date-picker
						v-model="query.report_date"
						class="width240"
						value-format="timestamp"
						type="date"
						placeholder="选择报备日期"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="检查日期" prop="check_date">
					<el-date-picker
						v-model="query.check_date"
						value-format="timestamp"
						type="date"
						class="width240"
						placeholder="选择检查日期"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="司机" prop="driver">
					<el-input
						class="width240"
						:readonly="readonly"
						placeholder="请输入紧急联系人"
						v-model="formData.driver"
						auto-complete="off"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="hideForm">取消</el-button>
				<el-button
					type="primary"
					@click.native="formSubmit()"
					:loading="formLoading"
					v-if="!readonly"
				>提交</el-button>
			</div>
		</el-dialog>
		<equipDetail
			:equipmentId="equipmentId"
			:formVisible="formDetailVisible"
			@hideForm="formDetailVisible=false"
		></equipDetail>
	</div>
</template>

<script>
import {
	getEquipment,
	addEquipment
} from "../../api/equipment/index";
import { getNamelist } from "../../api/project/index";
import equipDetail from "../../components/modal/equipDetail.vue";
import { geTypeAll } from "../../api/file/data"
import { getImg } from "../../utils/util.js";
import vueEasyPrint from "../../components/vue-easy-print";
import workerTable from "../../components/workerTable";

const formJson = {
	name: "",
	number: "",
	tel: '',
	type: '',
	report_date: '',
	check_date: '',
	driver: ''
};
export default {
	components: {
		equipDetail: equipDetail,
		workerTable: workerTable,
		vueEasyPrint: vueEasyPrint
	},
	data() {
		return {
			formDetailVisible: false,
			dialogVisible: false,
			equipmentId: '',
			roles: [],
			query: {
				keyword: '',
				page: 1,
				limit: 10,
				date: '',
				item_id: '',
				job_type: ''
			},
			list: [],
			value: '',
			total: 0,
			loading: true,
			index: null,
			formName: null,
			formMap: {
				add: "新增",
				edit: "编辑"
			},
			options: [],
			formLoading: false,
			formVisible: false,
			formData: formJson,
			address: [],
			formRules: {},
			status: 1,
			addRules: {
				name: [
					{ required: true, message: "请选择项目名称", trigger: "change" }
				],
				number: [
					{ required: true, message: "请输入设备编码", trigger: "blur" },
				],
				type: [
					{ required: true, message: "请选择设备类型", trigger: "change" }
				],
				driver: [
					{ required: true, message: "请输入司机姓名", trigger: "blur" },
				],
			},
			deleteLoading: false,
			checkObj: {},
			readonly: false,
			checkStatus: 1,
			projectList: [],
			workman_id: '',
			timeList: []
		};
	},
	computed: {
		is_wmadmin() {
			return this.$store.state.admin.is_wmadmin
		}
	},
	created() {
		// 将参数拷projectList贝进查询对象
		let query = this.$route.query;
		this.query = Object.assign(this.query, query);
		this.query.limit = parseInt(this.query.limit);
		this.getList();
		this.getType(5).then(res => {
			this.options = res
		})
		this.getProject()
	},
	methods: {
		getProject() {
			getNamelist().then(res => {
				this.projectList = res
			})
		},
		tableRowClassName({ row, rowIndex }) {
			console.log(row)
			if (row.out_time == 1) {
				return 'warn-row';
			}
			return '';
		},
		changeTime(value) {
			this.query.starttime = value[0] ? value[0] : ''
			this.query.endtime = value[1] ? value[1] : ''
		},
		printView() {
			this.$refs.easyPrint.print()
		},
		viewQrcode() {
			getqrcode().then(res => {
				if (res) {
					let url = getImg(res)
					this.$alert(`<img src=${url} />`, '二维码', {
						dangerouslyUseHTMLString: true
					}).then(() => {
						console.log(1)
					})
						.catch(action => {
							console.log(action)
						});
				}
			})
		},
		districtChange(val) {
			this.formData.provinceid = val[0]
			this.formData.cityid = val[1]
			this.formData.areaid = val[2]
		},
		changeInput(e) {
			getworkmanbytel({ tel: e }).then(res => {
				if (res) {
					this.formData = res
					this.readonly = true
				} else {
					this.readonly = false
				}
			})
		},
		onReset() {
			this.query = {
				keyword: '',
				page: 1,
				limit: 10,
				date: '',
				item_id: '',
				job_type: ''
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
		checkSign(val) {
			console.log(val)
			this.checkStatus = 2
			this.status = Number(val.sure_attendance)
			console.log(this.status)
			this.workman_id = val.id
			this.dialogVisible = true
		},
		reviewSign() {
			let params = {
				workman_id: this.workman_id,
				status: this.status,
				time: this.query.date
			}
			sureAttendance(params).then(res => {
				this.status = 1
				if (res) {
					this.dialogVisible = false;
					this.$message.success("操作成功");
					this.getList()
				} else {
					this.$message.error("操作失败");
				}
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
			getEquipment(this.query)
				.then(response => {
					this.readonly = false
					this.loading = false;
					this.list = response.data || [];
					this.total = response.count || 0;
				})
				.catch(() => {
					this.readonly = false
					this.loading = false;
					this.list = [];
					this.total = 0;
					this.roles = [];
				});
		},
		// 刷新表单
		resetForm() {
			if (this.$refs["dataForm"]) {
				this.readonly = false
				// 清空验证信息表单
				this.$refs["dataForm"].clearValidate();
				// 刷新表单
				this.$refs["dataForm"].resetFields();
			}
		},
		// 隐藏表单
		hideForm() {
			// 更改值
			this.readonly = false
			this.formVisible = !this.formVisible;
			// 清空表单
			this.$refs["dataForm"].resetFields();
			return true;
		},
		// 显示表单
		handleForm(index, row) {
			this.formVisible = true;
			this.formData = JSON.parse(JSON.stringify(formJson));
			if (row !== null) {
				this.formData = Object.assign({}, row);
				if (row.provinceid) {
					this.getDetail(row.id)
				}
			}
			this.formName = "add";
			this.formRules = this.addRules;
			if (index !== null) {
				this.index = index;
				this.formName = "edit";
				this.formRules = this.editRules;
			}
		},
		getDetail(id) {
			getWorkmanDetail({ id }).then(res => {
				if (res.provinceid) {
					this.address = [res.provinceid, res.cityid, res.areaid]
				}
				this.formData = res
			})
		},
		viewDetail(index, row) {
			this.equipmentId = row.id
			this.formDetailVisible = true
		},
		switchCheck(item) {
			this.checkStatus = 1
			this.checkObj = item
			this.dialogVisible = true
		},
		handleClose() {
			this.dialogVisible = false
		},
		handleCheck() {
			if (this.checkStatus == 1) {
				let params = {
					id: this.checkObj.wid,
					status: this.status
				}
				this.formLoading = true;
				saveStatus(params).then(response => {
					if (response) {
						this.formLoading = false;
						this.$message.success("操作成功");
						this.dialogVisible = false;
						this.getList()
					} else {
						this.$message.error("操作失败");
					}
					this.resetForm();
				});
			} else {
				this.reviewSign()
			}
		},
		addUser(data) {
			addEquipment(data).then(response => {
				if (response) {
					this.formLoading = false;
					this.$message.success("操作成功");
					this.formVisible = false;
					this.getList()
				} else {
					this.$message.error("操作失败");
				}
				this.resetForm();
			});
		},
		formSubmit() {
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					this.formLoading = true;
					let data = Object.assign({}, this.formData);
					if (!data.id) {
						this.addUser(data)
					} else {
						updateWorkman(data, this.formName).then(response => {
							if (response) {
								this.formLoading = false;
								this.$message.success("操作成功");
								this.formVisible = false;
								this.getList()
							} else {
								this.$message.error("操作失败");
							}
							this.resetForm();
						});
					}
				}
			});
		},
		// 删除
		handleDel(index, row) {
			if (row.id) {
				this.$confirm("确认删除该工人吗?", "提示", {
					type: "warning"
				})
					.then(() => {
						let para = { id: row.id };
						this.deleteLoading = true;
						deleteWorkman(para)
							.then(response => {
								this.deleteLoading = false;
								if (response) {
									this.$message.success("操作成功");
									this.getList()
								} else {
									this.$message.error("操作失败");
								}
							})
							.catch(() => {
								this.deleteLoading = false;
							});
					})
					.catch(() => {
						this.$message.info("取消删除");
					});
			}
		}
	}
}
</script>
<style lang="scss">
.el-message-box__container {
  .el-message-box__message {
    > p {
      text-align: center;
    }
  }
}
.query-form {
  .el-input--suffix .el-input__inner {
    padding-right: 35px;
    &:focus {
      padding-right: 35px;
    }
  }
}
.el-table .warn-row {
  background: #f56c6c;
  color: #fff;
}
.el-table .warn-row:hover {
  color: #333;
}
</style>
