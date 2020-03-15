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
			<el-form-item label="工人姓名">
				<el-input v-model="formData.name" class="width240" readonly></el-input>
			</el-form-item>
			<el-form-item label="工种">
				<el-input v-model="formData.job_type_name" class="width240" readonly></el-input>
			</el-form-item>
			<el-form-item label="身份证">
				<el-input v-model="formData.id_card" class="width240" readonly></el-input>
			</el-form-item>
			<el-form-item label="手机号">
				<el-input class="width240" v-model="formData.link_tel" readonly></el-input>
			</el-form-item>
			<el-form-item label="紧急联系人">
				<el-input class="width240" v-model="formData.link_man" readonly></el-input>
			</el-form-item>
			<el-form-item label="性别">
				<el-radio-group class="width240" v-model="formData.sex">
					<el-radio :label="1" disabled>男</el-radio>
					<el-radio :label="2" disabled>女</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="来源地">
				<el-input class="width240" v-model="address" readonly></el-input>
			</el-form-item>
			<el-form-item label="地址">
				<el-input class="width240" v-model="formData.address" readonly></el-input>
			</el-form-item>
			<el-form-item label="党员">
				<el-input class="width240" v-model="partymember" readonly></el-input>
			</el-form-item>
			<el-form-item label="贫困户">
				<el-input class="width240" v-model="destitutemember" readonly></el-input>
			</el-form-item>
			<el-form-item label="政府补贴金额" v-if="formData.destitutemember==1">
				<el-input class="width240" v-model="formData.amount_of_grant" readonly></el-input>
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
	computed: {
		address() {
			return this.formData.province + this.formData.city + this.formData.area
		},
		partymember() {
			return this.formData.partymember == 1 ? '是' : '否'
		},
		destitutemember() {
			return this.formData.destitutemember == 1 ? '是' : '否'
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


