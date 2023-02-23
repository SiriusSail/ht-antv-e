import { defineStore } from 'pinia'
import { reactive } from 'vue'

export default defineStore('flowchartSidebar', {
  state: () => {
    const state = reactive({
      isShowDrafts: false,
    })
    return state
  }
})