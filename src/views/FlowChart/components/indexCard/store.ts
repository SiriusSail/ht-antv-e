import { defineStore } from 'pinia'
import { reactive } from 'vue'

export default defineStore('fromDraftsPage', {
  state: () => {
    const state = reactive({
      isDrafts: false,
    })

    return state
  }
})