import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { getAccessToken, removeAccessToken, setAccessToken } from "@/utils/cache/cookies"
import axios from "axios"

// 登入SD
const localSdInstance = axios.create({
  baseURL: "/localSd",
  timeout: 100000,
  headers: {
    Authorization: getAccessToken(),
    "Access-Control-Allow-Origin": "http://localhost:3333",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range"
  }
})

export const useStableDiffusionStore = defineStore("stable-diffusion", () => {
  const username = ref<string>("")
  const password = ref<string>("")
  /** 登录 */
  const login = async (loginData: any) => {
    username.value = loginData.username
    password.value = loginData.password
    const formData = new FormData()
    formData.append("username", username.value)
    formData.append("password", password.value)
    localSdInstance
      .post("login", formData)
      .then((res: any) => {
        console.log("登入SD success", res)
        localSdInstance.get("token").then((res1: any) => {
          setAccessToken(res1.data.token)
        })
      })
      .catch((err: any) => {
        console.log("登入SD error", err)
      })
  }

  /** 登出 */
  const logout = () => {
    username.value = ""
    password.value = ""
    removeAccessToken()
  }

  /** 重置 Token */
  const resetToken = () => {
    username.value = ""
    password.value = ""
    removeAccessToken()
  }

  return { username, password, login, logout, resetToken }
})

/** 在 setup 外使用 */
export function useStableDiffusionStoreHook() {
  return useStableDiffusionStore(store)
}
