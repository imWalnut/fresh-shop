import { http } from '@/utils/http'
import type {CartParams} from "@/types/cart";
/**
 *
 */
export const addCartsInfo = (data: CartParams) => {
  return http({
    method: 'POST',
    url: '/api/carts/addCartsInfo',
    data,
  })
}
