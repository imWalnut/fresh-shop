/**
 * 猜你喜欢组合式函数
 */
import { ref } from 'vue'
import type {WalnutGuessInstance} from "@/types/component";

export const useGuessList = () => {
  // 获取猜你喜欢组件实例
  const refGuess = ref<WalnutGuessInstance>()

  // 滚动触底事件
  const onScrollTolower = () => {
    refGuess.value?.getMore()
  }

  // 返回 ref 和事件处理函数
  return { refGuess, onScrollTolower }
}
