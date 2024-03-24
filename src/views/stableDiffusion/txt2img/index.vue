<script lang="ts" setup>
import { ref, reactive } from "vue"
// import { getTxt2ImgDataApi } from "@/api/stable-diffusion"
import { type Txt2ImgRequestData } from "@/api/stable-diffusion/types/txt2img"
import { setXApiKey } from "@/utils/cache/cookies"
import promptObj from "./object.json"
import CryptoJS from "crypto-js"
import axios from "axios"
import { ElMessage } from "element-plus"
import { getSDAuth } from "@/utils/cache/local-storage"
import { useDevice } from "@/hooks/useDevice"

const { isMobile } = useDevice()

const samplerOpts: any = reactive([
  { label: "Euler", value: "Euler" },
  { label: "DPM++ 2M Karras", value: "DPM++ 2M Karras" }
])

// 百度翻译
const promptStrZh = ref()
const translatePrompt = () => {
  const appid = "20240319001998640"
  const salt = "1024256"
  const key = "dr2tzlKTZ0nJVKx94irK"
  const str1 = appid + promptStr.value + salt + key
  const sign = CryptoJS.MD5(str1).toString()
  axios
    .get("baidu/api/trans/vip/translate", {
      params: {
        q: promptStr.value,
        from: "en",
        to: "zh",
        appid: appid,
        salt: salt,
        sign: sign
      }
    })
    .then(function (res: any) {
      console.log(res)
      promptStrZh.value = res.data.trans_result[0].dst
    })
    .catch(function (error) {
      console.log(error)
    })
}

const promptStr = ref()
const generaterPromptStr = () => {
  const styleList = promptObj.style
  const qualityList = promptObj.quality
  const adjectiveList = promptObj.adjective
  const objectList = promptObj.object
  const cameraList = promptObj.camera
  const promptList = [
    styleList[Math.floor(Math.random() * styleList.length)],
    qualityList[Math.floor(Math.random() * qualityList.length)],
    adjectiveList[Math.floor(Math.random() * adjectiveList.length)],
    cameraList[Math.floor(Math.random() * cameraList.length)]
  ]
  for (let i = 0; i < 6; i++) {
    promptList.push(objectList[Math.floor(Math.random() * objectList.length)])
  }
  promptStr.value = promptList.join(",")
  return promptStr
}

const beforeGeneraterPromptStr = () => {
  generaterPromptStr()
  translatePrompt()
}
beforeGeneraterPromptStr()

const negativePromptStr = ref()
const generaterNegativePrompt = () => {
  const negativePrompt =
    "nsfw, bad anatomy, cropped, blurred, mutated, error, lowres, blurry, low quality, username, signature, watermark, text"
  negativePromptStr.value = negativePrompt
  return negativePrompt
}
generaterNegativePrompt()

// SD接口服务
const sdAuth = getSDAuth()
const localSdInstance = axios.create({
  baseURL: "/localSd",
  timeout: 100000,
  auth: {
    username: sdAuth.username,
    password: sdAuth.password
  },
  headers: {
    "Access-Control-Allow-Origin": "*", // "http://localhost:3333",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range"
  }
})

/** 文生图请求参数 */
const txt2ImgRemoteParams: Txt2ImgRequestData = reactive({
  width: "512",
  height: "768",
  steps: 32,
  prompt: promptStr,
  negative_prompt: negativePromptStr,
  model_id: "midjourney"
})

const txt2ImgParams: Txt2ImgRequestData = reactive({
  width: "512",
  height: "768",
  steps: 32,
  n_iter: 1,
  batch_size: 1,
  sampler_index: "Euler",
  prompt: promptStr,
  negative_prompt: negativePromptStr
})

const remoteType = ref("2")
const imgSrc = ref("")
const imgList = ref([])
const loading = ref(false)
const xApiKey = ref("b68ce212fa3d6bcf0ecfd78c0c05d003052b185bf78bbbcde96062001e439476")
const getTxt2Img = async () => {
  try {
    loading.value = true
    if (remoteType.value == "1") {
      setXApiKey(xApiKey.value)
      const headers = {
        "X-API-KEY": xApiKey.value
      }
      // const res = await getTxt2ImgDataRemoteApi(txt2ImgRemoteParams)
      const res: any = await axios.post("https://api.midjourneyapi.xyz/sd/txt2img", txt2ImgRemoteParams, { headers })
      if (res.status == 200) {
        imgList.value = res.data.output
        imgSrc.value = res.data.output[0]
      } else {
        ElMessage.error(res.statusText)
      }
      console.log("goapi.ai", res)
    } else if (remoteType.value == "2") {
      const res2: any = await localSdInstance.post("sdapi/v1/txt2img", txt2ImgParams)
      if (res2.status == 200) {
        imgList.value = res2.data.images.map((item: string) => {
          const base64 = `data:image/jpeg;base64,${item}`
          downloadImg(base64)
          return base64
        })
        imgSrc.value = `data:image/jpeg;base64,${res2.data.images[0]}`
      }
    }
  } catch (err: any) {
    ElMessage.error(err)
  } finally {
    loading.value = false
  }
}

const downloadImg = (base64: string) => {
  const now = new Date()
  const a = document.createElement("a")
  a.href = base64
  a.download = String(now.getTime())
  document.body.appendChild(a)
  a.click()
  a.remove()
}

const batch_number = ref(10)
const beforeBatchGetTxt2Img = async () => {
  for (let i = 0; i < batch_number.value; i++) {
    generaterPromptStr()
    txt2ImgParams.steps = Math.floor(Math.random() * (50 - 20 + 1)) + 20
    await getTxt2Img()
  }
}

// 页面控制
const modeEnv = import.meta.env.VITE_NODE_ENV == "production" ? ref("2") : ref("1")
if (modeEnv.value == "2") {
  batch_number.value = 1
}
</script>

<template>
  <div v-loading="loading" class="app-container">
    <div :class="isMobile ? 'flex-column justify-center' : 'flex-row'">
      <el-select v-model="remoteType" class="mg-20" style="width: 180px; margin-right: 20px">
        <el-option label="远程API" value="1" />
        <el-option label="本地SD-API" value="2" />
      </el-select>
      <div class="mg-20"><el-button type="primary" @click="getTxt2Img">点击开始文生图</el-button></div>
      <div class="mg-20"><el-button type="primary" @click="beforeGeneraterPromptStr">生成正向提示词</el-button></div>
      <div v-if="modeEnv == '1'" class="mg-20">
        <el-button type="primary" @click="beforeBatchGetTxt2Img">批量生成</el-button>
      </div>
      <!-- <el-button type="primary" @click="loginSD">测试登入SD</el-button> -->
    </div>
    <div :class="isMobile ? 'flex-column' : 'flex-row'">
      <div :style="isMobile ? 'width: 100%;' : 'width: 50%; margin-right: 40px;'">
        <div class="mg-20">配置表单：</div>
        <div v-if="remoteType == '1'" class="mg-20">
          <el-form>
            <el-form-item label="x-api-key">
              <el-input v-model="xApiKey" />
            </el-form-item>
            <el-form-item label="steps（步长）">
              <el-input v-model="txt2ImgRemoteParams.steps" />
            </el-form-item>
          </el-form>
        </div>
        <div v-if="remoteType == '2'" class="mg-20">
          <el-form label-width="140px" label-position="left">
            <el-form-item v-if="modeEnv == '1'" label="生产批次">
              <el-input-number v-model="batch_number" :min="1" :max="100" />
            </el-form-item>
            <el-form-item label="采样器">
              <el-select v-model="txt2ImgParams.sampler_index" style="width: 220px" placeholder="请选择采样器">
                <el-option v-for="item in samplerOpts" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="数量/批次">
              <el-input-number v-model="txt2ImgParams.batch_size" :min="1" :max="4" />
            </el-form-item>
            <el-form-item label="步长">
              <el-input-number v-model="txt2ImgParams.steps" :min="20" :max="50" />
            </el-form-item>
          </el-form>
        </div>
        <div class="mg-20">提示词：</div>
        <div class="mg-20">
          <el-input type="textarea" :rows="4" v-model="promptStr" />
        </div>
        <div class="mg-20">提示词（中文翻译）：</div>
        <div class="mg-20">{{ promptStrZh }}</div>
        <div class="mg-20">反向提示词：</div>
        <div class="mg-20">
          <el-input type="textarea" :rows="2" v-model="negativePromptStr" />
        </div>
        <div class="mg-20">
          图片地址：
          <!-- <el-button v-if="imgSrc" class="mg-20" type="primary" @click="downloadImg">下载图片</el-button> -->
        </div>
        <div v-if="remoteType == '1'" class="mg-20">
          <div>{{ imgSrc }}</div>
        </div>
      </div>
      <div>
        <div class="flex-column justify-center" style="width: 100%">
          <el-image style="width: 100%; max-width: 512px" :src="imgSrc" fit="scale-down" :preview-src-list="imgList" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mg-20 {
  margin: 20px;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.justify-center {
  justify-content: center;
}
</style>
