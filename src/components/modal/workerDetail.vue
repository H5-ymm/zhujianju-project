<template>
	<el-dialog
		title="工人详情"
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
			<el-form-item label="工人名称">
				<el-input v-model="formData.name" class="width240" readonly></el-input>
			</el-form-item>
			<el-form-item label="工种">
				<el-input v-model="formData.job_type_name" class="width240" readonly></el-input>
			</el-form-item>
			<el-form-item label="身份证">
				<el-input v-model="formData.id_card" class="width240" readonly></el-input>
			</el-form-item>
			<el-form-item label="联系方式">
				<el-input class="width240" v-model="formData.link_tel" readonly></el-input>
			</el-form-item>
			<el-form-item label="紧急联系人">
				<el-input
					class="width240"
					v-model="formData.link_man"
				readonly
				></el-input>
			</el-form-item>
			<el-form-item label="联系方式">
					<el-radio-group class="width240" v-model="formData.sex">
						<el-radio :label="1" disabled>男</el-radio>
						<el-radio :label="2" disabled>女</el-radio>
					</el-radio-group>
			</el-form-item>
			<el-form-item label="地址">
				<el-input
					class="width240"
					v-model="formData.address"
			  	readonly
				></el-input>
			</el-form-item>
			<el-form-item label="来源地">
				<el-input
					class="width240"
					placeholder="请输入来源地"
					v-model="formData.address"
				readonly
				></el-input>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>
<script>
import {
	getWorkmanDetail
} from "../../api/workman/index";
export default {
	props: ['workerId', 'formVisible'],
	data() {
		return {
			formData: {}
		}
	},
	watch: {
		workerId(val) {
			if (val) {
				this.getDetail(val)
			}
		}
	},
	methods: {
		getDetail(id) {
			getWorkmanDetail({ id }).then(res => {
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


