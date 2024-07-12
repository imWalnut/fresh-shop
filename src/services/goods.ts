import { http } from '@/utils/http'
import type { GoodsProductDetailItem } from '@/types/goods'

// 获取商品详情
export const getProductDetailAPI = (id: number) => {
  return http<GoodsProductDetailItem>({
    method: 'GET',
    url: `/visitor/base/getProductInfo/${id}`,
  })
}
