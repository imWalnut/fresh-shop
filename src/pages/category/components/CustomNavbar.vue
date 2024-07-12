<script setup lang="ts">
// 获取屏幕边界到安全区域距离
import type { CategoryItem } from '@/types/home'
import { ref } from 'vue'
import { onHide, onShow } from '@dcloudio/uni-app'

// 定义 props 接收数据
defineProps<{
  list: CategoryItem[]
}>()
const emit = defineEmits(['change'])

const { safeAreaInsets } = uni.getSystemInfoSync()

const activeIndex = ref(0)

const onClick = (val) => {
  activeIndex.value = val
  emit('change', activeIndex.value)
}
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <!-- 搜索条 -->
    <view class="search">
      <text class="icon-search">搜索商品</text>
      <text class="icon-scan"></text>
    </view>
    <scroll-view scroll-x>
      <view class="category">
        <view
          v-for="(item, index) in list"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex }"
          @tap="onClick(index)"
        >
          <image class="icon" :src="item.imgUrl" />
          <view class="name">{{ item.name }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
/* 自定义导航条 */
.navbar {
  background-image: url(@/static/images/navigator_bg.png);
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx 0 26rpx;
    width: 450rpx;
    height: 64rpx;
    margin: 10rpx 20rpx;
    color: #fff;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }
  .icon-scan {
    font-size: 30rpx;
    padding: 15rpx;
  }

  .category {
    width: 100%;
    display: flex;
    height: 180rpx;

    .item {
      flex: 1;
      font-size: 26rpx;
      color: #595c63;
      position: relative;
      margin: 15rpx;
      width: 120rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .icon {
        width: 100rpx;
        height: 100rpx;
      }

      .name {
        width: 120rpx;
        text-align: center;
        color: white;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    .active {
      //background-color: #fff;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        height: 8rpx;
        width: 100%;
        background-color: white;
      }

      .name {
        font-weight: bolder;
        font-size: 30rpx;
      }
    }
  }
}
</style>
