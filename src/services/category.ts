import { http } from '@/utils/http'
import type { BannerItem, CategoryItem, GuessProductItem } from '@/types/home'
import type { PageResult } from '@/types/global'
import type { PageProductParams } from '@/types/category'

// 获取轮播图
export const getCategoryBannerAPI = (source: Number = 1) => {
  return http<BannerItem[]>({
    method: 'GET',
    url: `/visitor/base/getBannerList/${source}`,
  })
}

// 获取分类
export const getCategoryList = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: `/visitor/base/getCategoryList`,
  })
}

// 获取商品
export const getCategoryProductAPI = (data?: PageProductParams) => {
  return http<PageResult<GuessProductItem>>({
    method: 'GET',
    url: `/visitor/base/getProductsListByPage`,
    data,
  })
}
