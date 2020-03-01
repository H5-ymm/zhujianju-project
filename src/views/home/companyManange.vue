<template>
	<div>
		<el-form :inline="true" :model="query" class="query-form">
			<el-form-item class="query-form-item">
				<el-input v-model="query.keyword" class="width200" placeholder="公司名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
					<el-button type="primary" @click.native="handleForm(null, null)">新增</el-button>
				</el-button-group>
			</el-form-item>
		</el-form>
		<el-table
			v-loading="loading"
			class="common-table"
			:data="list"
			style="width: 100%;"
			max-height="500px"
		>
			<el-table-column label="公司名称" align="center" prop="com_name"></el-table-column>
			<el-table-column label="公司类型" prop="com_type" align="center">
			</el-table-column>
			<el-table-column label="法人联系人" width="100px"  prop="corporation_name" align="center" ></el-table-column>
			<el-table-column label="法人联系电话" align="center" width="110px" prop="corporation_tel"></el-table-column>
			<el-table-column label="法人身份证" align="center" min-width="110px" prop="corporation_idcard"></el-table-column>
			<el-table-column label="营业执照号" align="center" min-width="100px" prop="permit_id"></el-table-column>
			<el-table-column label="操作" align="center" min-width="120px" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click.native="viewDetail(scope.row)">查看</el-button>
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
				<el-form-item label="公司名称" prop="com_name">
					<el-input
						v-model="formData.com_name"
						placeholder="请输入公司名称"
						class="width240"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="公司类型" prop="com_type">
					<el-select class="width240" v-model="formData.com_type" value-key="name" placeholder="请选择">
						<el-option v-for="(item, index) in options"
						:key="item.name" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="营业执照号" prop="permit_id">
					<el-input
						v-model="formData.permit_id"
						placeholder="请输入营业执照号"
						class="width240"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="法人名称" prop="corporation_name">
					<el-input
						class="width240"
						placeholder="请输入法人名称"
						v-model="formData.corporation_name"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="法人联系方式" prop="corporation_tel">
					<el-input
						class="width240"
						placeholder="请输入法人联系方式"
						v-model="formData.corporation_tel"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="法人身份证" prop="corporation_idcard">
					<el-input
						class="width240"
						placeholder="请输入法人身份证"
						v-model="formData.corporation_idcard"
						auto-complete="off"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="hideForm">取消</el-button>
				<el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
			</div>
		</el-dialog>
		<companyDetail
			:companyId="companyId"
			@hideForm="formDetailVisible=false"
			:formVisible="formDetailVisible"
		></companyDetail>
	</div>
</template>

<script>
import {
	getCompanyList,
	updateCompany,
	addCompany,
	deleteCompany,
	getDetail
} from "../../api/company/index";
import { geTypeAll } from "../../api/file/data"
import companyDetail from "../../components/modal/companyDetail.vue";
import { validateIdCard, checkMobile } from "../../utils/util.js";
const formJson = {
	id: "",
	com_name: "",
	com_type: "",
	permit_id: "",
	corporation_name: '',
	corporation_tel: '',
	corporation_idcard: ''
};
export default {
	components: {
		companyDetail: companyDetail
	},
	data() {
		let validatereg = (rule, value, callback) => {
			//验证用户名是否合法
			let reg = /^1[3456789]\d{9}$/
			if (value === '') {
				this.isShowPhone = true
				callback()
			} else if (!reg.test(value)) {
				this.isShowPhone = false
				callback(new Error('手机号格式不正确'))
			} else {
				this.isShowPhone = false
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
			companyId: '',
			roles: [],
			query: {
				keyword: "",
				page: 1,
				limit: 20
			},
			list: [],
			total: 0,
			options: [{
				value: '1',
				label: '建设单位'
			}, {
				value: '2',
				label: '勘察单位'
			}],
			loading: true,
			index: null,
			formName: null,
			formMap: {
				add: "新增公司信息",
				edit: "编辑公司信息"
			},
			formLoading: false,
			formVisible: false,
			formData: formJson,
			formRules: {},
			addRules: {
				com_name: [
					{ required: true, message: "请输入企业名称", trigger: "blur" }
				],
				permit_id: [
					{ required: true, message: "请输入营业执照", trigger: "blur" }
				],
				corporation_name: [
					{ required: true, message: "请输入法人", trigger: "blur" }
				],
				corporation_tel: [
					{ required: true, message: "请输入法人电话", trigger: "blur" },
					{ validator: validatereg, trigger: 'blur' }
				],
				com_type: [
					{ required: true, message: "请选择企业类型", trigger: "blur" }
				],
				corporation_idcard: [
					{ required: true, message: "请输入法人身份证", trigger: "blur" },
					{ validator: validate, trigger: 'blur' }
				],

			},
			editRules: {
				username: [
					{ required: true, message: "请输入姓名", trigger: "blur" }
				],
				status: [
					{ required: true, message: "请选择状态", trigger: "change" }
				]
			},
			deleteLoading: false
		};
	},
	methods: {
		viewDetail(row) {
			console.log(row)
			this.companyId = row.id
			console.log(this.companyId)
			this.formDetailVisible = true
		},
		onReset() {
			this.$router.push({
				path: ""
			});
			this.query = {
				keyword: "",
				page: 1,
				limit: 20
			};
			this.getList();
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
			getCompanyList(this.query)
				.then(response => {
					this.loading = false;
					this.list = response.data || [];
					this.total = response.count || 0;
				})
				.catch(() => {
					this.loading = false;
					this.list = [];
					this.total = 0;
					this.roles = [];
				});
		},
		getRoleList() {
			authAdminRoleList(this.query)
				.then(response => {
					this.roles = response.data.list || [];
				})
				.catch(() => {
					this.roles = [];
				});
		},
		// 刷新表单
		resetForm() {
			if (this.$refs["dataForm"]) {
				// 清空验证信息表单
				this.$refs["dataForm"].clearValidate();
				// 刷新表单
				this.$refs["dataForm"].resetFields();
			}
		},
		// 隐藏表单
		hideForm() {
			// 更改值
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
				this.getCompanyDetail(row.id)
			}
			this.formName = "add";
			this.formRules = this.addRules;
			if (index !== null) {
				this.index = index;
				this.formName = "edit";
				this.formRules = this.editRules;
			}
		},
		getCompanyDetail(id) {
			getDetail({ id }).then(res => {
				this.formData = res
				this.formData.com_type = Number(this.formData.com_type)
			})
		},
		editCompany(data) {
			this.formLoading = true;
			updateCompany(data).then(response => {
				this.formLoading = false;
				this.$message.success("操作成功");
				this.formVisible = false;
				this.getList()
				// 刷新表单
				this.resetForm();
			});
		},
		formSubmit() {
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					this.formLoading = true;
					let data = Object.assign({}, this.formData);
					if (this.formData.id) {
						this.editCompany(data)
					} else {
						addCompany(data).then(response => {
							this.formLoading = false;
							this.$message.success("操作成功");
							this.formVisible = false;
							this.getList()
							// 刷新表单
							this.resetForm();
						})
					}
				}
			});
		},
		// 删除
		handleDel(index, row) {
			if (row.id) {
				this.$confirm("确认删除该企业吗?", "提示", {
					type: "warning"
				})
					.then(() => {
						let para = { id: row.id };
						this.deleteLoading = true;
						deleteCompany(para)
							.then(response => {
								this.deleteLoading = false;
								if (response.code) {
									this.$message.error(response.message);
									return false;
								}
								this.$message.success("操作成功");
								// 刷新数据
								this.list.splice(index, 1);
							})
							.catch(() => {
								this.deleteLoading = false;
							});
					})
					.catch(() => {
						this.$message.info("取消删除");
					});
			}
		},
		getType(pid) {
			let params = {
				pid: pid,
				keyword: ''
			}
			return new Promise((resolve, reject) => {
				geTypeAll(params).then(res => {
					resolve(res)
				})
			})
		},
	},
	mounted() { },
	created() {
		// 将参数拷贝进查询对象
		let query = this.$route.query;
		this.query = Object.assign(this.query, query);
		this.query.limit = parseInt(this.query.limit);
		// 加载表格数据
		this.getList();
		// 加载角色列表
		this.getType(4).then(res => {
			this.options = res
		})
		// this.getRoleList();
	}
};
</script>

<style  lang="scss">
</style>
