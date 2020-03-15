<template>
	<div>
		<el-form :inline="true" :model="query" class="query-form">
			<el-form-item class="query-form-item">
				<el-input v-model="query.keyword" class="width200" placeholder="工人姓名"></el-input>
			</el-form-item>
			<el-form-item v-if="!is_wmadmin">
				<el-select v-model="query.item_id" filterable class="width240" placeholder="请选择项目名称">
					<el-option
						v-for="(item, index) in projectList"
						:key="item.id"
						:label="item.name"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="query.job_type" class="width240" placeholder="请选择工种">
					<el-option v-for="(item, index) in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item class="query-form-item">
				<el-date-picker v-model="query.date" value-format="timestamp" type="date" placeholder="选择日期时间"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
					<el-button
						type="primary"
						icon="el-icon-plus"
						v-if="is_wmadmin"
						@click.native="handleForm(null, null)"
					>新增</el-button>
					<el-button
						type="primary"
						v-if="is_wmadmin"
						@click.native="viewQrcode"
						icon="el-icon-view"
					>查看二维码</el-button>
					<el-button type="primary" icon="el-icon-document-copy" @click="printView" v-if="IsPC()">打印</el-button>
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
			style="width: 100%;"
			max-height="1000px"
		>
			<el-table-column label="工人姓名" align="center" prop="name" width="110px"></el-table-column>
			<el-table-column label="地区" min-width="110px" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.address}}</span>
				</template>
			</el-table-column>
			<el-table-column label="身份证号" prop="id_card" width="170px" align="center"></el-table-column>
			<el-table-column label="手机号" width="110px" prop="tel" align="center"></el-table-column>
			<el-table-column label="工种" prop="job_type" width="110px" align="center"></el-table-column>
			<el-table-column label="性别" align="center" width="60px">
				<template slot-scope="scope">
					<span>{{scope.row.sex===1?'男':'女'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="当天体温" width="80px" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.temperature?scope.row.temperature+'度':''}}</span>
				</template>
			</el-table-column>
			<el-table-column label="紧急联系人" width="110px" prop="link_man" align="center"></el-table-column>
			<el-table-column label="状态" align="center" v-if="is_wmadmin">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.status==0?'warning':scope.row.status==1?'success':'danger'"
					>{{scope.row.status==0?'待审核':scope.row.status==1?'已通过':'已拒绝'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="签到状态" align="center" v-if="is_wmadmin">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.is_attendance==0?'warning':'success'"
					>{{scope.row.is_attendance==0?'未签到':'已签到'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="审核签到状态" align="center" v-if="is_wmadmin">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.sure_attendance==0?'warning':scope.row.sure_attendance==1?'success':'danger'"
					>{{scope.row.sure_attendance==0?'待确认':scope.row.sure_attendance==1?'已确认':'未签到'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="党员" align="center" width="60px">
				<template slot-scope="scope">
					<span>{{scope.row.partymember===1?'是':'否'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="贫困户" align="center" width="70px">
				<template slot-scope="scope">
					<span>{{scope.row.destitutemember===1?'是':'否'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="政府补助金额" prop="amount_of_grant" align="center" width="110px"></el-table-column>
			<el-table-column
				label="操作"
				class="no-print"
				v-if="is_wmadmin"
				align="center"
				min-width="120px"
				fixed="right"
			>
				<template slot-scope="scope">
					<el-button type="text" size="small" @click.native="switchCheck(scope.row)">审核</el-button>
					<el-button type="text" size="small" @click.native="checkSign(scope.row)">审核签到</el-button>
					<el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click.native="viewDetail(scope.$index, scope.row)">查看</el-button>
					<el-button type="text" size="small" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
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
				<el-form-item label="手机号" prop="tel">
					<el-input
						class="width240"
						:readonly="readonly"
						@change="changeInput"
						placeholder="请输入联系方式"
						v-model="formData.tel"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="工人姓名" prop="name">
					<el-input
						v-model="formData.name"
						:readonly="readonly"
						placeholder="请输入工人姓名"
						class="width240"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="工种" prop="job_type">
					<el-select v-model="formData.job_type" :disabled="readonly" class="width240" placeholder="请选择">
						<el-option
							v-for="(item, index) in options"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="身份证" prop="id_card">
					<el-input
						v-model="formData.id_card"
						:readonly="readonly"
						placeholder="请输入身份证"
						class="width240"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="来源地" prop="address">
					<div class="width240 select-input" v-if="!readonly">
						<selectCity @change="districtChange" :address="address"></selectCity>
					</div>
					<div class="width240 select-input" v-else>
						<p></p>
					</div>
				</el-form-item>
				<el-form-item label="住址" prop="address">
					<el-input
						class="width240"
						placeholder="请输入住址"
						v-model="formData.address"
						:readonly="readonly"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group class="width240" v-model="formData.sex">
						<el-radio :label="1" :disabled="readonly">男</el-radio>
						<el-radio :label="2" :disabled="readonly">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="紧急联系人" prop="link_tel">
					<el-input
						class="width240"
						:readonly="readonly"
						placeholder="请输入紧急联系人"
						v-model="formData.link_man"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="党员">
					<el-radio-group class="width240" v-model="formData.partymember">
						<el-radio :label="1" :disabled="readonly">是</el-radio>
						<el-radio :label="2" :disabled="readonly">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="贫困户">
					<el-radio-group class="width240" v-model="formData.destitutemember">
						<el-radio :label="1" :disabled="readonly">是</el-radio>
						<el-radio :label="2" :disabled="readonly">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="政府补助金额" v-if="formData.destitutemember==1">
					<el-input
						class="width240"
						:readonly="readonly"
						placeholder="请输入补助金额"
						v-model="formData.amount_of_grant"
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
		<workerDetail
			:workerId="workerId"
			:formVisible="formDetailVisible"
			@hideForm="formDetailVisible=false"
		></workerDetail>
	</div>
</template>

<script>
import {
	getWorkmanList,
	updateWorkman,
	addWorkman,
	deleteWorkman,
	getWorkmanDetail,
	saveStatus,
	getworkmanbytel,
	getqrcode,
	sureAttendance
} from "../../api/workman/index";
import { getNamelist } from "../../api/project/index";
import WorkerDetail from "../../components/modal/workerDetail.vue";
import selectCity from "../../components/selectCity.vue";
import { geTypeAll } from "../../api/file/data"
import { validateIdCard, getImg } from "../../utils/util.js";
import vueEasyPrint from "../../components/vue-easy-print";
import workerTable from "../../components/workerTable";

const formJson = {
	id: "",
	sex: "",
	name: "",
	id_card: "",
	tel: '',
	job_type: '',
	link_man: '',
	link_tel: '',
	destitutemember: '',
	partymember: '',
	address: '',
	amount_of_grant: ''
};
export default {
	components: {
		WorkerDetail: WorkerDetail,
		selectCity: selectCity,
		workerTable: workerTable,
		vueEasyPrint: vueEasyPrint
	},
	data() {
		let validatereg = (rule, value, callback) => {
			//验证用户名是否合法
			let reg = /^1[3456789]\d{9}$/
			if (value === '') {
				callback()
			} else if (!reg.test(value)) {
				callback(new Error('手机号格式不正确'))
			} else {
				callback()
			}
		}
		var validate = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入身份证号码'));
			} else {
				if (!validateIdCard(value)) {
					callback(new Error('请输入正确的身份证号码'));
				}
				callback()
			}
		};
		return {
			formDetailVisible: false,
			dialogVisible: false,
			workerId: '',
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
					{ required: true, message: "请输入工人姓名", trigger: "blur" }
				],
				tel: [
					{ required: true, message: "请输入联系人电话", trigger: "blur" },
					{ validator: validatereg, trigger: 'blur' }
				],
				job_type: [
					{ required: true, message: "请选择工种类型", trigger: "change" }
				],
				id_card: [
					{ required: true, message: "请输入联系人身份证", trigger: "blur" },
					{ validator: validate, trigger: 'blur' }
				],
			},
			deleteLoading: false,
			checkObj: {},
			readonly: false,
			checkStatus: 1,
			projectList: [],
			workman_id: ''
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
		this.getType(3).then(res => {
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
			getWorkmanList(this.query, this.is_wmadmin)
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
			this.workerId = row.id
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
			addWorkman(data).then(response => {
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
</style>
