// ServicePanel.vue
<script setup lang="ts">
import {ref} from "vue";
import {useMemberStore} from "@/stores";
import type {CartParams} from "@/types/cart";
import {addCartsInfo} from "@/services/cart";

const props = defineProps<{
  localData: any
}>()
// 子调父
const emit = defineEmits<{
  (event: 'close'): void
}>()

const memberStore = useMemberStore()
const specIndex = ref(0)
const quantity = ref(1)
const max = ref(Math.floor(props.localData.stockAmount / props.localData.productSpecs[0].quantity))

// 切换规格
const onTapSpec = (index) => {
  specIndex.value = index
  quantity.value = 1
  max.value = Math.floor(props.localData.stockAmount / props.localData.productSpecs[index].quantity)
}

// 更改数量
const changeValue: UniHelper.UniNumberBoxOnChange = (value) => {
  if (value <= max.value) {
    quantity.value = value
  } else {
    quantity.value = max.value
  }
}

// 加入购物车
const onTapCart = async () => {
  const body: CartParams = {
    userId: memberStore.profile.id,
    quantity: quantity.value,
    productSpecId: props.localData.productSpecs[specIndex.value].id,
    totalPrice: props.localData.productSpecs[specIndex.value].price * quantity.value,
  }
  await addCartsInfo(body)
}
</script>

<template>
  <view class="walnut-shop">
    <!-- 关闭按钮 -->
    <text class="close icon-close" @tap="emit('close')"></text>
    <!-- 内容 -->
    <view class="content">
      <view class="title">
        <image :src="localData.mainImage" class="image" />
        <view class="title-main">
          <view class="name">
            <text>{{localData.name}}</text>
          </view>
          <view class="price">
            <text>¥</text>
            <text>{{localData.productSpecs[specIndex].price}}</text>
          </view>
          <view class="stock">
            <text>{{`库存：${localData.stockAmount}${localData.productSpecs[specIndex].specName}`}}</text>
          </view>
        </view>
      </view>
      <view class="spec">
        <view class="title">
          规格
        </view>
        <view class="spec-content">
          <view
            class="spec-item"
            :class="{ active: index === specIndex }"
            @tap="onTapSpec(index)"
            v-for="(item, index) in localData.productSpecs"
            :key="item.id">
            <view class="spec-label">
              {{`${item.quantity}${item.specName}`}}
            </view>
            <view>
              {{`¥${item.price / item.quantity}/${item.specName}`}}
            </view>
          </view>
        </view>
      </view>
      <view class="quantity">
        <view class="title">
          数量
        </view>
        <uni-number-box :min="1" :max="max" :value="quantity" @change="changeValue" />
      </view>
      <view class="addCart" @tap="onTapCart">加入购物车</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.walnut-shop {
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
}

.close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
}

.content {
  padding: 20rpx;
  .title {
    display: flex;
    .image {
      width: 180rpx;
      height: 180rpx;
      background-color: #f7f7f8;
      flex-shrink: 0;
    }
    .title-main {
      margin-left: 30rpx;
      height: 180rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .name {
        font-size: 34rpx;
      }
      .price {
        color: #cf4444;
        text:first-child {
          font-size: 30rpx;
          margin-right: 10rpx;
        }
        text:last-child {
          font-size: 52rpx;
        }
      }
      .stock {
        color: #666;
        font-size: 26rpx;
      }
    }
  }
  .spec {
    margin-top: 20rpx;
    .title {
      color: #666;
      font-size: 32rpx;
    }
    .spec-content {
      display: flex;
      flex-wrap: wrap;
      margin-top: 15rpx;
      .spec-item {
        border: 1rpx solid #eaeaea;
        border-radius: 10rpx;
        padding: 4rpx 15rpx;
        width: 200rpx;
        flex-shrink: 0;
        font-size: 26rpx;
        margin: 0 15rpx 15rpx 0;
        color: #333;
        line-height: 30rpx;
        .spec-label {
          margin-bottom: 10rpx;
          font-weight: bold;
        }
        view {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      .active {
        border: 1rpx solid #35c8a9;
        color: #35c8a9;
      }
    }
  }
  .quantity {
    margin-top: 50rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 34rpx;
    }
  }
  .addCart {
    margin-top: 40rpx;
    text-align: center;
    border-radius: 72rpx;
    line-height: 72rpx;
    background-color: #27ba9b;
    font-weight: bold;
    font-size: 32rpx;
    color: white;
  }
}
</style>
