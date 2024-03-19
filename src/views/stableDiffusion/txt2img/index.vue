<script lang="ts" setup>
import { ref, reactive } from "vue"
// import { getTxt2ImgDataApi, getTxt2ImgDataRemoteApi } from "@/api/stable-diffusion"
import { getTxt2ImgDataRemoteApi } from "@/api/stable-diffusion"
import { type Txt2ImgRequestData } from "@/api/stable-diffusion/types/txt2img"
import { setXApiKey } from "@/utils/cache/cookies"
import promptObj from "./object.json"
import CryptoJS from "crypto-js"
import axios from "axios"

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
    qualityList[Math.floor(Math.random() * qualityList.length)]
  ]
  for (let i = 0; i < 6; i++) {
    const adjectiveObject =
      adjectiveList[Math.floor(Math.random() * adjectiveList.length)] +
      " " +
      objectList[Math.floor(Math.random() * objectList.length)]
    promptList.push(adjectiveObject)
  }
  promptList.push(cameraList[Math.floor(Math.random() * cameraList.length)])
  promptStr.value = promptList.join(",")
  translatePrompt()
  return promptStr
}
generaterPromptStr()

const negativePromptStr = ref()
const generaterNegativePrompt = () => {
  const negativePrompt =
    "nsfw, bad anatomy, cropped, blurred, mutated, error, lowres, blurry, low quality, username, signature, watermark, text"
  negativePromptStr.value = negativePrompt
  return negativePrompt
}
generaterNegativePrompt()

/** 文生图请求参数 */
const txt2ImgParams: Txt2ImgRequestData = reactive({
  width: "512",
  height: "768",
  steps: 32,
  // batch_size: 1,
  // sampler_index: "Euler",
  prompt: promptStr,
  negative_prompt: negativePromptStr,
  model_id: "midjourney"
})

const imgSrc = ref("")
const imgList = ref([])
const loading = ref(false)
setXApiKey("09302f179980dcd263ae8d8e98d471a35a953485175d06a800a359b6672db2b4")
const getTxt2Img = async () => {
  // getTxt2ImgDataApi(txt2ImgParams).then((res0) => {
  //   console.log(res0)
  // })
  try {
    loading.value = true
    const res = await getTxt2ImgDataRemoteApi(txt2ImgParams)
    imgList.value = res.output
    imgSrc.value = res.output[0]
    console.log(res)
  } finally {
    loading.value = false
  }
  // imgSrc.value = "https://img.midjourneyapi.xyz/sd/066ed402-b5c5-44e9-8e76-fe209109db5a.png"
  // imgList.value = ["https://img.midjourneyapi.xyz/sd/066ed402-b5c5-44e9-8e76-fe209109db5a.png"]
}
// getTxt2Img()

// const downloadImg = async() => {
//   try {
//     const response = await fetch(imgSrc.value);
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'image.png';
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);
//   } catch (error) {
//     console.error('Error downloading image:', error);
//   }
// }
</script>

<template>
  <div v-loading="loading" class="app-container">
    <div>
      <el-button type="primary" @click="getTxt2Img">点击开始文生图</el-button>
      <el-button type="primary" @click="generaterPromptStr">生成正向提示词</el-button>
    </div>
    <div class="flex-row">
      <div style="width: 500px; margin-right: 40px">
        <div class="mg-20">提示词：</div>
        <div class="mg-20">{{ promptStr }}</div>
        <div class="mg-20">提示词（中文翻译）：</div>
        <div class="mg-20">{{ promptStrZh }}</div>
        <div class="mg-20">反向提示词：</div>
        <div class="mg-20">{{ negativePromptStr }}</div>
        <div class="mg-20">
          图片地址：
          <!-- <el-button v-if="imgSrc" class="mg-20" type="primary" @click="downloadImg">下载图片</el-button> -->
        </div>
        <div class="mg-20">
          <div>{{ imgSrc }}</div>
        </div>
      </div>
      <div>
        <div>
          <el-image style="width: 512px; height: 768px" :src="imgSrc" fit="fill" :preview-src-list="imgList" />
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
</style>
