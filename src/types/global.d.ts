/** 通用分页结果类型 */
export type PageResult<T> = {
  /** 列表数据 */
  data: T[]
  /** 总条数 */
  total: number
  /** 总页数 */
  totalPages: number
  /** 当前页数 */
  currentPage: number
  /** 每页条数 */
  pageSize: number
}

/** 通用分页参数类型 */
export type PageParams = {
  /** 页码：默认值为 1 */
  currentPage?: number
  /** 页大小：默认值为 10 */
  pageSize?: number
}
