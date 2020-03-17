<template>
	<el-row :gutter="10" class="detail-view">
		<el-col>
			<div class="grid-content bg-purple form-dialog">
				<el-form
					:model="formData"
					:inline="true"
					label-width="150px"
					label-position="right"
					class="form"
					ref="dataForm"
				>
					<el-form-item label="工程名称">
						<el-input v-model="formData.name" class="width240" readonly></el-input>
					</el-form-item>
					<el-form-item label="项目类别">
						<el-input v-model="formData.type_name" class="width240" readonly></el-input>
					</el-form-item>
					<el-form-item label="工程地点" required>
						<div class="width240 select-input">
							<el-input v-model="formData.address" readonly></el-input>
						</div>
						<el-input v-model="formData.address" class="width240" readonly></el-input>
					</el-form-item>
					<el-form-item label="结构类型">
						<el-input class="width240" v-model="formData.structure_type_name" readonly></el-input>
					</el-form-item>
					<el-form-item label="建筑规模">
						<el-input class="width240" v-model="formData.scale" readonly></el-input>
					</el-form-item>
					<el-form-item label="建筑层数">
						<el-input class="width240" v-model="formData.layers" readonly></el-input>
					</el-form-item>
					<el-form-item label="工程造价">
						<el-input class="width240" v-model="formData.engineering_cost" readonly></el-input>
					</el-form-item>
					<el-form-item label="计划开工日期">
						<el-input
							class="width240"
							v-model="$moment.unix(formData.starttime).format('YYYY-MM-DD HH:mm')"
							readonly
						></el-input>
					</el-form-item>
					<el-form-item label="计划竣工日期">
						<el-input
							class="width240"
							v-model="$moment.unix(formData.endtime).format('YYYY-MM-DD HH:mm')"
							readonly
						></el-input>
					</el-form-item>
					<el-form-item label="建筑工程规划许可证">
						<el-input class="width240" v-model="formData.license" readonly></el-input>
					</el-form-item>
					<el-form-item label="施工许可证">
						<el-input class="width240" v-model="formData.make_license" readonly></el-input>
					</el-form-item>
					<el-form-item label="图纸审查批准编号">
						<el-input class="width240" v-model="formData.tzscpz" readonly></el-input>
					</el-form-item>
					<el-form-item label="消防审查合格证号">
						<el-input class="width240" v-model="formData.firecontrol_license" readonly></el-input>
					</el-form-item>
					<el-form-item label="监督备案登记号">
						<el-input class="width240" v-model="formData.monitoring_id" readonly></el-input>
					</el-form-item>
					<el-form-item label="建设单位">
						<div class="width240">
							<el-input
								class="width240 select-input"
								v-model="formData.construction_info.com_name"
								readonly
							></el-input>
							<el-input
								class="width240 select-input"
								v-model="formData.construction_info.corporation_name"
								readonly
							></el-input>
							<el-input v-model="formData.construction_user" readonly></el-input>
						</div>
					</el-form-item>
					<el-form-item label="勘查单位">
						<div class="width240">
							<el-input class="width240 select-input" v-model="formData.survey_info.com_name" readonly></el-input>
							<el-input
								class="width240 select-input"
								v-model="formData.survey_info.corporation_name"
								readonly
							></el-input>
							<el-input v-model="formData.survey_user" readonly></el-input>
						</div>
					</el-form-item>
					<el-form-item label="设计单位负责人">
						<div class="width240">
							<el-input class="width240 select-input" v-model="formData.design_info.com_name" readonly></el-input>
							<el-input
								class="width240 select-input"
								v-model="formData.design_info.corporation_name"
								readonly
							></el-input>
							<el-input v-model="formData.design_user" readonly></el-input>
						</div>
					</el-form-item>
					<el-form-item label="施工单位">
						<div class="width240">
							<el-input class="width240 select-input" v-model="formData.shigong_info.com_name" readonly></el-input>
							<el-input
								class="width240 select-input"
								v-model="formData.shigong_info.corporation_name"
								readonly
							></el-input>
							<el-input v-model="formData.shigong_user" readonly></el-input>
						</div>
					</el-form-item>
					<el-form-item prop="supervision_unit" label="监理单位">
						<div class="width240">
							<el-input
								class="width240 select-input"
								v-model="formData.supervision_info.com_name"
								readonly
							></el-input>
							<el-input
								class="width240 select-input"
								v-model="formData.supervision_info.corporation_name"
								readonly
							></el-input>
							<el-input v-model="formData.supervision_user" readonly></el-input>
						</div>
					</el-form-item>
					<el-form-item prop="detection_unit" label="检测单位">
						<div class="width240">
							<el-input class="width240 select-input" v-model="formData.detection_info.com_name" readonly></el-input>
							<el-input
								class="width240 select-input"
								v-model="formData.detection_info.corporation_name"
								readonly
							></el-input>
							<el-input v-model="formData.detection_user" readonly></el-input>
						</div>
					</el-form-item>
					<el-form-item label="监督组">
						<el-input class="width240" v-model="formData.monitoring_group" readonly></el-input>
					</el-form-item>
				</el-form>
			</div>
		</el-col>
	</el-row>
</template>
<script>
import { getDetail } from "../../api/project/index";
export default {
	data() {
		return {
			formData: {
				survey_info: {},
				construction_info: {},
				design_info: {},
				shigong_info: {},
				supervision_info: {},
				detection_info: {}
			},
			id: ''
		}
	},
	computed: {
		address() {
			return this.formData.province + this.formData.city + this.formData.area
		}
	},
	created() {
		this.id = this.$route.query.id
		this.getProject(this.id)
	},
	methods: {
		getProject(id) {
			getDetail({ id }).then(res => {
				this.formData = res
			})
		}
	}
}
</script>
<style lang="scss">
.detail-view {
  .select-input {
    margin-bottom: 5px;
  }
}
</style>

