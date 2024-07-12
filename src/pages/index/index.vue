<script setup lang="ts">
import CustomNavbar from '@/pages/index/components/CustomNavbar.vue'
import CategoryPanel from '@/pages/index/components/CategoryPanel.vue'
import { onLoad } from '@dcloudio/uni-app'
import { getHomeBannerAPI, getHomeCategoryList, getHomeGroupAPI } from '@/services/home'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { ref } from 'vue'
import HotPanel from '@/pages/index/components/HotPanel.vue'
import PageSkeleton from '@/pages/index/components/PageSkeleton.vue'
import {useGuessList} from "@/composables";

const bannerList = ref<BannerItem[]>([])
const categoryList = ref<CategoryItem[]>([])
const groupList = ref<HotItem[]>([])
const isTriggered = ref(false)
const isLoading = ref(false)

// 获取轮播图数据
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI(0)
  bannerList.value = res.data
}

// 获取分类数据
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryList()
  categoryList.value = res.data
}

// 获取分组数据
const getHomeGroupData = async () => {
  const res = await getHomeGroupAPI()
  groupList.value = res.data
}

// 猜你喜欢组合式函数调用
const {refGuess, onScrollTolower} = useGuessList()

// 下拉刷新
const onRefreshRefresher = async () => {
  // 开始动画
  isTriggered.value = true
  // 重置首页商品数据
  refGuess.value?.resetData()
  // 加载数据
  await Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHomeGroupData(),
    refGuess.value?.getMore(),
  ])
  // 关闭动画
  isTriggered.value = false
}

onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeGroupData()])
  isLoading.value = false
})
</script>

<template>
  <!--  自定义导航栏-->
  <CustomNavbar />
  <!--  滚动容器-->
  <scroll-view
    @scrolltolower="onScrollTolower"
    refresher-enabled
    @refresherrefresh="onRefreshRefresher"
    :refresher-triggered="isTriggered"
    class="scroll-view"
    scroll-y
  >
    <!--  骨架屏-->
    <PageSkeleton v-if="isLoading" />
    <template v-else>
      <!--  首页分类-->
      <CategoryPanel :list="categoryList" />
      <!--  自定义轮播图-->
      <WalnutSwiper :list="bannerList" />
      <!--  热门推荐-->
      <HotPanel :list="groupList" />
      <!--  猜你喜欢-->
      <WalnutGuess ref="refGuess" />
    </template>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}
</style>
