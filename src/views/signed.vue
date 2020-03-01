<template>
	<div class="signed-view">
		<P class="title">欢迎， 杨萌萌</P>
		<el-form :model="formData" label-width="120px" class="form" :rules="formRules" ref="dataForm">
			<el-form-item label="体温" prop="username">
				<el-input
					v-model="formData.username"
					placeholder="请输入体温"
					class="width220 input-tiwen"
					auto-complete="off"
				></el-input>
			</el-form-item>
			<el-button type="primary" class="submit-btn" @click.native="formSubmit()">签到</el-button>
		</el-form>
	</div>
</template>
<script>
export default {
	data() {
		return {
			formData: {},
			formRules: {},
			options: []
		}
	}
}
</script>
<style lang="scss">
.signed-view {
  .title {
    margin: 30px;
    color: #666;
    font-size: 28px;
  }
  .form {
    margin: 30% auto;
    width: 100%;
    .el-form-item__label {
      font-size: 26px;
      line-height: 50px;
    }
    .input-tiwen {
      .el-input__inner {
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        :focus {
          padding: 2px 0;
        }
      }
    }
    .width220 {
      width: 220px !important;
    }
    .submit-btn {
      margin: 30px 35%;
      padding: 14px;
      width: 30%;
      font-size: 18px;
    }
  }
}
</style>

