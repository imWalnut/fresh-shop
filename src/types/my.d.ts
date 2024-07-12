/** 用户认证参数类型 */
export type AuthorityParams = {
  userId: number
  name: string
  sex: number
  shopName: string
  images: Array<string>
}

/** 地址参数类型 */
export type AddressParams = {
  userId: number
  name: string
  sex: number
  phoneNumber: string
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  countyCode: string
  countyName: string
  address: string
  lat: number
  lon: number
}

/** 地址参数类型 */
export type InvitedParams = {
  userId: number
  invitedBy: string
}
