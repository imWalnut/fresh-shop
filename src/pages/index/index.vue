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
import {useMemberStore} from "@/stores";
import {addCartsInfo} from "@/services/cart";
import type {CartParams} from "@/types/cart";

const bannerList = ref<BannerItem[]>([])
const categoryList = ref<CategoryItem[]>([])
const groupList = ref<HotItem[]>([])
const isTriggered = ref(false)
const isLoading = ref(false)
const popup = ref()
const localData = ref()
const isShowSku = ref(false)
const memberStore = useMemberStore()

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

// 打开sku弹出层
const onOpenPopup = async (val) => {
  // 判断是否登录
  if (!memberStore.profile) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }
  // 判断是否认证
  if (memberStore.authorityStatus !== 2) {
    uni.navigateTo({ url: '/pages/authority/authority' })
    return
  }
  // 判断是否多规格
  if (val.productSpecs.length > 1) {
    localData.value = val
    isShowSku.value = true
    popup.value.open()
  } else {
    // 单规格直接加入购物车
    const body: CartParams = {
      userId: memberStore.profile.id,
      quantity: 1,
      productSpecId: val.productSpecs[0].id,
      totalPrice: val.productSpecs[0].price,
    }
    await addCartsInfo(body)
  }
}

// 改变popup状态
const changePopup: UniHelper.UniPopupOnChange = (event) => {
  if (event.show) {
    uni.hideTabBar()
  } else {
    localData.value = undefined
    isShowSku.value = false
    uni.showTabBar()
  }
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
      <WalnutGuess ref="refGuess" @open="onOpenPopup" />
    </template>
  </scroll-view>
  <!-- uni-ui 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff" @change="changePopup">
    <WalnutShop v-if="isShowSku" :localData="localData" @close="popup.close()" />
  </uni-popup>
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
