import { http } from '@/utils/http'
import type { SignInItem, SignInParams } from '@/types/auth'
/**
 *
 */
export const signIn = (data: SignInParams) => {
  return http<SignInItem>({
    method: 'POST',
    url: '/api/auth/signIn',
    data,
  })
}
