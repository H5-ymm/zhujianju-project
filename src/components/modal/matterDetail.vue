<template>
	<el-dialog
		title="事项详情"
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
			<el-form-item label="事项名称">
				<el-input v-model="formData.title" class="width300" readonly></el-input>
			</el-form-item>
			<el-form-item label="内容描述">
				<el-input class="width300" readonly type="textarea" :rows="3" v-model="formData.description"></el-input>
			</el-form-item>
			<el-form-item label="违规照片">
				<div class="width300">
					<img src="" alt="照片" class="img-icon">
				</div>
			</el-form-item>
			<el-form-item label="整改照片">
				<el-input class="width300" v-model="formData.link_tel" readonly></el-input>
			</el-form-item>
			<el-form-item label="整改意见">
				<el-input class="width300" readonly type="textarea" :rows="3" v-model="formData.suggestion"></el-input>
			</el-form-item>
			<el-form-item label="处理状态" v-if="itemId">
				<el-radio-group class="width300" v-model="formData.status">
					<el-radio :label="1" :disabled="is_wmadmin==1">待整改</el-radio>
					<el-radio :label="2" :disabled="is_wmadmin==1">待审核</el-radio>
					<el-radio :label="3" :disabled="readonly" v-if="!is_wmadmin">已整改</el-radio>
					<el-radio :label="4" :disabled="readonly" v-if="!is_wmadmin">已退回</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="监督组">
				<el-input class="width300" v-model="formData.Supervisiongroup" readonly></el-input>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>
<script>
import {
	getItemmanageDetail
} from "../../api/matter/index";
export default {
	props: ['itemId', 'formVisible', 'is_wmadmin'],
	data() {
		return {
			formData: {}
		}
	},
	watch: {
		itemId(val) {
			if (val) {
				this.getDetail(val)
			}
		}
	},
	methods: {
		getDetail(id) {
			getItemmanageDetail({ id }).then(res => {
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
  .img-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .img-icon {
      width: 80px;
      height: 80px;
      margin-right: 5px;
    }
  }
}
</style>


