<template>
	<el-cascader
		v-model="districtList"
		:placeholder="placeholder"
		:options="options"
		clearable
		:props="props"
		ref="cascader"
		class="cascader"
		@change="changeData"
		@expand-change="handleItemChange"
	></el-cascader>
</template>
<script>
import { getProvincesList, getCitysList } from '../api/file/area'
export default {
	props: {
		disabled: { type: Boolean, default: false },
		placeholder: { type: String, default: '请选择地区' },
		canAll: { type: Array, default: _ => [true, true, true] },
		address: { type: Array, default: _ => [] }
	},
	data() {
		return {
			options: [],
			districtList: [],
			props: {
				value: 'id',
				label: 'area_name',
				children: 'children'
			},
			list: []
		}
	},
	created() {
		if (!this.address.length) {
			this.districtList = []
			this.getRegion([])
		} else {
			this.getRegion(this.address)
			this.districtList = this.address
		}
	},
	watch: {
		address(val) {
			console.log(val)
			if (val.length) {
				this.getRegion(val)
				this.districtList = this.address
			} else {
				this.getRegion([])
				this.districtList = []
			}
		}
	},
	methods: {
		handleItemChange(val) {
			this.getCityList(val)
		},
		getProlist(list) {
			return list.map(item => {
				let obj = Object.assign(item, { children: [] })
				return obj
			})
		},
		getRegion(value) {
			getProvincesList()
				.then(res => {
					let arr = this.getProlist(res)
					this.options = arr
					this.getCityList(value)
				})
				.catch(error => {
					console.log(error)
				})
		},
		getCityList(value) {
			console.log(value)
			let code = ''
			if (!value.length) {
				code = '110000'
			} else {
				code = value[0]
			}
			getCitysList({ code }).then(res => {
				let arr = []
				if (!this.disabled) {
					arr = this.getProlist(res)
					this.getAreaList(value)
				} else {
					arr = res
				}
				this.options.forEach(item => {
					if (item.id == code) {
						item.children = arr
						return false
					}
				})
			})
		},
		getAreaList(value) {
			let code = ''
			if (!value[1]) {
				code = '110100'
			} else {
				code = value[1]
			}
			getCitysList({ code }).then(res => {
				let arr = res
				this.options.forEach(item => {
					if (item.id == value[0]) {
						if (item.children.length) {
							item.children.forEach(val => {
								if (val.id == code) {
									val.children = arr
								}
							})
						}
					}
				})
			})
		},
		changeData(val) {
			this.$emit('change', val)
		}
	}
}
</script>

<style scoped>
.cascader {
  display: block;
  width: 100% !important;
}
</style>

