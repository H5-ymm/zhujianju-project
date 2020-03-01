<template>
	<el-dialog
		title="企业详情"
		:visible.sync="formVisible"
		:before-close="hideForm"
		width="40%"
		top="5vh"
		class="form-detail-dialog detail-view"
	>
		<el-form
			:model="formData"
			:inline="true"
			label-width="160px"
			label-position="right"
			class="form"
			ref="dataForm"
			v-if="formData"
		>
			<el-form-item label="公司名称">
				<el-input v-model="formData.com_name" class="width240" readonly></el-input>
			</el-form-item>
			<el-form-item label="公司类型">
				<el-input class="width240" v-model="formData.com_type_name" readonly></el-input>
			</el-form-item>
			<el-form-item label="营业执照号" >
				<el-input v-model="formData.permit_id"  class="width240" readonly></el-input>
			</el-form-item>
			<el-form-item label="法人名称" >
				<el-input class="width240" v-model="formData.corporation_name" readonly></el-input>
			</el-form-item>
			<el-form-item label="法人联系方式" >
				<el-input class="width240" v-model="formData.corporation_tel" readonly></el-input>
			</el-form-item>
			<el-form-item label="法人身份证" >
				<el-input
					class="width240"
					v-model="formData.corporation_idcard"
					readonly
				></el-input>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>
<script>
import {
	getDetail
} from "../../api/company/index";
export default {
	props: ['companyId', 'formVisible'],
	data() {
		return {
			formData: {}
		}
	},
	watch: {
		companyId(val) {
			if (val) {
				this.getCompanyDetail(val)
			}
		}
	},
	methods: {
		getCompanyDetail(id) {
			getDetail({ id }).then(res => {
				console.log(res)
				this.formData = res
			})
		},
		hideForm() {
			this.$emit('hideForm')
		}
	}
}
</script>
<style lang="scss">
.form-detail-dialog {
  .form {
  }
}
</style>


