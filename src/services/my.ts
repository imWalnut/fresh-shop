import { http } from '@/utils/http'
import type {AddressParams, AuthorityParams, InvitedParams} from "@/types/my";
/**
 * 获取用户认证状态
 */
export const getUserAuthorityStatus = (id: number) => {
  return http({
    method: 'GET',
    url: `/api/users/getUserAuthorityStatus/${id}`,
  })
}

/**
 * 提交用户认证
 */
export const addUserAuthority = (data: AuthorityParams) => {
  return http({
    method: 'POST',
    url: `/api/users/addUserAuthority`,
    data,
  })
}

/**
 * 新增用户地址
 */
export const addUserAddress = (data: AddressParams) => {
  return http({
    method: 'POST',
    url: `/api/users/addUserAddress`,
    data,
  })
}

/**
 * 绑定邀请人
 */
export const addUserInvitedBy = (data: InvitedParams) => {
  return http({
    method: 'POST',
    url: `/api/users/addUserInvitedBy`,
    data,
  })
}
