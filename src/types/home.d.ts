/** 首页-广告区域数据类型 */
export type BannerItem = {
  /** 跳转链接 */
  hrefUrl: string
  /** id */
  id: number
  /** 图片链接 */
  imgUrl: string
  /** 跳转类型 */
  source: number
}

/** 首页-分类区域数据类型 */
export type CategoryItem = {
  /** 分类名 */
  name: string
  /** id */
  id: number
  /** 图片链接 */
  imgUrl: string
  /** 父级id */
  parentId: number
  /** 子集 */
  child: Array<CategoryItem> | undefined
}

/** 首页-热门推荐数据类型 */
export type HotItem = {
  /** 说明 */
  remark: string
  /** id */
  id: number
  /** 标题 */
  name: string
  /** 商品 */
  child: Array<any>
}

/** 首页-首页商品数据类型 */
export type GuessProductItem = {
  /** 商品名 */
  name: string
  /** id */
  id: number
  /** 图片链接 */
  mainImage: string
  /** 销量 */
  soldAmount: number
  /** 规格 */
  productSpecs: Array<GuessProductSpecItem>
  /** 分组 */
  productGroups: Array<any>
}

/** 首页-首页商品规格数据类型 */
export type GuessProductSpecItem = {
  /** 规格名 */
  specName: string
  /** id */
  id: number
  /** 规格备注 */
  specRemark: string
  /** 规格数量 */
  quantity: number
  /** 规格价格 */
  price: number
  /** 商品规格备注 */
  remark: string
}
