<template>
	<div class="worker-view">
		<p class="projectName" v-if="projectName">项目名称：{{projectName}}</p>
		<el-form
			:model="formData"
			:inline="true"
			label-width="120px"
			label-position="right"
			class="form"
			:rules="formRules"
			ref="dataForm"
		>
			<el-form-item label="联系方式" prop="tel">
				<el-input
					class="width220"
					@change="changeInput"
					:readonly="readonly"
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
					placeholder="请输入紧急联系人"
					v-model="formData.link_man"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="地址">
				<div class="width220 select-input">
					<selectCity @change="districtChange" v-if="!readonly"></selectCity>
					<p class="el-input__inner" v-else>
						{{formData.province}}{{formData.city}}
						{{formData.area}}
					</p>
				</div>
			</el-form-item>
			<el-form-item label="来源地">
				<el-input
					class="width220"
					:readonly="readonly"
					placeholder="请输入来源地"
					v-model="formData.address"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="当天体温" v-if="addSuccess">
				<el-input class="width220" readonly v-model="temperature" auto-complete="off"></el-input>
			</el-form-item>
			<div class="btn-box">
				<el-button
					type="primary"
					v-if="!bindProject&&!addSuccess"
					class="submit-btn"
					@click.native="formSubmit()"
				>{{!readonly?'注册':'加入项目'}}</el-button>
				<el-button type="primary" v-if="bindProject||id" class="submit-btn" @click.native="addTemp">添加体温</el-button>
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
	todaytemperature,
	addWork,
	binditem,
	getitemname
} from "../api/workman/index";
import {
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
				openid: ''
			},
			dialogVisible: false,
			temperature: '',
			formRules: {
				tel: [
					{ required: true, message: "请输入联系人电话", trigger: "blur" },
					{ validator: validatereg, trigger: 'blur' }
				],
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
			projectName: ''
		}
	},
	created() {
		let state = getQueryString('state')
		if (state) {
			this.item_id = state.split('#')[0]
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
		changeInput(e) {
			let params = {
				tel: e,
				item_id: this.item_id
			}
			getWxworkmanbytel(params).then(res => {
				if (res && res.id) {
					this.id = res.id || ''
					if (res.is_link == '1') {
						this.bindProject = true
					} else {
						this.bindProject = false
					}
					this.formData = res
					this.readonly = true
					this.$refs["dataForm"].clearValidate();
				} else {
					this.bindProject = false
					this.readonly = false
					this.$message.warning('请先注册')
				}
			})
		},
		addTemp() {
			this.dialogVisible = true
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
				// 清空验证信息表单
				this.$refs["dataForm"].clearValidate();
				// 刷新表单
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
					this.dialogVisible = true
					this.$message.success("加入项目成功");
					// this.getTodaytemperature(this.formData.id, '')
				} else {
					this.$message.error("加入项目失败");
				}
			});
		},
		addWorkBind(params) {
			addWork(params).then(response => {
				if (response) {
					this.$message.success("注册成功");
					this.bindProject = true
				} else {
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
  margin: 20px auto 10px;
  padding-bottom: 30px;
  width: 100%;
  overflow: auto;
  height: 100%;
  .projectName {
    color: #333;
    font-weight: bold;
    margin-bottom: 10px;
    margin-left: 20px;
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
}
</style>

