<template>
	<div class="worker-view">
		<!-- <div class="worker-header">
			<p class="title">泾川县建设工程监管平台</p>
		</div>-->
		<p class="projectName" v-if="projectName">项目名称：{{projectName}}</p>
		<el-form
			:model="formData"
			class="tel-form form"
			:inline="true"
			label-width="120px"
			v-if="step==1"
			label-position="right"
			:rules="rules"
			ref="telForm"
		>
			<el-form-item label="手机号" prop="tel">
				<el-input class="width220" placeholder="请输入手机号" v-model="formData.tel" auto-complete="off"></el-input>
			</el-form-item>
			<div class="btn-box">
				<el-button type="primary" class="submit-btn" @click.native="submitTel">确定</el-button>
			</div>
		</el-form>
		<el-form
			:model="formData"
			:inline="true"
			label-width="120px"
			v-else
			label-position="right"
			class="form"
			:rules="formRules"
			ref="dataForm"
		>
			<el-form-item label="手机号">
				<el-input
					class="width220"
					readonly
					placeholder="请输入手机号"
					v-model="formData.tel"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="工人姓名" prop="name">
				<el-input
					v-model="formData.name"
					:readonly="readonly"
					placeholder="请输入工人姓名"
					class="width220"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="工种" prop="job_type">
				<el-select
					v-model="formData.job_type"
					v-if="!readonly"
					:disabled="readonly"
					class="width220"
					placeholder="请选择"
				>
					<el-option v-for="(item, index) in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
				<p class="el-input__inner width220" v-else>{{formData.type_name}}</p>
			</el-form-item>
			<el-form-item label="身份证" prop="id_card">
				<el-input
					v-model="formData.id_card"
					:readonly="readonly"
					placeholder="请输入身份证"
					class="width220"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="性别" placeholder="请选择性别">
				<el-radio-group class="width220" v-if="!readonly" v-model="formData.sex">
					<el-radio :label="1" :disabled="readonly">男</el-radio>
					<el-radio :label="2" :disabled="readonly">女</el-radio>
				</el-radio-group>
				<p class="el-input__inner width220" v-else>{{formData.sex==1?'男':formData.sex==2?'女':'未设置'}}</p>
			</el-form-item>
			<el-form-item label="紧急联系人" prop="link_man">
				<el-input
					class="width220"
					:readonly="readonly"
					placeholder="请输入紧急联系人"
					v-model="formData.link_man"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="来源地">
				<div class="width220 select-input">
					<selectCity @change="districtChange" v-if="!readonly"></selectCity>
					<p class="el-input__inner" v-else>
						{{formData.province}}{{formData.city}}
						{{formData.area}}
					</p>
				</div>
			</el-form-item>
			<el-form-item label="住址">
				<el-input
					class="width220"
					:readonly="readonly"
					placeholder="请输入住址"
					v-model="formData.address"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="党员">
				<el-radio-group class="width220" v-model="formData.partymember">
					<el-radio :label="1" :disabled="readonly">是</el-radio>
					<el-radio :label="2" :disabled="readonly">否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="贫困户">
				<el-radio-group class="width220" v-model="formData.destitutemember">
					<el-radio :label="1" :disabled="readonly">是</el-radio>
					<el-radio :label="2" :disabled="readonly">否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="政府补助金额" v-if="formData.destitutemember==1">
				<el-input
					class="width220"
					:readonly="readonly"
					placeholder="请输入补助金额"
					v-model="formData.amount_of_grant"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="当天体温" v-if="addSuccess">
				<el-input class="width220" readonly v-model="temperature" auto-complete="off"></el-input>
			</el-form-item>
			<div class="btn-box" v-if="!bindProject&&!addSuccess">
				<el-button
					type="primary"
					class="submit-btn"
					@click.native="formSubmit()"
				>{{!readonly?'注册':'加入项目'}}</el-button>
			</div>
			<div class="btn-box" v-if="bindProject&&id">
				<el-button
					type="primary"
					class="submit-btn"
					:disabled="isSign"
					@click.native="setSign"
				>{{!isSign?'签到':'已签到'}}</el-button>
				<el-button type="primary" class="submit-btn" @click.native="addTemp">添加体温</el-button>
			</div>
		</el-form>
		<el-dialog
			title="提示"
			:visible.sync="dialogVisible"
			width="28%"
			center
			:before-close="handleClose"
		>
			<el-input
				v-model="temperature"
				placeholder="请输入体温"
				class="width220 input-tiwen"
				auto-complete="off"
			></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleOk">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import {
	bindWorkman,
	addtemperature,
	addWork,
	binditem,
	getitemname
} from "../api/workman/index";
import {
	addAttendance,
	getWxworkmanbytel
} from "../api/wx/wxApi";
import { geTypeAll } from "../api/file/data"
import selectCity from "../components/selectCity.vue";
import { validateIdCard, checkMobile, getQueryString } from "../utils/util.js";
export default {
	components: {
		selectCity: selectCity
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
			formData: {
				sex: "",
				name: "",
				id_card: "",
				tel: '',
				job_type: '',
				link_man: '',
				link_tel: '',
				address: '',
				provinceid: '',
				cityid: '',
				areaid: '',
				item_id: '',
				openid: '',
				partymember: '',
				destitutemember: '',
				amount_of_grant: ''
			},
			dialogVisible: false,
			temperature: '',
			rules: {
				tel: [
					{ required: true, message: "请输入手机号", trigger: "blur" },
					{ validator: validatereg, trigger: 'blur' }
				]
			},
			formRules: {
				name: [
					{ required: true, message: "请输入工人姓名", trigger: "blur" }
				],
				job_type: [
					{ required: true, message: "请选择工种类型", trigger: "change" }
				],
				id_card: [
					{ required: true, message: "请输入联系人身份证", trigger: "blur" },
					{ validator: validate, trigger: 'blur' }
				],
			},
			options: [],
			readonly: false,
			item_id: '',
			id: '',
			openid: '',
			bindProject: false,
			addSuccess: false,
			projectName: '',
			step: 1,
			isSign: false
		}
	},
	created() {
		let state = getQueryString('state')
		if (state) {
			this.item_id = state.split('#')[0]
		}
		if (!this.item_id) {
			return this.$message.warning('无效的二维码')
		}
		this.openid = sessionStorage.getItem('zhujianjuOpenid')
		this.formData.openid = sessionStorage.getItem('zhujianjuOpenid')
		this.getName()
		this.getType(3).then(res => {
			this.options = res
		})
	},
	methods: {
		getName() {
			getitemname({ item_id: this.item_id }).then(res => {
				this.projectName = res
			})
		},
		handleClose() {
			this.dialogVisible = false
		},
		submitTel() {
			this.$refs["telForm"].validate(valid => {
				if (valid) {
					let params = {
						tel: this.formData.tel,
						item_id: this.item_id
					}
					this.byTelGetInfo(params)
				}
			})
		},
		resetFormTel() {
			if (this.$refs["telForm"]) {
				this.$refs["telForm"].clearValidate();
				this.$refs["telForm"].resetFields();
			}
		},
		byTelGetInfo(params) {
			getWxworkmanbytel(params).then(res => {
				if (res && res.id) {
					this.id = res.id || ''
					if (res.is_link == '1') {
						this.bindProject = true
						if (res.is_attendance) {
							this.isSign = true
						} else {
							this.isSign = false
						}
					} else {
						this.isSign = false
						this.bindProject = false
					}
					this.formData = res
					this.readonly = true
					this.$refs["telForm"].clearValidate();
				} else {
					this.isSign = false
					this.bindProject = false
					this.readonly = false
					this.$message.warning('请先注册')
				}
				this.step = 2
			})
		},
		addTemp() {
			this.dialogVisible = true
		},
		setSign() {
			let params = {
				workman_id: this.id || this.formData.id,
				item_id: this.item_id
			}
			addAttendance(params).then(res => {
				if (res) {
					this.$message.success('签到成功')
					this.isSign = true
				} else {
					this.$message.warning('签到失败')
					this.isSign = false
				}
			})
		},
		handleOk(temperature) {
			if (!this.temperature) {
				return this.$message.warning('请输入体温')
			}
			let params = {
				temperature: this.temperature,
				id: this.formData.id
			}
			addtemperature(params).then(res => {
				if (res) {
					this.addSuccess = true
					this.$message.success("添加成功");
					this.dialogVisible = false
				} else {
					this.addSuccess = false
					this.$message.error("添加失败");
				}
			})
		},
		districtChange(val) {
			this.formData.provinceid = val[0]
			this.formData.cityid = val[1]
			this.formData.areaid = val[2]
		},
		getType(pid) {
			let params = {
				pid,
				keyword: ''
			}
			return new Promise((resolve) => {
				geTypeAll(params).then(res => {
					resolve(res)
				})
			})
		},
		resetForm() {
			if (this.$refs["dataForm"]) {
				this.$refs["dataForm"].clearValidate();
				this.$refs["dataForm"].resetFields();
			}
		},
		bindWorkProject() {
			let params = {
				item_id: this.item_id,
				id: this.id
			}
			binditem(params).then(response => {
				if (response) {
					this.bindProject = true
					this.$message.success("加入项目成功");
				} else {
					this.bindProject = false
					this.$message.error("加入项目失败");
				}
			});
		},
		addWorkBind(params) {
			addWork(params).then(response => {
				if (response) {
					this.id = response
					this.$message.success("注册成功");
					this.bindProject = true
					this.readonly = true
				} else {
					this.id = ''
					this.readonly = false
					this.bindProject = false
					this.$message.error("注册失败");
				}
				this.resetForm();
			})
		},
		formSubmit() {
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					if (this.readonly && !this.bindProject) {
						this.bindWorkProject()
					} else {
						this.formData.item_id = this.item_id
						this.formData.openid = this.openid || sessionStorage.getItem('zhujianjuOpenid')
						this.addWorkBind(this.formData)
					}
				}
			})
		},
	}
}
</script>
<style lang="scss">
.worker-view {
  margin: 0 auto 10px;
  padding-bottom: 30px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  .worker-header {
    height: 110px;
    width: 100%;
    background: url("../assets/image/bg.jpg") no-repeat center bottom;
    background-size: 100%;
    position: relative;
    .title {
      color: #fff;
      font-size: 20px;
      padding: 20px;
    }
  }
  .projectName {
    color: #333;
    font-weight: bold;
    font-size: 20px;
    margin-left: 20px;
    margin-bottom: 10px;
  }
  .btn-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 20px;
    .submit-btn {
      flex: auto;
      margin: 0 20px;
    }
  }
  .tel-form {
    margin: 45% auto;
    width: 100%;
    .btn-box {
      width: 50%;
      margin: 20% auto;
    }
  }
  .input-text {
    color: #606266;
    border: 1px solid #dcdfe6;
  }
  .width220 {
    width: 220px !important;
  }
  .el-input__inner,
  .el-textarea__inner {
    -webkit-user-select: text;
    padding: 0 15px;

    &:focus {
      padding: 2px 15px;
    }
  }
}
</style>

