import type { CategoryItem, GuessProductSpecItem } from '@/types/home'

/** 商品详情-商品数据类型 */
export type GoodsProductDetailItem = {
  /** 商品名 */
  productInfo: ProductDetailItem
  /** id */
  similarProducts: Array<any>
}

/** 商品详情数据类型 */
export type ProductDetailItem = {
  /** 商品名 */
  name: string
  /** id */
  id: number
  /** 商品编号 */
  productCode: string
  /** 商品主图 */
  mainImage: string
  /** 商品详情图 */
  subImages: string[]
  /** 销量 */
  soldAmount: number
  /** 库存 */
  stockAmount: number
  /** 押金 */
  deposit: number
  /** 规格 */
  productSpecs: Array<GuessProductSpecItem>
  /** 分类 */
  category: CategoryItem
  /** 分组 */
  productGroups: Array<any>
  /** 备注 */
  remark: string
}
