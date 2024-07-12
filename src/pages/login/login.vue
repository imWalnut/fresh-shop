<script setup lang="ts">
import CustomNavbar from "@/pages/login/components/CustomNavbar.vue";
import { onLoad } from '@dcloudio/uni-app'
import { signIn } from "@/services/auth";
import type {SignInItem} from "@/types/auth";
import {useMemberStore} from "@/stores";

// 获取 code 登录凭证
let code = ''

onLoad(async () => {
  const res = await wx.login()
  code = res.code
})

// 获取用户手机号码
const onGetPhoneNumber: UniHelper.ButtonOnGetphonenumber = async (ev) => {
  // 获取参数
  const encryptedData = ev.detail.encryptedData!
  const iv = ev.detail.iv!
  // 登录请求
  const res = await signIn({ code, encryptedData, iv })
  loginSuccess(res.data)
}

const loginSuccess = (profile: SignInItem) => {
  // 保存会员信息
  const memberStore = useMemberStore()
  memberStore.setProfile(profile)
  let status = 0
  if (profile.userInfo.authority.length) {
    status = profile.userInfo.authority.status + 1
  }
  memberStore.setAuthorityStatus(status)
  // 成功提示
  uni.showToast({ icon: 'success', title: '登录成功' })
  setTimeout(() => {
    // 页面跳转
    uni.switchTab({ url: '/pages/my/my' })
  }, 500)
}
</script>

<template>
  <CustomNavbar />
  <view class="viewport">
    <view class="logo">
      <image
        src="https://oss.qishionline.com/286601/image/2024/05/4733e691b69dcf1f12e02e9074b33d6e.jpg"
      ></image>
    </view>
    <view class="login">
      <!-- 小程序端授权登录 -->
      <button class="button phone" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
        <text class="icon icon-phone"></text>
        手机号快捷登录
      </button>
<!--      <view class="extra">-->
<!--        <view class="caption">-->
<!--          <text>其他登录方式</text>-->
<!--        </view>-->
<!--        <view class="options">-->
<!--          &lt;!&ndash; 账号秘密登录 &ndash;&gt;-->
<!--          <button>-->
<!--            <text class="icon icon-phone">手机号登录</text>-->
<!--          </button>-->
<!--        </view>-->
<!--      </view>-->
      <view class="tips">登录/注册即视为你同意《服务条款》和《好特购隐私协议》</view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.viewport {
  flex: 1;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.logo {
  flex: 1;
  text-align: center;

  image {
    width: 400rpx;
    height: 400rpx;
    margin-top: 8vh;
  }
}

.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
  padding: 30rpx 20rpx 20rpx;

  .input {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    border: 1px solid #ddd;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    color: #fff;

    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  .phone {
    background-color: #28bb9c;
  }

  .wechat {
    background-color: #06c05f;
  }

  .register {
    margin-top: 20rpx;
    color: #909399;
  }

  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;

    .caption {
      width: 440rpx;
      line-height: 1;
      border-top: 1rpx solid #ddd;
      font-size: 26rpx;
      color: #999;
      position: relative;

      text {
        transform: translate(-40%);
        background-color: #fff;
        position: absolute;
        top: -12rpx;
        left: 50%;
      }
    }

    .options {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 70rpx;

      button {
        padding: 0;
        background-color: transparent;
      }
    }

    .icon {
      font-size: 24rpx;
      color: #444;
      display: flex;
      flex-direction: column;
      align-items: center;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444;
        border-radius: 50%;
      }
    }

    .icon-weixin::before {
      border-color: #06c05f;
      color: #06c05f;
    }
  }
}

.tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
}
</style>
