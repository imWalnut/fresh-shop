<script setup lang="ts">
// 获取屏幕边界到安全区域距离
import WalnutGuess from '@/components/WalnutGuess.vue'
import { useMemberStore } from '@/stores'
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getUserAuthorityStatus } from '@/services/my'
import {useGuessList} from "@/composables";
import {addCartsInfo} from "@/services/cart";
import type {CartParams} from "@/types/cart";

const { safeAreaInsets } = uni.getSystemInfoSync()
// 订单选项
const orderTypes = [
  { type: 1, text: '待付款', icon: 'icon-currency' },
  { type: 2, text: '待发货', icon: 'icon-gift' },
  { type: 3, text: '待收货', icon: 'icon-check' },
  { type: 4, text: '待评价', icon: 'icon-comment' },
]

// 获取会员信息
const memberStore = useMemberStore()
const userInfo = memberStore.profile?.userInfo
const authority = ref('未认证')
const popup = ref()
const localData = ref()
const isShowSku = ref(false)

// 判断认证状态
const getAuthorityStatus = async () => {
  if (memberStore.authorityStatus !== 2) {
    const status = await getUserAuthorityStatus(userInfo.id)
    useMemberStore().setAuthorityStatus(status)
    switch (status) {
      case 0:
        authority.value = '未认证'
        break
      case 1:
        authority.value = '认证待审核'
        break
      case 2:
        authority.value = '已认证'
        break
      case 3:
        authority.value = '认证已驳回'
        break
    }
  } else {
    authority.value = '已认证'
  }
}

// 跳转认证页
const goAuthority = () => {
  if (authority.value === 0) {
    uni.navigateTo({
      url: '/pages/authority/authority'
    })
  }
}

// 猜你喜欢组合式函数调用
const {refGuess, onScrollTolower} = useGuessList()

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

onShow(async () => {
  if (userInfo) {
    await getAuthorityStatus()
  }
})
</script>

<template>
  <scroll-view
    @scrolltolower="onScrollTolower"
    refresher-enabled
    class="viewport"
    scroll-y
    enable-back-to-top>
    <!-- 个人资料 -->
    <view class="profile" :style="{ paddingTop: safeAreaInsets!.top + 'px' }">
      <!-- 情况1：已登录 -->
      <view class="overview" v-if="userInfo">
        <navigator url="/pagesMember/profile/profile" hover-class="none">
          <image
            class="avatar"
            mode="aspectFill"
            src="https://oss.aliyuncs.com/aliyun_id_photo_bucket/default_handsome.jpg"
          ></image>
        </navigator>
        <view class="meta">
          <view class="nickname">{{ userInfo?.userName }}</view>
          <view class="role-tag" @tap="goAuthority">{{ authority }}</view>
        </view>
      </view>
      <!-- 情况2：未登录 -->
      <view class="overview" v-else>
        <navigator url="/pages/login/login" hover-class="none">
          <image
            class="avatar gray"
            mode="aspectFill"
            src="http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/picture/2021-04-06/db628d42-88a7-46e7-abb8-659448c33081.png"
          ></image>
        </navigator>
        <view class="meta">
          <navigator url="/pages/login/login" hover-class="none" class="nickname">
            未登录
          </navigator>
          <view class="extra">
            <text class="tips">点击登录账号</text>
          </view>
        </view>
      </view>
      <navigator
        v-if="userInfo"
        class="settings"
        url="/pagesMember/settings/settings"
        hover-class="none"
      >
        设置
      </navigator>
    </view>
    <!-- 我的订单 -->
    <view class="orders">
      <view class="title">
        我的订单
        <navigator class="navigator" url="/pagesOrder/list/list?type=0" hover-class="none">
          查看全部订单<text class="icon-right"></text>
        </navigator>
      </view>
      <view class="section">
        <!-- 订单 -->
        <navigator
          v-for="item in orderTypes"
          :key="item.type"
          :class="item.icon"
          :url="`/pagesOrder/list/list?type=${item.type}`"
          class="navigator"
          hover-class="none"
        >
          {{ item.text }}
        </navigator>
        <!-- 客服 -->
        <button class="contact icon-handset" open-type="contact">售后</button>
      </view>
    </view>
    <!-- 猜你喜欢 -->
    <view class="guess">
      <WalnutGuess ref="refGuess" @open="onOpenPopup" />
    </view>
  </scroll-view>
  <!-- uni-ui 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff" @change="changePopup">
    <WalnutShop v-if="isShowSku" :localData="localData" @close="popup.close()" />
  </uni-popup>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f7f7f8;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}

.viewport {
  height: 100%;
  background-repeat: no-repeat;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/center_bg.png);
  background-size: 100% auto;
}

/* 用户信息 */
.profile {
  margin-top: 20rpx;
  position: relative;

  .overview {
    display: flex;
    height: 120rpx;
    padding: 0 36rpx;
    color: #fff;
  }

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .gray {
    filter: grayscale(100%);
  }

  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    line-height: 30rpx;
    padding: 16rpx 0;
    margin-left: 20rpx;
  }

  .nickname {
    max-width: 350rpx;
    margin-bottom: 16rpx;
    font-size: 32rpx;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .extra {
    display: flex;
    font-size: 20rpx;
  }

  .tips {
    font-size: 22rpx;
  }

  .settings {
    position: absolute;
    bottom: 0;
    right: 40rpx;
    font-size: 30rpx;
    color: #fff;
  }
}

/* 我的订单 */
.orders {
  position: relative;
  z-index: 99;
  padding: 30rpx;
  margin: 50rpx 20rpx 0;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);

  .title {
    height: 40rpx;
    line-height: 40rpx;
    font-size: 28rpx;
    color: #1e1e1e;

    .navigator {
      font-size: 24rpx;
      color: #939393;
      float: right;
    }
  }

  .section {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 40rpx 20rpx 10rpx;
    .navigator,
    .contact {
      text-align: center;
      font-size: 24rpx;
      color: #333;
      &::before {
        display: block;
        font-size: 60rpx;
        color: #ff9545;
      }
    }
    .contact {
      padding: 0;
      margin: 0;
      border: 0;
      background-color: transparent;
      line-height: inherit;
    }
  }
}

/* 猜你喜欢 */
.guess {
  background-color: #f7f7f8;
  margin-top: 20rpx;
}

.role-tag {
  padding: 5rpx 10rpx;
  border: 1rpx white solid;
  font-size: 24rpx;
}
</style>
