<template>
	<div>
		<el-form :inline="true" :model="query" class="query-form">
			<el-form-item class="query-form-item">
				<el-input v-model="query.keyword" class="width200" placeholder="请输入事项名称"></el-input>
			</el-form-item>
			<el-form-item class="query-form-item">
				<el-select v-model="query.status" placeholder="处理状态">
					<el-option label="整改" value="1"></el-option>
					<el-option label="待审核" value="2"></el-option>
					<el-option label="已整改" value="3"></el-option>
				</el-select>
			</el-form-item>
			<!-- <el-form-item class="query-form-item">
				<el-date-picker v-model="query.date" value-format="timestamp" type="date" placeholder="选择日期时间"></el-date-picker>
			</el-form-item>-->
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
					<el-button
						type="primary"
						icon="el-icon-plus"
						v-if="!is_wmadmin"
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
			<el-table-column label="事项名称" align="center" prop="number" width="110px"></el-table-column>
			<el-table-column label="内容描述" prop="type" width="110px" align="center"></el-table-column>
			<el-table-column label="违规照片" prop="name" min-width="110px" align="center">
				<template slot-scope="scope">
					<div>
						<img :src="getImg(scope.row.wg_img)" v-if="scope.row.wg_img" class="qrcode" alt="">
					</div>
				</template>
			</el-table-column>
			<el-table-column label="违规日期" width="170px" align="center">
				<template slot-scope="scope">
					<span>
						{{scope.row.endtime?
						$moment.unix(scope.row.report_date).format('YYYY-MM-DD'):''}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="整改意见" width="110px" prop="driver" align="center"></el-table-column>
			<el-table-column label="整改照片" width="110px" align="center">
				<template slot-scope="scope">
					<div>
						<img :src="getImg(scope.row.zg_img)" v-if="scope.row.zg_img" class="qrcode" alt="">
					</div>
				</template>
			</el-table-column>
			<el-table-column label="整改日期" width="170px" align="center">
				<template slot-scope="scope">
					<span>
						{{scope.row.endtime?
						$moment.unix(scope.row.report_date).format('YYYY-MM-DD'):''}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="监督组" width="110px" prop="driver" align="center"></el-table-column>
			<el-table-column label="处理状态" width="110px" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.status==1?'待整改':scope.row.status==2?'待审核':'已整改'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" class="no-print" align="center" min-width="120px" fixed="right">
				<template slot-scope="scope">
					<el-button
						type="text"
						size="small"
						v-if="!is_wmadmin"
						@click.native="switchCheck(scope.row)"
					>审核</el-button>
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
		<el-dialog title="提示" :visible.sync="dialogVisible" width="36%" :before-close="handleClose">
			<el-radio-group v-model="status">
				<el-radio :label="1">通过</el-radio>
				<el-radio :label="2">拒绝</el-radio>
			</el-radio-group>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleCheck">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog
			:title="formMap[formName]"
			:visible.sync="formVisible"
			:before-close="hideForm"
			width="40%"
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
						class="width240"
						:readonly="readonly"
						@change="changeInput"
						placeholder="请输入事项名称"
						v-model="formData.title"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="内容描述" prop="description">
					<el-input
						class="width240"
						:readonly="readonly"
						type="textarea"
						:rows="3"
						placeholder="请输入内容描述"
						v-model="formData.description"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="违规照片" required>
					<p class="prompt">最多5张,支持JPG、JPEG、PNG.大小不超过5MB</p>
					<el-upload
						:limit="5"
						action="customize"
						ref="upload"
						:show-file-list="false"
						:http-request="upload"
						@on-exceed="onExceed"
					>
						<div class="x-flex-start x-flex-wap el-upload-card">
							<div class="x-flex-start x-flex-wap">
								<img
									v-if="fileList.length"
									v-for="item in fileList"
									class="el-upload-list__item"
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
				</el-form-item>
				<el-form-item label="整改照片" required v-if="matterId&&is_wmadmin">
					<p class="prompt">最多5张,支持JPG、JPEG、PNG.大小不超过5MB</p>
					<el-upload
						:limit="5"
						action="customize"
						ref="upload"
						:show-file-list="false"
						:http-request="upload"
						@on-exceed="onExceed"
					>
						<div class="x-flex-start x-flex-wap el-upload-card">
							<div class="x-flex-start x-flex-wap">
								<img
									v-if="fileList.length"
									v-for="item in fileList"
									class="el-upload-list__item"
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
				</el-form-item>
				<el-form-item label="整改意见" v-if="matterId&&is_wmadmin" prop="suggestion">
					<el-input
						class="width240"
						type="textarea"
						:rows="3"
						:readonly="readonly"
						placeholder="请输入监督组"
						v-model="formData.suggestion"
						auto-complete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="处理状态" v-if="matterId">
					<el-radio-group class="width240" v-model="formData.status">
						<el-radio :label="1" :disabled="readonly&&is_wmadmin==1">待整改</el-radio>
						<el-radio :label="2" :disabled="readonly&&is_wmadmin==1">待审核</el-radio>
						<el-radio :label="3" :disabled="readonly" v-if="!is_wmadmin">已整改</el-radio>
						<el-radio :label="4" :disabled="readonly" v-if="!is_wmadmin">已退回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="监督组" prop="Supervisiongroup">
					<el-input
						class="width240"
						:readonly="readonly"
						placeholder="请输入监督组"
						v-model="formData.Supervisiongroup"
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
					v-if="!readonly"
				>提交</el-button>
			</div>
		</el-dialog>
		<workerDetail
			:matterId="matterId"
			:formVisible="formDetailVisible"
			@hideForm="formDetailVisible=false"
		></workerDetail>
	</div>
</template>

<script>
import {
	getItemmanage,
	addItemmanage,
	updateItemmanage
} from "../../api/matter/index";
import { getNamelist } from "../../api/project/index";
import WorkerDetail from "../../components/modal/workerDetail.vue";
import selectCity from "../../components/selectCity.vue";
import { geTypeAll } from "../../api/file/data"
import { getImg } from "../../utils/util.js";
import vueEasyPrint from "../../components/vue-easy-print";
import workerTable from "../../components/workerTable";

const formJson = {
	title: "",
	description: "",
	wg_img: '',
	Supervisiongroup: ''
};
export default {
	components: {
		WorkerDetail: WorkerDetail,
		selectCity: selectCity,
		workerTable: workerTable,
		vueEasyPrint: vueEasyPrint
	},
	data() {
		return {
			formDetailVisible: false,
			dialogVisible: false,
			matterId: '',
			roles: [],
			query: {
				keyword: '',
				page: 1,
				limit: 10,
				date: '',
				item_id: '',
				job_type: ''
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
				description: [
					{ required: true, message: "请输入内容描述", trigger: "change" }
				],
				Supervisiongroup: [
					{ required: true, message: "请输入监督组", trigger: "blur" }
				],
			},
			deleteLoading: false,
			checkObj: {},
			readonly: false,
			checkStatus: 1,
			projectList: [],
			workman_id: ''
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
	},
	methods: {
		getImg,
		onExceed() {
			this.$message.error("最多上传5张")
		},
		upload() { },
		getProject() {
			getNamelist().then(res => {
				this.projectList = res
			})
		},
		printView() {
			this.$refs.easyPrint.print()
		},
		viewQrcode() {
			getqrcode().then(res => {
				if (res) {
					let url = getImg(res)
					this.$alert(`<img src=${url} />`, '二维码', {
						dangerouslyUseHTMLString: true
					}).then(() => {
						console.log(1)
					})
						.catch(action => {
							console.log(action)
						});
				}
			})
		},
		districtChange(val) {
			this.formData.provinceid = val[0]
			this.formData.cityid = val[1]
			this.formData.areaid = val[2]
		},
		changeInput(e) {
			getworkmanbytel({ tel: e }).then(res => {
				if (res) {
					this.formData = res
					this.readonly = true
				} else {
					this.readonly = false
				}
			})
		},
		onReset() {
			this.query = {
				keyword: '',
				page: 1,
				limit: 10,
				date: '',
				item_id: '',
				job_type: ''
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
		checkSign(val) {
			console.log(val)
			this.checkStatus = 2
			this.status = Number(val.sure_attendance)
			console.log(this.status)
			this.workman_id = val.id
			this.dialogVisible = true
		},
		reviewSign() {
			let params = {
				workman_id: this.workman_id,
				status: this.status,
				time: this.query.date
			}
			sureAttendance(params).then(res => {
				this.status = 1
				if (res) {
					this.dialogVisible = false;
					this.$message.success("操作成功");
					this.getList()
				} else {
					this.$message.error("操作失败");
				}
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
					this.readonly = false
					this.loading = false;
					this.list = response.data || [];
					this.total = response.count || 0;
				})
				.catch(() => {
					this.readonly = false
					this.loading = false;
					this.list = [];
					this.total = 0;
					this.roles = [];
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
				this.formData = Object.assign({}, row);
				if (row.provinceid) {
					this.getDetail(row.id)
				}
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
			getWorkmanDetail({ id }).then(res => {
				if (res.provinceid) {
					this.address = [res.provinceid, res.cityid, res.areaid]
				}
				this.formData = res
			})
		},
		viewDetail(index, row) {
			this.matterId = row.id
			this.formDetailVisible = true
		},
		switchCheck(item) {
			this.checkStatus = 1
			this.checkObj = item
			this.dialogVisible = true
		},
		handleClose() {
			this.dialogVisible = false
		},
		handleCheck() {
			if (this.checkStatus == 1) {
				let params = {
					id: this.checkObj.wid,
					status: this.status
				}
				this.formLoading = true;
				saveStatus(params).then(response => {
					if (response) {
						this.formLoading = false;
						this.$message.success("操作成功");
						this.dialogVisible = false;
						this.getList()
					} else {
						this.$message.error("操作失败");
					}
					this.resetForm();
				});
			} else {
				this.reviewSign()
			}
		},
		addUser(data) {
			addItemmanage(data).then(response => {
				if (response) {
					this.formLoading = false;
					this.$message.success("操作成功");
					this.formVisible = false;
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
					this.formLoading = true;
					let data = Object.assign({}, this.formData);
					if (!data.id) {
						this.addUser(data)
					} else {
						updateWorkman(data, this.formName).then(response => {
							if (response) {
								this.formLoading = false;
								this.$message.success("操作成功");
								this.formVisible = false;
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
  .el-upload--picture-card {
    width: 90px;
    height: 90px;
    line-height: 88px;
  }
}
</style>
