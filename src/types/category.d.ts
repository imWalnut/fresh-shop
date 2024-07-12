/** 分类-商品分页参数类型 */
export type PageProductParams = {
  /** 页码：默认值为 1 */
  currentPage?: number
  /** 页大小：默认值为 10 */
  pageSize?: number
  /** 分类Id */
  categoryId?: number
}
