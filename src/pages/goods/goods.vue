<script setup lang="ts">
// 获取屏幕边界到安全区域距离
import { getProductDetailAPI } from '@/services/goods'
import { onLoad } from '@dcloudio/uni-app'
import type { ProductDetailItem } from '@/types/goods'
import { ref } from 'vue'
import type { GuessProductItem, GuessProductSpecItem } from '@/types/home'
import ServicePanel from '@/pages/goods/components/ServicePanel.vue'

const { safeAreaInsets } = uni.getSystemInfoSync()

const props = defineProps<{
  id: number
}>()

// uni-ui 弹出层组件 ref
const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

// 弹出层条件渲染
const popupName = ref<'service'>()
const openPopup = (name: typeof popupName.value) => {
  // 修改弹出层名称
  popupName.value = name
  // 打开弹出层
  popup.value?.open()
}

const detail = ref<ProductDetailItem>()
const soldAmount = ref(0)
const currentIndex = ref(0)
const specIndex = ref(0)
const price = ref(0)
const similar = ref([])

// 获取商品详情
const getProductDetailData = async () => {
  const res = await getProductDetailAPI(props.id)
  detail.value = res.data.productInfo
  price.value = detail.value!.productSpecs[specIndex.value].price
  const products = res.data.similarProducts.map((item: GuessProductItem) => {
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
  similar.value.push(...products)
  soldAmount.value =
    res.data.productInfo.soldAmount < 50
      ? 50 + Math.floor(Math.random() * 90)
      : res.data.productInfo.soldAmount
}

// 轮播图
const onChange: UniHelper.SwiperOnChange = (event) => {
  currentIndex.value = event.detail!.current
}

// 预览图片
const onTapImage = (url: string) => {
  // 大图预览
  uni.previewImage({
    current: url,
    urls: detail.value!.subImages,
  })
}

// 切换规格
const onTapSpec = (index) => {
  specIndex.value = index
  price.value = detail.value!.productSpecs[index].price
}

onLoad(() => {
  getProductDetailData()
})
</script>

<template>
  <scroll-view scroll-y class="viewport">
    <view style="padding-bottom: 200rpx">
      <!-- 基本信息 -->
      <view class="goods">
        <!-- 商品主图 -->
        <view class="preview">
          <swiper @change="onChange" circular :autoplay="true" :interval="3000">
            <swiper-item v-for="item in detail?.subImages" :key="item" @tap="onTapImage(item)">
              <image mode="aspectFill" :src="item" />
            </swiper-item>
          </swiper>
          <view class="indicator">
            <text class="current">{{ currentIndex + 1 }}</text>
            <text class="split">/</text>
            <text class="total">{{ detail?.subImages.length }}</text>
          </view>
        </view>

        <!-- 商品简介 -->
        <view class="meta">
          <view class="name ellipsis">{{ detail?.name }}</view>
          <view class="price">
            <view>
              <text class="symbol">¥</text>
              <text class="number">{{ price }}</text>
            </view>
            <view class="desc">月售{{ soldAmount }}</view>
          </view>
        </view>

        <!-- 操作面板 -->
        <view class="action">
          <view class="item">
            <text class="label">规格</text>
            <scroll-view scroll-x>
              <view class="specs">
                <view
                  class="specs-item"
                  v-for="(value, index) in detail?.productSpecs"
                  @tap="onTapSpec(index)"
                  :class="{ active: index === specIndex }"
                  :key="index"
                >
                  <view class="text spec-label">
                    {{ `${value.quantity}${value.specName}` }}
                  </view>
                  <view class="text">
                    {{ `¥${value.price / value.quantity}/${value.specName}` }}
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
          <view class="item arrow" @tap="openPopup('service')">
            <text class="label">服务</text>
            <text class="text ellipsis">18小时售后</text>
          </view>
        </view>
      </view>

      <!-- 商品详情 -->
      <view class="detail panel">
        <view class="title">
          <text>详情</text>
        </view>
        <view class="content">
          <view class="properties">
            <!-- 属性详情 -->
            <view class="item border">
              <text class="label">商品编号</text>
              <text class="value">{{ detail?.productCode }}</text>
            </view>
            <view class="item border">
              <text class="label">商品分类</text>
              <text class="value">{{ detail?.category.name }}</text>
            </view>
            <view class="item">
              <text class="label">商品描述</text>
              <text class="value">{{ detail?.remark }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 同类推荐 -->
      <view class="similar panel" v-if="similar.length">
        <view class="title">
          <text>同类推荐</text>
        </view>
        <view class="content">
          <navigator
            v-for="item in similar"
            :key="item.id"
            class="goods"
            hover-class="none"
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
              <uni-icons type="cart" class="shop-icon" color="white" />
            </view>
          </navigator>
        </view>
      </view>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button"><text class="icon-heart"></text>收藏</button>
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>客服
      </button>
      <navigator class="icons-button" url="/pages/cart/cart" open-type="switchTab">
        <text class="icon-cart"></text>购物车
      </navigator>
    </view>
    <view class="buttons">
      <view class="addcart"> 加入购物车 </view>
    </view>
  </view>
  <!-- uni-ui 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <ServicePanel v-if="popupName === 'service'" @close="popup?.close()" />
  </uni-popup>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewport {
  background-color: #f4f4f4;
}

.panel {
  margin: 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 6rpx;
    position: relative;
    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      border-left: 4rpx solid #27ba9b;
    }
    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.goods {
  background-color: #f4f4f4;
  .preview {
    height: 650rpx;
    position: relative;
    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      line-height: 40rpx;
      border-radius: 30rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;
      .current {
        font-size: 26rpx;
      }
      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }
      .total {
        font-size: 24rpx;
      }
    }
  }
  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;
    margin-top: 20rpx;
    padding-top: 10rpx;
    background: white;
    .price {
      padding: 0 30rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #cf4444;
      font-weight: bolder;
    }
    .number {
      font-size: 48rpx;
    }
    .name {
      max-height: 88rpx;
      line-height: 1.4;
      margin: 20rpx;
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
    }
    .desc {
      line-height: 1;
      font-size: 24rpx;
      color: #898b94;
      font-weight: normal;
    }
  }
  .action {
    padding-left: 20rpx;
    background: white;
    .item {
      height: 100rpx;
      padding-right: 60rpx;
      border-bottom: 1rpx solid #eaeaea;
      font-size: 26rpx;
      color: #333;
      position: relative;
      display: flex;
      align-items: center;
      &:last-child {
        border-bottom: 0 none;
      }
      scroll-view {
        height: 100%;
      }

      .specs {
        height: 100%;
        display: flex;
        align-items: center;

        .specs-item {
          border: 1rpx solid #eaeaea;
          border-radius: 10rpx;
          padding: 4rpx 15rpx;
          width: 200rpx;
          flex-shrink: 0;

          .text {
            line-height: 30rpx;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .spec-label {
            margin-bottom: 10rpx;
            font-size: 28rpx;
            font-weight: bold;
          }
        }
        .specs-item + .specs-item {
          margin-left: 10rpx;
        }
        .active {
          border: 1rpx solid #35c8a9;
          color: #35c8a9;
        }
      }
    }
    .label {
      width: 60rpx;
      color: #898b94;
      margin: 0 16rpx 0 10rpx;
    }
    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;
  .content {
    margin-left: -20rpx;
    .image {
      width: 100%;
    }
  }
  .properties {
    padding: 0 20rpx 20rpx 20rpx;
    margin-bottom: 30rpx;
    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
    }
    .border {
      border-bottom: 1rpx dashed #ccc;
    }
    .label {
      width: 200rpx;
    }
    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  .title {
    padding-left: 20rpx;
  }
  .content {
    background-color: #f4f4f4;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .goods {
      width: 340rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 7rpx;
      border-radius: 10rpx;
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
      width: 300rpx;
      height: 260rpx;
    }
    .number {
      font-size: 26rpx;
      margin-left: 2rpx;
    }
  }
  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx var(--window-bottom);
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
  .buttons {
    display: flex;
    & > view {
      width: 220rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
    }
    .addcart {
      background-color: #27ba9b;
      font-weight: bold;
      font-size: 30rpx;
    }
  }
  .icons {
    padding-right: 10rpx;
    display: flex;
    align-items: center;
    width: 280rpx;
    .icons-button {
      flex: 1;
      text-align: center;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #333;
      background-color: #fff;
      &::after {
        border: none;
      }
    }
    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>
