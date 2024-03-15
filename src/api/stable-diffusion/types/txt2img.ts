export interface Txt2ImgRequestData {
  // 宽度
  width: number
  // 高度
  height: number
  // 步数
  steps?: number
  // 数量/批
  batch_size?: number
  // 采样器
  sampler_index?: string
  // 正向提示词
  prompt: string
  // 反向提示词
  negative_prompt: string
}

export type Txt2ImgResponseData = ApiResponseData<string>
