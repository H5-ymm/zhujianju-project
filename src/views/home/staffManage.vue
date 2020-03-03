<template>
	<div>
		<el-form :inline="true" :model="query" class="query-form">
			<el-form-item class="query-form-item">
				<el-input v-model="query.keyword" class="width200" placeholder="工人名称"></el-input>
			</el-form-item>
			<el-form-item class="query-form-item" v-if="is_wmadmin">
				<el-select v-model="query.status" class="width200" placeholder="状态">
					<el-option label="全部" value=""></el-option>
					<el-option label="待审核" value="0"></el-option>
					<el-option label="已通过" value="1"></el-option>
					<el-option label="已拒绝" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item class="query-form-item">
				<el-date-picker v-model="query.date" value-format="timestamp" type="datetime" placeholder="选择日期时间"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
					<el-button type="primary" @click.native="handleForm(null, null)">新增</el-button>
						<el-button type="primary" v-if="is_wmadmin" @click.native="viewQrcode">查看二维码</el-button>
				</el-button-group>
			</el-form-item>
		</el-form>
		<el-table class="common-table" v-loading="loading" :data="list" style="width: 100%;" max-height="500px">
			<el-table-column label="工人名称" align="center" prop="name" width="100px"></el-table-column>
			<el-table-column label="当天体温" width="100px" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.temperature?scope.row.temperature+'度':''}}</span>
				</template>
			</el-table-column>
			<el-table-column label="工种" prop="job_type" align="center"></el-table-column>
			<el-table-column label="手机号" width="110px" prop="link_tel" align="center"></el-table-column>
			<el-table-column label="紧急联系人" width="110px" prop="link_man" align="center"></el-table-column>
			<el-table-column label="身份证号" prop="id_card" width="170px" align="center"></el-table-column>
			<el-table-column label="地区" min-width="100px" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.address}}</span>
				</template>
			</el-table-column>
			<el-table-column label="性别" align="center" width="50px">
				<template slot-scope="scope">
					<span>{{scope.row.sex===1?'男':'女'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="状态"  align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status==0?'warning':scope.row.status==1?'success':'danger'"
          >{{scope.row.status==0?'待审核':scope.row.status==1?'已通过':'已拒绝'}}</el-tag>
        </template>
      </el-table-column>
			<el-table-column label="操作" v-if="is_wmadmin" align="center" min-width="120px" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click.native="switchCheck(scope.row)">审核</el-button>
					<el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click.native="viewDetail(scope.$index, scope.row)">查看</el-button>
					<el-button type="text" size="small" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :page-size="query.limit" @current-change="handleCurrentChange" layout="prev, pager, next,total" :total="total"></el-pagination>
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
		<el-dialog :title="formMap[formName]" :visible.sync="formVisible" :before-close="hideForm" width="40%" top="5vh" class="form-dialog">
			<el-form :model="formData" :inline="true" label-width="160px" label-position="right" class="form" :rules="addRules" ref="dataForm">
				<el-form-item label="联系方式" prop="tel">
					<el-input class="width240" :readonly="readonly" @change="changeInput" placeholder="请输入联系方式" v-model="formData.tel" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="工人名称" prop="name">
					<el-input v-model="formData.name" :readonly="readonly" placeholder="请输入工人名称" class="width240" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="工种" prop="job_type">
					<el-select v-model="formData.job_type" :disabled="readonly" class="width240" placeholder="请选择">
						<el-option v-for="(item, index) in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="身份证" prop="id_card">
					<el-input v-model="formData.id_card" :readonly="readonly" placeholder="请输入身份证" class="width240" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" placeholder="请选择性别">
					<el-radio-group class="width240" v-model="formData.sex">
						<el-radio :label="1" :disabled="readonly">男</el-radio>
						<el-radio :label="2" :disabled="readonly">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="紧急联系人" prop="link_tel">
					<el-input class="width240" :readonly="readonly" placeholder="请输入紧急联系人" v-model="formData.link_man" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="address">
					<div class="width240 select-input" v-if="!readonly">
						<selectCity @change="districtChange" :address="address"></selectCity>
					</div>
					<div class="width240 select-input" v-else>
						<p></p>
					</div>
				</el-form-item>
				<el-form-item label="来源地" prop="address">
					<el-input class="width240" placeholder="请输入来源地" v-model="formData.address" :readonly="readonly" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="hideForm">取消</el-button>
				<el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
			</div>
		</el-dialog>
		<workerDetail :workerId="workerId" :formVisible="formDetailVisible" @hideForm="formDetailVisible=false"></workerDetail>
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
	bindWorkman,
	getqrcode
} from "../../api/workman/index";
import WorkerDetail from "../../components/modal/workerDetail.vue";
import selectCity from "../../components/selectCity.vue";
import { geTypeAll } from "../../api/file/data"
import { validateIdCard, checkMobile, getImg } from "../../utils/util.js";
// import { mapGetters } from "vuex"
const formJson = {
	id: "",
	sex: "",
	name: "",
	id_card: "",
	tel: '',
	job_type: '',
	link_man: '',
	link_tel: '',
	address: ''
};
export default {
	components: {
		WorkerDetail: WorkerDetail,
		selectCity: selectCity
	},
	data () {
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
			dialogVisible: false,
			workerId: '',
			roles: [],
			query: {
				keyword: '',
				page: 1,
				limit: 20,
				date: ''
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
					{ required: true, message: "请输入姓名", trigger: "blur" }
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
			readonly: false
		};
	},
	computed: {
		is_wmadmin () {
			return this.$store.state.admin.is_wmadmin
		}
	},
	created () {
		// 将参数拷贝进查询对象
		let query = this.$route.query;
		this.query = Object.assign(this.query, query);
		this.query.limit = parseInt(this.query.limit);
		// 加载表格数据
		console.log(this.$store)
		console.log(this.is_wmadmin)
		this.getList();
		this.getType(3).then(res => {
			this.options = res
		})
	},
	methods: {
		viewQrcode(){
			getqrcode().then(res => {
			  if (res) {
					console.log(res)
					let url = getImg(res)
					console.log(url)
					this.$alert(`<img src=${url} />`, '二维码', {
						dangerouslyUseHTMLString: true
					});
				}
			})
		},
		districtChange (val) {
			this.formData.provinceid = val[0]
			this.formData.cityid = val[1]
			this.formData.areaid = val[2]
		},
		changeInput (e) {
			getworkmanbytel({ tel: e }).then(res => {
				if (res) {
					this.formData = res
					this.readonly = true
				} else {
					this.readonly = false
				}
			})
		},
		onReset () {
			this.query = {
				keyword: '',
				page: 1,
				limit: 20,
				date: ''
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
			getWorkmanList(this.query)
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
		resetForm () {
			if (this.$refs["dataForm"]) {
				// 清空验证信息表单
				this.$refs["dataForm"].clearValidate();
				// 刷新表单
				this.$refs["dataForm"].resetFields();
			}
		},
		// 隐藏表单
		hideForm () {
			// 更改值
			this.formVisible = !this.formVisible;
			// 清空表单
			this.$refs["dataForm"].resetFields();
			return true;
		},
		// 显示表单
		handleForm (index, row) {
			this.formVisible = true;
			this.formData = JSON.parse(JSON.stringify(formJson));
			if (row !== null) {
				this.formData = Object.assign({}, row);
				if (row.provinceid) {
					console.log(row)
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
		getDetail (id) {
			getWorkmanDetail({ id }).then(res => {
				if (res.provinceid) {
					this.address = [res.provinceid, res.cityid, res.areaid]
				}
				this.formData = res
			})
		},
		viewDetail (index, row) {
			this.workerId = row.id
			this.formDetailVisible = true
		},
		switchCheck (item) {
			this.checkObj = item
			this.dialogVisible = true
		},
		handleClose () {
			this.dialogVisible = false
		},
		handleCheck () {
			let params = {
				id: this.checkObj.id,
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
		},
		addUser (data) {
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
		formSubmit () {
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
		handleDel (index, row) {
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
