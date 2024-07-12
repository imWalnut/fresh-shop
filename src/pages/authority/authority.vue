<script setup lang="ts">
import {ref} from "vue";
import {addUserAddress, addUserAuthority, addUserInvitedBy} from "@/services/my";
import {useMemberStore} from "@/stores";
import type {AddressParams, AuthorityParams, InvitedParams} from "@/types/my";
const { safeAreaInsets } = uni.getSystemInfoSync()
const memberStore = useMemberStore()
const userInfo = memberStore.profile.userInfo

const formData = ref({
  name: '',
  sex: 0,
  shopName: '',
  images: [],
  inviteBy: '',
  region: [],
  phoneNumber: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  countyCode: '',
  countyName: '',
  address: '',
  lat: 0,
  lon: 0,
})
const rules = {
  // 对name字段进行必填验证
  name: {
    // name 字段的校验规则
    rules: [
      // 校验 name 不能为空
      {
        required: true,
        errorMessage: '请填写姓名',
      },
      // 对name字段进行长度验证
      {
        minLength: 3,
        maxLength: 5,
        errorMessage: '{label}长度在 {minLength} 到 {maxLength} 个字符',
      },
    ],
    // 当前表单域的字段中文名，可不填写
    label: '姓名',
    validateTrigger: 'blur',
  },
  inviteBy: { rules: [{ required: true, errorMessage: '请填写邀请人手机号' }] },
  phoneNumber: { rules: [{ required: true, errorMessage: '请填写收获手机号' }] },
  shopName: { rules: [{ required: true, errorMessage: '请填写门店名称' }] },
  region: { rules: [{ required: true, errorMessage: '请选择省市区' }] },
  address: { rules: [{ required: true, errorMessage: '请填写详细地址' }] },
}
const refForm = ref<UniHelper.UniFormsInstance>()

// 选择性别
const radioChange: UniHelper.RadioGroupOnChange = (event) => {
  formData.value.sex = event.detail.value
}

// 选择省市区
const onChangeRegion: UniHelper.RegionPickerOnChange = (event) => {
  formData.value.region = event.detail.value
  formData.value.provinceName = event.detail.value[0]
  formData.value.cityName = event.detail.value[1]
  formData.value.countyName = event.detail.value[2]
  formData.value.provinceCode = event.detail.code[0]
  formData.value.cityCode = event.detail.code[1]
  formData.value.countyCode = event.detail.code[2]
}

// 认证
const onAuthority = async () => {
  try {
    await refForm.value?.validate()
    const userId: number = userInfo.id
    const authority: AuthorityParams = {
      userId: userId,
      name: formData.value.name,
      sex: 0,
      shopName: formData.value.shopName,
      images: formData.value.images,
    }
    await addUserAuthority(authority)
    const address: AddressParams = {
      userId: userId,
      name: formData.value.name,
      sex: 0,
      phoneNumber: formData.value.phoneNumber,
      provinceCode: formData.value.provinceCode,
      provinceName: formData.value.provinceName,
      cityCode: formData.value.cityCode,
      cityName: formData.value.cityName,
      countyCode: formData.value.countyCode,
      countyName: formData.value.countyName,
      address: formData.value.address,
      lat: formData.value.lat,
      lon: formData.value.lon,
    }
    await addUserAddress(address)
    const invited: InvitedParams = {
      userId: userId,
      invitedBy: formData.value.inviteBy,
    }
    await addUserInvitedBy(invited)
    uni.showToast({
      icon: 'success',
      title: '认证成功',
    })
    setTimeout(() => {
      // 页面跳转
      uni.switchTab({ url: '/pages/my/my' })
    }, 500)
  } catch (err) {
    uni.showToast({
      icon: 'error',
      title: '请填写完整信息',
    })
  }
}
</script>

<template>
  <scroll-view scroll-y>
    <uni-forms ref="refForm" :modelValue="formData" :rules="rules" label-width="160rpx">
      <view class="panel">
        <view class="title">
          <text>邀请人</text>
        </view>
        <view class="content">
          <uni-forms-item label="邀请人" name="inviteBy">
            <uni-easyinput type="number" v-model="formData.inviteBy" placeholder="请填写邀请人手机号" />
          </uni-forms-item>
        </view>
      </view>
      <view class="panel">
        <view class="title">
          <text>基本信息</text>
        </view>
        <view class="content">
          <uni-forms-item label="姓名" name="name">
            <uni-easyinput type="text" v-model="formData.name" placeholder="请填写姓名" />
          </uni-forms-item>
          <uni-forms-item label="收货手机号" name="phoneNumber">
            <uni-easyinput type="text" v-model="formData.phoneNumber" placeholder="请填写收货手机号" />
          </uni-forms-item>
        </view>
      </view>
      <view class="panel">
        <view class="title">
          <text>门店信息</text>
        </view>
        <view class="content">
          <uni-forms-item label="门店名称" name="shopName">
            <uni-easyinput type="text" v-model="formData.shopName" placeholder="请填写门店名称" />
          </uni-forms-item>
          <uni-forms-item label="门店照片" name="images">
            <uni-file-picker
              v-model="formData.images"
              title="最多选择9张图片"
              file-mediatype="image"
              mode="grid"
              file-extname="png,jpg"
              :limit="9"
            />
          </uni-forms-item>
          <uni-forms-item label="省市区" name="region">
            <picker mode="region" :value="formData.region" @change="onChangeRegion">
              <view class="picker-region" v-if="formData.region.length">
                {{`${formData.region[0]}，${formData.region[1]}，${formData.region[2]}`}}
              </view>
              <view class="picker-region grey" v-else>
                请选择省市区
              </view>
            </picker>
          </uni-forms-item>
          <uni-forms-item label="详细地址" name="address">
            <uni-easyinput type="textarea" autoHeight v-model="formData.address" placeholder="请填写详细地址"></uni-easyinput>
          </uni-forms-item>
        </view>
      </view>
    </uni-forms>
  </scroll-view>
  <!-- 用户操作 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <button class="button phone" @tap="onAuthority">认证</button>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
  height: 100%;
  display: flex;
  flex-direction: column;
}

scroll-view {
  flex: 1;

  .uni-forms {
    padding: 20rpx 0 200rpx;

    .file-title {
      color: #909399;
    }

    .radio-group {
      display: flex;
      align-items: center;
      height: 100%;

      .radio-item {
        display: flex;
        align-items: center;

        view:first-child {
          margin-right: 10rpx;
        }
      }

      .radio-item+.radio-item {
        margin-left: 20rpx;
      }
    }

    picker {
      height: 100%;
    }

    .picker-region {
      display: flex;
      box-sizing: border-box;
      flex-direction: row;
      align-items: center;
      border: 1rpx solid #dcdfe6;
      border-radius: 10rpx;
      flex: 1;
      line-height: 1;
      font-size: 12px;
      height: 88rpx;
      padding-left: 20rpx;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}

.grey {
  color: #909399;
}

.input-slot {
  padding: 0 20rpx;
  color: #27ba9b;
  font-size: 30rpx;
  border-left: 1rpx #dcdfe6 solid;
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 888;
  background-color: #fff;
  height: 120rpx;
  padding: 0 20rpx var(--window-bottom);
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    color: #fff;
    background: #27ba9b;
  }
}

.panel {
  margin: 20rpx 40rpx;
  border-radius: 10rpx;
  background-color: #fff;
  padding: 0 20rpx 30rpx;
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
  }
  .content {
    padding-left: 16rpx;
    .uni-forms-item {
      margin-bottom: 0;
    }
    .uni-forms-item+.uni-forms-item {
      margin-top: 30rpx;
    }
  }
}
</style>
