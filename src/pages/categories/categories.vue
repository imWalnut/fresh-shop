<script setup lang="ts">
import { ref, watch } from 'vue'
import { getCategoryList, getCategoryProductAPI } from '@/services/category'
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from '@/pages/categories/components/CustomNavbar.vue'
import type { CategoryItem, GuessProductItem, GuessProductSpecItem } from '@/types/home'
import type { PageProductParams } from '@/types/category'

// 定义 props 接收数据
const props = defineProps<{
  index: number
}>()

const activeIndex = ref(0)
const categoryList = ref<CategoryItem[]>([])
const subCategoryList = ref<CategoryItem[]>([])
// const bannerList = ref<BannerItem[]>([])
const productList = ref([])
const pageParams: Required<PageProductParams> = {
  currentPage: 1,
  pageSize: 10,
  categoryId: 0,
}
const finish = ref(false)

// 提取一级分类数据
const getCategoryTopData = async () => {
  const res = await getCategoryList()
  categoryList.value = res.data
  await onChangeTopCategory(props.index)
}

// 切换一级分类
const onChangeTopCategory = (val) => {
  reset()
  activeIndex.value = 0
  subCategoryList.value = categoryList.value[val]?.child || []
  getCategoryProductData()
}

// 获取轮播图数据
// const getCategoryBannerData = async () => {
//   const res = await getCategoryBannerAPI(1)
//   bannerList.value = res.data
// }

// 获取商品数据
const getCategoryProductData = async () => {
  if (finish.value) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  pageParams.categoryId = subCategoryList.value[activeIndex.value].id
  const res = await getCategoryProductAPI(pageParams)
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
  if (pageParams.currentPage < res.data.totalPages) {
    pageParams.currentPage++
  } else {
    finish.value = true
  }
}

const reset = () => {
  finish.value = false
  productList.value = []
  pageParams.currentPage = 1
  pageParams.categoryId = 0
}

watch(activeIndex, (newVal, oldValue) => {
  reset()
  getCategoryProductData()
})
onLoad(() => {
  getCategoryTopData()
  // getCategoryBannerData()
})
</script>

<template>
  <view class="viewport">
    <!--  自定义导航栏-->
    <CustomNavbar :index="index" :list="categoryList" @change="onChangeTopCategory" />
    <!-- 分类 -->
    <view class="categories">
      <!-- 左侧：一级分类 -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in subCategoryList"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex }"
          @tap="activeIndex = index"
        >
          <text class="name">{{ item.name }}</text>
        </view>
      </scroll-view>
      <!-- 右侧：二级分类 -->
      <scroll-view class="secondary" @scrolltolower="getCategoryProductData" scroll-y>
        <!-- 焦点图 -->
        <!--        <WalnutSwiper class="banner" :list="bannerList" />-->
        <!-- 内容区域 -->
        <view class="products">
          <navigator
            class="products-item"
            v-for="item in productList"
            :key="item.id"
            :url="`/pages/goods/goods?id=${item.id}`"
          >
            <image class="image" mode="aspectFill" :src="item.mainImage"></image>
            <view class="item-main">
              <view class="title">
                <view class="name">{{ item.name }}</view>
                <view class="specs">
                  <view class="specs-item" v-for="spec in item.productSpecs" :key="spec.id">
                    {{ spec.quantity + spec.specName }}
                  </view>
                </view>
              </view>
              <view class="bottom">
                <view class="price">
                  <text class="price-icon">¥</text>
                  <text>{{ item.price }}</text>
                  <text class="price-icon">/{{ item.productSpecs[0].specName }}</text>
                </view>
                <uni-icons type="cart" class="shop-icon" color="white" />
              </view>
            </view>
          </navigator>
        </view>
        <view class="loading-text">
          {{ finish ? '没有更多数据~' : '正在加载...' }}
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 分类 */
.categories {
  flex: 1;
  min-height: 400rpx;
  display: flex;
}

/* 一级分类 */
.primary {
  overflow: hidden;
  width: 180rpx;
  flex: none;
  background-color: #f6f6f6;

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96rpx;
    font-size: 26rpx;
    color: #595c63;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 42rpx;
      bottom: 0;
      width: 96rpx;
      border-top: 1rpx solid #e3e4e7;
    }
  }

  .active {
    background-color: #fff;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 8rpx;
      height: 100%;
      background-color: #27ba9b;
    }
  }
}

.primary .item:last-child::after,
.primary .active::after {
  display: none;
}

/* 二级分类 */
.secondary {
  background-color: #fff;

  .carousel {
    height: 200rpx;
    margin: 0 30rpx 20rpx;
    border-radius: 4rpx;
    overflow: hidden;
  }

  .products {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 20rpx;
    navigator {
      width: 100%;
    }
    .products-item {
      padding: 24rpx 20rpx 20rpx;
      margin-bottom: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      display: flex;
      align-items: center;
    }
    .image {
      width: 200rpx;
      height: 200rpx;
      flex-shrink: 0;
    }
    .item-main {
      width: calc(100% - 200rpx);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        .name {
          margin: 10rpx 0;
          font-size: 30rpx;
          font-weight: bold;
          color: #262626;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .specs {
          display: flex;
          font-size: 26rpx;
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
      }
      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .price {
          padding-top: 4rpx;
          color: #cf4444;
          font-size: 40rpx;
          .price-icon {
            font-size: 70%;
            margin-right: 8rpx;
          }
        }
        .shop-icon {
          width: 45rpx;
          height: 45rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #27ba9b;
          border-radius: 50%;
          overflow: hidden;
          .uni-icons {
            font-size: 34rpx;
          }
        }
      }
    }
  }
  // 加载提示文字
  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
