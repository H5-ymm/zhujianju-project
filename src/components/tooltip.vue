<template>
  <el-tooltip class="item" effect="dark" :content="content" placement="top-center">
    <slot></slot>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
</style>
