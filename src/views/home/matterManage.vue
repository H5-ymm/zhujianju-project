<template>
	<div>
		<el-form :inline="true" :model="query" class="query-form">
			<el-form-item class="query-form-item">
				<el-input v-model="query.keyword" class="width200" placeholder="请输入事项名称"></el-input>
			</el-form-item>
			<el-form-item class="query-form-item">
				<el-select v-model="query.status" placeholder="处理状态">
					<el-option label="全部" value=""></el-option>
					<el-option label="整改" value="1"></el-option>
					<el-option label="待审核" value="2"></el-option>
					<el-option label="已整改" value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
					<el-button
						type="primary"
						icon="el-icon-plus"
						v-if="!is_wmadmin||is_wmadmin==2"
						@click.native="handleForm(null, null)"
					>新增</el-button>
				</el-button-group>
			</el-form-item>
		</el-form>
		<vue-easy-print :tableShow="false" ref="easyPrint" :onePageRow="10">
			<template>
				<workerTable :list="list" :is_wmadmin="is_wmadmin"></workerTable>
			</template>
		</vue-easy-print>
		<el-table
			class="common-table"
			id="printTest"
			v-loading="loading"
			:data="list"
			style="width: 100%;"
			max-height="1000px"
		>
			<el-table-column label="事项名称" align="center" prop="title" width="110px"></el-table-column>
			<el-table-column label="项目名称" align="center" prop="name" width="110px"></el-table-column>
			<el-table-column label="内容描述" prop="description" width="110px" align="center"></el-table-column>
			<el-table-column label="违规照片" min-width="110px" align="center">
				<template slot-scope="scope">
					<div>
						<img :src="scope.row.wg_img" v-if="scope.row.wg_img" class="qrcode" alt="">
					</div>
				</template>
			</el-table-column>
			<el-table-column label="违规日期" width="170px" align="center">
				<template slot-scope="scope">
					<span>
						{{scope.row.addtime?
						$moment.unix(scope.row.addtime).format('YYYY-MM-DD'):''}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="整改意见" width="110px" prop="suggestion" align="center"></el-table-column>
			<el-table-column label="整改照片" width="110px" align="center">
				<template slot-scope="scope">
					<div>
						<img :src="scope.row.zg_img" v-if="scope.row.zg_img" class="qrcode" alt="">
					</div>
				</template>
			</el-table-column>
			<el-table-column label="整改日期" width="170px" align="center">
				<template slot-scope="scope">
					<span>
						{{scope.row.uptime?
						$moment.unix(scope.row.uptime).format('YYYY-MM-DD'):''}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="监督组" width="110px" prop="Supervisiongroup" align="center"></el-table-column>
			<el-table-column label="处理状态" width="110px" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.status==1?'待整改':scope.row.status==2?'待审核':'已整改'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" class="no-print" align="center" min-width="120px" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click.native="viewDetail(scope.$index, scope.row)">查看</el-button>
					<!-- <el-button type="text" size="small" @click.native="handleDel(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:page-size="query.limit"
			@current-change="handleCurrentChange"
			layout="prev, pager, next,total"
			:total="total"
		></el-pagination>
		<!--表单-->
		<el-dialog
			:title="formMap[formName]"
			:visible.sync="formVisible"
			:before-close="hideForm"
			width="50%"
			top="5vh"
			class="form-dialog"
		>
			<el-form
				:model="formData"
				:inline="true"
				label-width="160px"
				label-position="right"
				class="form"
				:rules="addRules"
				ref="dataForm"
			>
				<el-form-item label="事项名称" prop="title">
					<el-input
						class="width300"
						:readonly="formData.status==3||is_wmadmin==1"
						placeholder="请输入事项名称"
						v-model="formData.title"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="项目名称" prop="item_id">
					<el-select
						v-model="formData.item_id"
						:disabled="formData.status==3||is_wmadmin==1"
						filterable
						class="width300"
						placeholder="请选择项目名称"
					>
						<el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="内容描述" prop="description">
					<el-input
						class="width300"
						:readonly="formData.status==3||is_wmadmin==1"
						type="textarea"
						:rows="3"
						placeholder="请输入内容描述"
						v-model="formData.description"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<br>
				<el-form-item label="违规照片" required>
					<p class="prompt" v-if="!is_wmadmin||is_wmadmin==2">最多上传5张</p>
					<el-upload
						:limit="5"
						action="customize"
						ref="upload"
						list-type="picture-card"
						:multiple="true"
						:file-list="arr"
						:disabled="formData.status==3"
						accept="bmg, .png, .jpg, .jpeg"
						:before-upload="beforeUpload"
						:http-request="upload"
						v-if="!is_wmadmin||is_wmadmin==2"
						@on-exceed="onExceed"
					>
						<div class="x-flex-start x-flex-wap el-upload-card">
							<div class="x-flex-start x-flex-wap">
								<img
									v-if="fileList.length"
									v-for="item in fileList"
									class="el-upload-list__item el-upload--picture-card"
									:src="item"
									:key="item"
									alt=""
								>
								<div class="el-upload--picture-card el-upload-list__item-thumbnail">
									<i class="el-icon-plus"></i>
								</div>
							</div>
						</div>
					</el-upload>
					<div class="x-flex-start x-flex-wap el-upload-card" v-else>
						<img
							v-if="fileList.length"
							v-for="(item,index) in fileList"
							class="el-upload--picture-card"
							:src="item"
							:key="index"
							alt=""
						>
						<p class="prompt" v-if="fileList && fileList.length==0">无</p>
					</div>
				</el-form-item>
				<br>
				<el-form-item
					label="整改照片"
					required
					v-if="itemId&&(!is_wmadmin||is_wmadmin==2) && uploadData.length"
				>
					<p class="prompt">最多上传5张</p>
					<el-upload
						:limit="5"
						action="customize"
						ref="upload"
						list-type="picture-card"
						:multiple="true"
						:file-list="arr1"
						:disabled="formData.status==3"
						accept="bmg, .png, .jpg, .jpeg"
						:before-upload="beforeUpload1"
						:http-request="upload1"
						@on-exceed="onExceed1"
					>
						<div class="x-flex-start x-flex-wap el-upload-card">
							<div class="x-flex-start x-flex-wap">
								<img
									v-if="uploadData.length"
									v-for="(item,index) in uploadData"
									class="el-upload-list__item el-upload--picture-card"
									:src="item"
									:key="index"
									alt=""
								>
								<div class="el-upload--picture-card el-upload-list__item-thumbnail">
									<i class="el-icon-plus"></i>
								</div>
							</div>
						</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="整改意见" v-if="itemId" prop="suggestion">
					<el-input
						class="width300"
						type="textarea"
						:rows="3"
						:readonly="is_wmadmin==1||formData.status==3"
						placeholder="请输入整改意见"
						v-model="formData.suggestion"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="处理状态" v-if="itemId&&(!is_wmadmin||is_wmadmin==2)">
					<el-radio-group class="width300" v-model="formData.status">
						<el-radio :label="1" :disabled="formData.status==3">待整改</el-radio>
						<el-radio :label="2" disabled>待审核</el-radio>
						<el-radio :label="3" :disabled="formData.status!=2">已整改</el-radio>
						<el-radio :label="4" :disabled="formData.status<2">已退回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="监督组" v-if="is_wmadmin!=2" required>
					<el-select
						v-model="Supervisiongroup"
						class="width300"
						filterable
						:disabled="formData.status==3||is_wmadmin==1"
						allow-create
						@change="changeSupervisiongroup"
						default-first-option
						placeholder="请新增输入/选择监督组"
					>
						<el-option v-for="item in options1" :key="item.id" :label="item.nickname" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="账号" required v-if="formData.nickname&&!isAdd&&!itemId">
					<el-input
						class="width300"
						:readonly="formData.status==3||is_wmadmin==1"
						placeholder="请输入账号"
						v-model="formData.username"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="密码" required v-if="formData.nickname&&!isAdd&&!itemId">
					<el-input
						class="width300"
						:readonly="formData.status==3||is_wmadmin==1"
						placeholder="请输入密码"
						v-model="formData.password"
						auto-complete="off"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="hideForm">取消</el-button>
				<el-button
					type="primary"
					@click.native="formSubmit()"
					:loading="formLoading"
					v-if="formData.status!=3"
				>提交</el-button>
			</div>
		</el-dialog>
		<matterDetail
			:itemId="itemId"
			:is_wmadmin="is_wmadmin"
			:formVisible="formDetailVisible"
			@hideForm="formDetailVisible=false"
		></matterDetail>
	</div>
</template>

<script>
import {
	getItemmanage,
	addItemmanage,
	updateItemmanage,
	getItemmanageDetail,
	getadmin_jdlist
} from "../../api/matter/index";
import matterDetail from "../../components/modal/matterDetail.vue";
import { geTypeAll, uploadF } from "../../api/file/data"
import { getImg, checkNum } from "../../utils/util.js";
import vueEasyPrint from "../../components/vue-easy-print";
import workerTable from "../../components/workerTable";
import imageConversion from 'image-conversion'
import { getNamelist } from "../../api/project/index";
const formJson = {
	title: "",
	description: "",
	wg_img: [],
	Supervisiongroup: '',
	item_id: ''
};
export default {
	components: {
		matterDetail: matterDetail,
		workerTable: workerTable,
		vueEasyPrint: vueEasyPrint
	},
	data() {
		return {
			formDetailVisible: false,
			dialogVisible: false,
			itemId: '',
			query: {
				keyword: '',
				page: 1,
				limit: 10,
				status: ''
			},
			list: [],
			value: '',
			fileList: [],
			total: 0,
			loading: true,
			index: null,
			formName: null,
			formMap: {
				add: "新增",
				edit: "编辑"
			},
			options: [],
			formLoading: false,
			formVisible: false,
			formData: formJson,
			address: [],
			formRules: {},
			status: 1,
			addRules: {
				title: [
					{ required: true, message: "请输入事项名称", trigger: "blur" },
				],
				item_id: [
					{ required: true, message: "请选择项目名称", trigger: "change" }
				],
				description: [
					{ required: true, message: "请输入内容描述", trigger: "change" }
				]
			},
			deleteLoading: false,
			checkObj: {},
			readonly: false,
			checkStatus: 1,
			uploadData: [],
			projectList: [],
			arr: [],
			arr1: [],
			options1: [],
			isAdd: false,
			nickname: '',
			Supervisiongroup: ''
		};
	},
	computed: {
		is_wmadmin() {
			return this.$store.state.admin.is_wmadmin
		}
	},
	created() {
		// 将参数拷projectList贝进查询对象
		let query = this.$route.query;
		this.query = Object.assign(this.query, query);
		this.query.limit = parseInt(this.query.limit);
		this.getList();
		this.getType(3).then(res => {
			this.options = res
		})
		this.getProject()
		this.getOptions()
	},
	methods: {
		getImg,
		getOptions() {
			getadmin_jdlist().then(res => {
				console.log(res)
				this.options1 = res
				if (this.is_wmadmin == 2) {
					this.options1.forEach(item => {
						if (item.id == sessionStorage.getItem('zjjManageId')) {
							this.nickname = item.nickname
							this.formData.Supervisiongroup = item.id
						}
					})
				}
			})
		},
		changeSupervisiongroup(val) {
			console.log(val)
			if (checkNum(val)) {
				this.isAdd = true
				this.formData.Supervisiongroup = val
			} else {
				this.formData.nickname = val
				this.isAdd = false
				this.formData.Supervisiongroup = ''
			}
		},
		onExceed() {
			this.$message.error("最多上传5张")
		},
		onExceed1() {
			this.$message.error("最多上传5张")
		},
		getProject() {
			getNamelist().then(res => {
				this.projectList = res
			})
		},
		upload(params) {
			const _file = params.file;
			const isLt2M = _file.size / 1024 / 1024 < 5;
			if (!isLt2M) {
				this.$message.error("请上传5M以下图片");
				return false;
			}
			uploadF(_file).then(res => {
				let arr = []
				arr.push(getImg(res.url))
				if (this.formData.wg_img.length && this.itemId) {
					this.formData.wg_img = [...arr, ...this.formData.wg_img]
				} else {
					this.formData.wg_img = arr.splice(0)
				}
			})
			this.formData.wg_img.splice(2)
			console.log(this.formData.wg_img)
		},
		upload1(params) {
			const _file = params.file;
			const isLt2M = _file.size / 1024 / 1024 < 5;
			if (!isLt2M) {
				this.$message.error("请上传5M以下图片");
				return false;
			}
			uploadF(_file).then(res => {
				let arr = []
				arr.push(getImg(res.url))
				if (this.formData.zg_img.length && this.itemId) {
					this.formData.zg_img = [...arr, ...this.formData.zg_img]

				} else {
					this.formData.zg_img = arr.splice(0)
				}
			})
		},
		beforeUpload(file) {
			return new Promise((resolve, reject) => {
				let isLt2M = file.size / 1024 / 1024 < 5// 判定图片大小是否小于4MB
				if (isLt2M) {
					resolve(file)
				}
				// 压缩到400KB,这里的400就是要压缩的大小,可自定义
				imageConversion.compressAccurately(file, 400).then(res => {
					// console.log(res)
					resolve(res)
				})
			})
		},
		beforeUpload1(file) {
			return new Promise((resolve, reject) => {
				let isLt2M = file.size / 1024 / 1024 < 5// 判定图片大小是否小于4MB
				if (isLt2M) {
					resolve(file)
				}
				// 压缩到400KB,这里的400就是要压缩的大小,可自定义
				imageConversion.compressAccurately(file, 400).then(res => {
					// console.log(res)
					resolve(res)
				})
			})
		},
		printView() {
			this.$refs.easyPrint.print()
		},
		onReset() {
			this.query = {
				keyword: '',
				page: 1,
				limit: 10,
				status: ''
			};
			this.getList();
		},
		getType(pid) {
			let params = {
				pid: pid,
				keyword: ''
			}
			return new Promise((resolve, reject) => {
				geTypeAll(params).then(res => {
					resolve(res)
				}).catch(() => {
					reject()
				})
			})
		},
		onSubmit() {
			this.$router.push({
				path: "",
				query: this.query
			});
			this.getList();
		},
		handleCurrentChange(val) {
			this.query.page = val;
			this.getList();
		},
		getList() {
			this.loading = true;
			getItemmanage(this.query)
				.then(response => {
					this.loading = false;
					this.arr = []
					this.arr1 = []
					this.list = response.data || [];
					this.total = response.count || 0;
				})
				.catch(() => {
					this.loading = false;
					this.list = [];
					this.fileList = []
					this.uploadData = []
					this.total = 0;
					this.arr = []
					this.arr1 = []
				});
		},
		// 刷新表单
		resetForm() {
			if (this.$refs["dataForm"]) {
				this.readonly = false
				// 清空验证信息表单
				this.$refs["dataForm"].clearValidate();
				// 刷新表单
				this.$refs["dataForm"].resetFields();
			}
		},
		// 隐藏表单
		hideForm() {
			// 更改值
			this.readonly = false
			this.formVisible = !this.formVisible;
			// 清空表单
			this.$refs["dataForm"].resetFields();
			return true;
		},
		// 显示表单
		handleForm(index, row) {
			this.formVisible = true;
			this.formData = JSON.parse(JSON.stringify(formJson));
			if (row !== null) {
				this.itemId = row.id
				this.getDetail(row.id)
			}
			this.formName = "add";
			this.formRules = this.addRules;
			if (index !== null) {
				this.index = index;
				this.formName = "edit";
				this.formRules = this.editRules;
			}
		},
		getDetail(id) {
			getItemmanageDetail({ id }).then(res => {
				this.formData = res
				this.formData.wg_img = res.wg_img || []
				this.formData.zg_img = res.zg_img || []
				this.fileList = res.wg_img || []
				this.uploadData = res.zg_img || []
			})
		},
		viewDetail(index, row) {
			this.itemId = row.id
			this.formDetailVisible = true
		},
		handleClose() {
			this.dialogVisible = false
		},
		addUser(data) {
			addItemmanage(data).then(response => {
				if (response) {
					if (response.code) {
						return this.$message.error(response.message)
					}
					this.formLoading = false;
					this.$message.success("操作成功");
					this.formVisible = false;
					this.fileList = []
					this.arr = []
					this.arr1 = []
					this.uploadData = []
					this.getList()
				} else {
					this.$message.error("操作失败");
				}
				this.resetForm();
			});
		},
		formSubmit() {
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					if (!this.is_wmadmin && !this.formData.wg_img.length) {
						return this.$message.warning('请上传违规照片')
					}
					this.formLoading = true;
					let data = Object.assign({}, this.formData);
					if (!this.is_wmadmin) {
						if (!this.Supervisiongroup) {
							return this.$message.warning('请设置监督组')
						}
					}
					if (!this.itemId) {
						if (this.isAdd && this.formData.nickname) {
							if (!this.formData.username) {
								return this.$message.warning('请输入账号')
							}
							if (!this.formData.password) {
								return this.$message.warning('请输入密码')
							}
						}
						this.addUser(data)
					} else {
						if (this.is_wmadmin == 1) {
							data.wg_img = this.fileList
						}
						updateItemmanage(data).then(response => {
							this.formVisible = false;
							if (response) {
								if (response.code) {
									return this.$message.error(response.message)
								}
								this.$message.success("操作成功");
								this.$set(this, 'fileList', [])
								this.getList()
							} else {
								this.$message.error("操作失败");
							}
							this.resetForm();
						});
					}
				}
			});
		},
		// 删除
		handleDel(index, row) {
			if (row.id) {
				this.$confirm("确认删除该工人吗?", "提示", {
					type: "warning"
				})
					.then(() => {
						let para = { id: row.id };
						this.deleteLoading = true;
						deleteWorkman(para)
							.then(response => {
								this.deleteLoading = false;
								if (response) {
									this.$message.success("操作成功");
									this.getList()
								} else {
									this.$message.error("操作失败");
								}
							})
							.catch(() => {
								this.deleteLoading = false;
							});
					})
					.catch(() => {
						this.$message.info("取消删除");
					});
			}
		}
	}
}
</script>
<style lang="scss">
.el-message-box__container {
  .el-message-box__message {
    > p {
      text-align: center;
    }
  }
}
.qrcode {
  width: 80px;
  height: 80px;
}
.query-form {
  .el-input--suffix .el-input__inner {
    padding-right: 35px;
    &:focus {
      padding-right: 35px;
    }
  }
}
.el-dialog {
  .el-radio {
    margin-right: 10px;
  }
  .prompt {
    width: 200px;
  }
  .el-textarea__inner {
    &:focus {
      padding: 5px 15px;
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
  .el-upload-list__item:first-child {
    margin-top: 0;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 90px;
    height: 90px;
    line-height: 88px;
  }
  .el-upload--picture-card {
    width: 90px;
    height: 90px;
    line-height: 88px;
    margin-right: 5px;
  }
}
</style>
