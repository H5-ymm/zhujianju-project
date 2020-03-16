<template>
	<el-dialog
		title="起重设备详情"
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
			<el-form-item label="起重设备编号">
				<el-input v-model="formData.number" class="width240" readonly></el-input>
			</el-form-item>
			<el-form-item label="设备类型">
				<el-input v-model="formData.job_type_name" class="width240" readonly></el-input>
			</el-form-item>
			<el-form-item label="报备日期">
				<el-input
					v-model="$moment.unix(formData.report_date).format('YYYY-MM-DD')"
					class="width240"
					readonly
				></el-input>
			</el-form-item>
			<el-form-item label="到检日期">
				<el-input
					v-model="$moment.unix(formData.check_date).format('YYYY-MM-DD')"
					class="width240"
					readonly
				></el-input>
			</el-form-item>
			<el-form-item label="司机">
				<el-input class="width240" v-model="formData.driver" readonly></el-input>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>
<script>
import {
	getEquipmentDetail
} from "../../api/equipment/index";
export default {
	props: ['equipmentId', 'formVisible'],
	data() {
		return {
			formData: {}
		}
	},
	watch: {
		equipmentId(val) {
			if (val) {
				this.getDetail(val)
			}
		}
	},
	methods: {
		getDetail(id) {
			getEquipmentDetail({ id }).then(res => {
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


