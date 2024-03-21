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
  /** 登录 */
  const login = async () => {
    const formData = new FormData()
    formData.append("username", "eobeans")
    formData.append("password", "eobeans@1996")
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
    removeAccessToken()
  }

  /** 重置 Token */
  const resetToken = () => {
    removeAccessToken()
  }

  return { login, logout, resetToken }
})

/** 在 setup 外使用 */
export function useStableDiffusionStoreHook() {
  return useStableDiffusionStore(store)
}
