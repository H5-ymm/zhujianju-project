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
				<div class="x-flex-start x-flex-wap">
					<img
						v-if="formData.wg_img.length"
						v-for="item in formData.wg_img"
						class="el-upload--picture-card"
						:src="item"
						:key="item"
						alt=""
					>
				</div>
			</el-form-item>
			<br>
			<el-form-item label="整改照片">
				<div class="x-flex-start x-flex-wap">
					<img
						v-if="formData.zg_img.length"
						v-for="item in formData.zg_img"
						class="el-upload--picture-card"
						:src="item"
						:key="item"
						alt=""
					>
				</div>
			</el-form-item>
			<el-form-item label="整改意见">
				<el-input class="width300" readonly type="textarea" :rows="3" v-model="formData.suggestion"></el-input>
			</el-form-item>
			<el-form-item label="处理状态">
				<el-radio-group class="width300" v-model="formData.status">
					<el-radio :label="1" disabled>待整改</el-radio>
					<el-radio :label="2" disabled>待审核</el-radio>
					<el-radio :label="3" disabled>已整改</el-radio>
					<el-radio :label="4" disabled>已退回</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="监督组">
				<el-input class="width300" v-model="formData.nickname" readonly></el-input>
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
  .el-upload-card,
  .el-upload {
    width: 100%;
  }
  .x-flex-start {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .x-flex-wrap {
    flex-wrap: wrap;
  }
  .el-upload--picture-card {
    width: 90px;
    height: 90px;
    line-height: 88px;
  }
}
</style>


