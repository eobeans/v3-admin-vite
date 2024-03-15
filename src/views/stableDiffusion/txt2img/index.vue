<script lang="ts" setup>
import { reactive } from "vue"
import { getTxt2ImgDataApi } from "@/api/stable-diffusion"
import { type Txt2ImgRequestData } from "@/api/stable-diffusion/types/txt2img"

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
  <div h-full uno-padding-20>
    <div>
      <el-button type="primary" @click="getTxt2Img">点击开始文生图</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-link {
  font-size: 18px;
}
</style>
