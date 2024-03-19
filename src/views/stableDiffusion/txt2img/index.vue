<script lang="ts" setup>
import { ref, reactive } from "vue"
import { getTxt2ImgDataApi } from "@/api/stable-diffusion"
import { type Txt2ImgRequestData } from "@/api/stable-diffusion/types/txt2img"
import promptObj from "./object.json"

const promptStr = ref()
const generaterPromptStr = () => {
  const styleList = promptObj.style
  const qualityList = promptObj.quality
  const adjectiveList = promptObj.adjective
  const objectList = promptObj.object
  const promptList = [
    styleList[Math.floor(Math.random() * styleList.length)],
    qualityList[Math.floor(Math.random() * qualityList.length)]
  ]
  for (let i = 0; i < 6; i++) {
    const adjectiveObject =
      adjectiveList[Math.floor(Math.random() * adjectiveList.length)] +
      objectList[Math.floor(Math.random() * objectList.length)]
    promptList.push(adjectiveObject)
  }
  promptStr.value = promptList.join(",")
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
  width: 512,
  height: 768,
  steps: 32,
  batch_size: 4,
  sampler_index: "",
  prompt: "",
  negative_prompt: "Euler"
})

const getTxt2Img = () => {
  getTxt2ImgDataApi(txt2ImgParams).then((res) => {
    console.log(res)
  })
}
getTxt2Img()
</script>

<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="getTxt2Img">点击开始文生图</el-button>
      <el-button type="primary" @click="generaterPromptStr">生成正向提示词</el-button>
    </div>
    <div>
      <div class="mg-20">提示词：</div>
      <div class="mg-20">{{ promptStr }}</div>
      <div class="mg-20">反向提示词：</div>
      <div class="mg-20">{{ negativePromptStr }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mg-20 {
  margin: 20px;
}
</style>
