<template>
	<div class="worker-view">
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
					placeholder="请输入联系方式"
					v-model="formData.tel"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="工人名称" prop="name">
				<el-input
					v-model="formData.name"
					placeholder="请输入工人名称"
					class="width220"
					auto-complete="off"
				></el-input>
			</el-form-item>
				<el-select v-model="formData.job_type"class="width240" placeholder="请选择">
						<el-option
							v-for="(item, index) in options"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
			<el-form-item label="身份证" prop="id_card">
				<el-input v-model="formData.id_card" placeholder="请输入身份证" class="width220" auto-complete="off"></el-input>
			</el-form-item>
		
			<el-form-item label="紧急联系人" prop="link_man">
				<el-input
					class="width220"
					placeholder="请输入紧急联系人"
					v-model="formData.link_man"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="地址" required>
				<div class="width240 select-input">
						<selectCity @change="districtChange" :address="[]"></selectCity>
					</div>
			</el-form-item>
			<el-form-item label="来源地" >
				<el-input
					class="width220"
					placeholder="请输入来源地"
					v-model="formData.address"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-button type="primary" class="submit-btn" @click.native="formSubmit()">提交</el-button>
		</el-form>
	</div>
</template>
<script>
import {
	addWorkman,
} from "../api/workman/index";
import { geTypeAll } from "../api/file/data"
import selectCity from "../components/selectCity.vue";
import { validateIdCard, checkMobile } from "../utils/util.js";
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
				address: ''
			},
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
			options: []
		}
	},
	created() {
		this.getType(3).then(res => {
			this.options = res
		})
	},
	methods: {
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
		formSubmit() {
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					addWorkman(this.formData).then(response => {
						if (response) {
							this.$message.success("操作成功");
						} else {
							this.$message.error("操作失败");
						}
						this.resetForm();
					});
				}
			});
		},
	}
}
</script>
<style lang="scss">
.worker-view {
  margin: 40px auto;
  width: 100%;
  .width220 {
    width: 220px !important;
  }
  .submit-btn {
    margin: 20px 25%;
    width: 50%;
  }
}
</style>

