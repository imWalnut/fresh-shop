/** 登录参数类型 */
export type SignInParams = {
  code: string
  encryptedData: string
  iv: string
}

/** 登录数据类型 */
export type SignInItem = {
  /** 用户信息 */
  userInfo: any
  /** token */
  token: string
}
