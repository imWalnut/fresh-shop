/**
 * declare module '@vue/runtime-core'
 *   现调整为
 * declare module 'vue'
 */
import WalnutSwiper from '@/components/WalnutSwiper.vue'
import WalnutGuess from '@/components/WalnutGuess.vue'
import 'vue'
declare module 'vue' {
  export interface GlobalComponents {
    WalnutSwiper: typeof WalnutSwiper
    WalnutGuess: typeof WalnutGuess
  }
}

export type WalnutGuessInstance = InstanceType<typeof WalnutGuess>
