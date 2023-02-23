import { defineStore } from 'pinia'
import { ref } from "vue";
import Service from "@/api/index";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";


export default defineStore('roles', () => {
  const userInfo = ref({})
  const rulePath = ref('')
  const routers = ref<Array<RouteRecordRaw>>([])
  const getUserInfo = async () => {
    const res = await Service.postSetBasicInfo();
    userInfo.value = res.result;
  }
  return { userInfo, getUserInfo, routers, rulePath }
})

