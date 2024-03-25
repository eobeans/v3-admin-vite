import { ref } from "vue"
import { type promptCombindOpts } from "@/api/stable-diffusion/types/txt2img"
import promptObj from "../object.json"

export function usePrompt() {
  const promptStr = ref("")
  const promptCombind = ref("6")
  const promptCombindOpts = ref<promptCombindOpts[]>([
    { label: "1风格、1画质、1形容、1摄像机、4物品", value: "4" },
    { label: "1风格、1画质、1形容、1摄像机、6物品", value: "6" },
    { label: "1风格、1画质、1形容、1摄像机、8物品", value: "8" },
    { label: "全随机(物品1)", value: "1" },
    { label: "全随机(物品3)", value: "3" },
    { label: "全随机(物品5)", value: "5" }
  ])

  const styleList = promptObj.style
  const qualityList = promptObj.quality
  const adjectiveList = promptObj.adjective
  const objectList = promptObj.object
  const cameraList = promptObj.camera

  // ** 提示词组合 */
  const generaterPromptStr = () => {
    const val = promptCombind.value
    if (val == "4" || val == "6" || val == "8") {
      const promptList = [
        styleList[Math.floor(Math.random() * styleList.length)],
        qualityList[Math.floor(Math.random() * qualityList.length)],
        adjectiveList[Math.floor(Math.random() * adjectiveList.length)],
        cameraList[Math.floor(Math.random() * cameraList.length)]
      ]
      for (let i = 0; i < Number(val); i++) {
        promptList.push(objectList[Math.floor(Math.random() * objectList.length)])
      }
      promptStr.value = promptList.join(",")
    } else if (val == "1" || val == "3" || val == "5") {
      const promptList = [
        styleList[Math.floor(Math.random() * styleList.length)],
        qualityList[Math.floor(Math.random() * qualityList.length)],
        adjectiveList[Math.floor(Math.random() * adjectiveList.length)],
        cameraList[Math.floor(Math.random() * cameraList.length)]
      ]
      for (let i = 0; i < Number(val); i++) {
        promptList.push(objectList[Math.floor(Math.random() * objectList.length)])
      }
      promptList.sort()
      promptStr.value = promptList.join(",")
    }
  }

  // ** 提示词组合 */
  const changePromptCombind = (val: string) => {
    if (val == "4" || val == "6" || val == "8") {
      const promptList = [
        styleList[Math.floor(Math.random() * styleList.length)],
        qualityList[Math.floor(Math.random() * qualityList.length)],
        adjectiveList[Math.floor(Math.random() * adjectiveList.length)],
        cameraList[Math.floor(Math.random() * cameraList.length)]
      ]
      for (let i = 0; i < Number(val); i++) {
        promptList.push(objectList[Math.floor(Math.random() * objectList.length)])
      }
      promptStr.value = promptList.join(",")
    } else if (val == "1" || val == "3" || val == "5") {
      const promptList = [
        styleList[Math.floor(Math.random() * styleList.length)],
        qualityList[Math.floor(Math.random() * qualityList.length)],
        adjectiveList[Math.floor(Math.random() * adjectiveList.length)],
        cameraList[Math.floor(Math.random() * cameraList.length)]
      ]
      for (let i = 0; i < Number(val); i++) {
        promptList.push(objectList[Math.floor(Math.random() * objectList.length)])
      }
      promptList.sort()
      promptStr.value = promptList.join(",")
    }
  }

  return { promptStr, promptCombind, promptCombindOpts, generaterPromptStr, changePromptCombind }
}
