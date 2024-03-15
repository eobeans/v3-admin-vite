import { request } from "@/utils/service"
import type * as Txt2ImgType from "./types/txt2img"

/** 获取文生图接口 */
export function getTxt2ImgDataApi() {
  return request<Txt2ImgType.Txt2ImgRequestData>({
    url: "Txt2Img/code",
    method: "get"
  })
}
