<script setup lang="ts">
// 获取首页商品数据
import { getHomeProductAPI } from '@/services/home'
import { onMounted, ref } from 'vue'
import type { GuessProductItem, GuessProductSpecItem } from '@/types/home'
import type { PageParams } from '@/types/global'

const productList = ref<GuessProductItem[]>([])
const pageParams: Required<PageParams> = {
  currentPage: 1,
  pageSize: 10,
}
// 分页结束标记
const finish = ref(false)

// 获取首页商品数据
const getHomeProductData = async () => {
  if (finish.value) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  const res = await getHomeProductAPI({
    ...pageParams,
  })
  const products = res.data.data.map((item: GuessProductItem) => {
    let priceArr = []
    item.productSpecs.forEach((value: GuessProductSpecItem) => {
      priceArr.push(value.price / value.quantity)
    })
    let max = Math.max(...priceArr)
    let min = Math.min(...priceArr)
    let price = ''
    if (min === max) {
      price = `${max}`
    } else {
      price = `${min}~${max}`
    }
    return {
      ...item,
      price,
    }
  })
  productList.value.push(...products)
  // 分页条件
  if (pageParams.currentPage < res.data.totalPages) {
    // 增加页码
    pageParams.currentPage++
  } else {
    finish.value = true
  }
}

// 重置
const resetData = () => {
  pageParams.currentPage = 1
  productList.value = []
  finish.value = false
}

onMounted(() => {
  getHomeProductData()
})

// 暴露方法
defineExpose({
  getMore: getHomeProductData,
  resetData,
})
</script>

<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">猜你喜欢</text>
  </view>
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="item in productList"
      :key="item.id"
      :url="`/pages/goods/goods?id=${item.id}`"
    >
      <image class="image" mode="aspectFill" :src="item.mainImage"></image>
      <view class="name ellipsis">{{ item.name }}</view>
      <view class="specs">
        <view class="specs-item" v-for="spec in item.productSpecs" :key="spec.id">
          {{ spec.quantity + spec.specName }}
        </view>
      </view>
      <view class="bottom">
        <view class="price">
          <text class="price-icon">¥</text>
          <text>{{ item.price }}</text>
          <text class="price-icon">/{{ item.productSpecs[0].specName }}</text>
        </view>
        <view class="shop-icon" />
      </view>
    </navigator>
  </view>
  <view class="loading-text">
    {{ finish ? '没有更多数据~' : '正在加载...' }}
  </view>
</template>

<style lang="scss">
:host {
  display: block;
}
/* 分类标题 */
.caption {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  color: #262626;
  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 28rpx 0 30rpx;

    &::before,
    &::after {
      content: '';
      width: 20rpx;
      height: 20rpx;
      background-image: url(@/static/images/bubble.png);
      background-size: contain;
      margin: 0 10rpx;
    }
  }
}

/* 猜你喜欢 */
.guess {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;
  .guess-item {
    width: 345rpx;
    padding: 24rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
    .specs {
      display: flex;
      font-size: 24rpx;
      color: #666;

      .specs-item + .specs-item {
        padding-left: 17rpx;
        position: relative;

        &::before {
          position: absolute;
          content: '';
          width: 1px;
          height: 60%;
          background-color: #666;
          left: 8rpx;
          top: 20%;
        }
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10rpx;
      .price {
        color: #cf4444;
        font-size: 32rpx;
        .price-icon {
          font-size: 70%;
          margin-right: 8rpx;
        }
      }
      .shop-icon {
        width: 45rpx;
        height: 45rpx;
        background: url('../static/tabs/cart_default.png') center center no-repeat;
        background-size: 80%;
        background-color: #27ba9b;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .name {
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .image {
    width: 304rpx;
    height: 304rpx;
  }
}
// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
