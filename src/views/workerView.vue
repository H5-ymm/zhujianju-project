<template>
	<div class="worker-view">
		<p class="projectName">项目名称：{{projectName}}</p>
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
					placeholder="请输入联系方式"
					v-model="formData.tel"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="工人名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入工人名称" class="width220" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="工种" prop="job_type">
				<el-select v-model="formData.job_type" :disabled="readonly" class="width220" placeholder="请选择">
					<el-option v-for="(item, index) in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="身份证" prop="id_card">
				<el-input v-model="formData.id_card" placeholder="请输入身份证" class="width220" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="性别" placeholder="请选择性别">
				<el-radio-group class="width220" v-model="formData.sex">
					<el-radio :label="1" :disabled="readonly">男</el-radio>
					<el-radio :label="2" :disabled="readonly">女</el-radio>
				</el-radio-group>
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
				<div class="width220 select-input" v-if="!readonly">
					<selectCity @change="districtChange"></selectCity>
				</div>
				<div class="width220 select-input" v-else>
					<p class="input-text">{{formData.province}}{{formData.city}}{{formData.area}}</p>
				</div>
			</el-form-item>
			<el-form-item label="来源地">
				<el-input class="width220" placeholder="请输入来源地" v-model="formData.address" auto-complete="off"></el-input>
			</el-form-item>
			<div v-if="!addSuccess">
				<el-button type="primary" v-if="!bindProject" class="submit-btn" @click.native="formSubmit()">提交</el-button>
				<el-button type="primary" v-else class="submit-btn" @click.native="addTemp">添加体温</el-button>
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
				@change="changTemperature"
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
				team_id: '',
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
					{ required: true, message: "请输入姓名", trigger: "blur" }
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
				if (res) {
					this.id = res.id
					if (res.is_link) {
						this.bindProject = true
					} else {
						this.bindProject = false
					}
					this.formData = res
					this.readonly = true
				} else {
					this.readonly = false
				}
			})
		},
		getTodaytemperature(id, temperature) {
			todaytemperature({ id }).then(res => {
				if (res) {
					this.dialogVisible = false
					this.temperature = res
				} else {
					this.temperature = temperature || ''
				}
				this.addtempera(this.temperature)
			})
		},
		addTemp() {
			this.dialogVisible = true
			this.getTodaytemperature(this.formData.id)
		},
		handleOk() {
			let params = {
				temperature: this.temperature,
				id: this.formData.id
			}
			this.getTodaytemperature(this.formData.id)
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
		changTemperature(e) {
			this.getTodaytemperature(this.formData.id, e)
		},
		districtChange(val) {
			this.formData.provinceid = val[0]
			this.formData.cityid = val[1]
			this.formData.areaid = val[2]
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
		resetForm() {
			if (this.$refs["dataForm"]) {
				// 清空验证信息表单
				this.$refs["dataForm"].clearValidate();
				// 刷新表单
				this.$refs["dataForm"].resetFields();
			}
		},
		setBindopenid() {
			let params = {
				openid: this.params.openid,
				id: this.id
			}
			bindopenid(params).then(response => {
				if (response) {
					// this.$message.success("绑定成功");
				} else {
					this.$message.error("绑定失败");
				}
			});
		},
		bindWorkProject() {
			let params = {
				item_id: this.item_id,
				id: this.id
			}
			binditem(params).then(response => {
				if (response) {
					this.dialogVisible = true
					this.getTodaytemperature()
					this.$message.success("操作成功");
				} else {
					this.$message.error("操作失败");
				}
			});
		},
		addWorkBind(params) {
			addWork(params).then(response => {
				if (response) {
					console.log(response)
					this.$message.success("操作成功");
				} else {
					this.$message.error("操作失败");
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
  .width220 {
    width: 220px !important;
  }
  .submit-btn {
    margin: 20px 25% 0;
    width: 50%;
  }
}
</style>

