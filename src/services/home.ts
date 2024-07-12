import { http } from '@/utils/http'
import type { BannerItem, CategoryItem, GuessProductItem, HotItem } from '@/types/home'
import type { PageParams, PageResult } from '@/types/global'

// 获取轮播图
export const getHomeBannerAPI = (source: Number = 0) => {
  return http<BannerItem[]>({
    method: 'GET',
    url: `/visitor/base/getBannerList/${source}`,
  })
}

// 获取分类
export const getHomeCategoryList = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: `/visitor/base/getHomeCategoryList`,
  })
}

// 获取分组
export const getHomeGroupAPI = () => {
  return http<HotItem[]>({
    method: 'GET',
    url: `/visitor/base/getHomeGroupList`,
  })
}

// 获取商品
export const getHomeProductAPI = (data?: PageParams) => {
  return http<PageResult<GuessProductItem>>({
    method: 'GET',
    url: `/visitor/base/getProductsListByPage`,
    data,
  })
}
