<template>
  <el-form ref="contentFormRef" :model="colors" label-position="left" class="content-form" label-width="100px">
    <el-form-item :label="langConfig.form.headerArea[lang]" prop="primary">
      <el-switch v-model="showHeader" active-color="#13ce66" inactive-color="#ff4949" @change="handleChange"> </el-switch>
    </el-form-item>
    <el-form-item :label="langConfig.form.isDev[lang]" prop="primary">
      <el-switch v-model="isDev" active-color="#13ce66" inactive-color="#ff4949" @change="handleDevChange"> </el-switch>
    </el-form-item>
    <el-form-item :label="langConfig.form.sidebarLogo[lang]" prop="primary">
      <el-switch v-model="sidebarLogo" active-color="#13ce66" inactive-color="#ff4949" @change="handleSidebarLogoChange"> </el-switch>
    </el-form-item>
    <el-form-item :label="langConfig.form.headerFixed[lang]" prop="primary">
      <el-switch v-model="fixedHeader" active-color="#13ce66" inactive-color="#ff4949" @change="handleFixedChange"> </el-switch>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { langConfig } from '@/utils/constant/config'

export default defineComponent({
	props: {
		lang: {
			type: String,
			default: '/zh-CN'
		}
	},
	emits: ['change', 'fixedHeader', 'sidebarLogo', 'toggleEdition'],
	setup(_props, { emit }) {
		const contentFormRef = ref(null)
		const state = reactive({
			showHeader: true,
			isDev: true,
			fixedHeader: false,
			sidebarLogo: true
		})
		const handleChange = () => {
			emit('change')
		}
		const handleFixedChange = () => {
			emit('fixedHeader')
		}
		const handleSidebarLogoChange = () => {
			emit('sidebarLogo')
		}
		const handleDevChange = () => {
			emit('toggleEdition')
		}
		return {
			langConfig,
			...toRefs(state),
			handleChange,
			handleDevChange,
			handleFixedChange,
			handleSidebarLogoChange,
			contentFormRef
		}
	}
})
</script>
<style lang="stylus" scoped>
.content-form{
  width:100%
}
</style>
