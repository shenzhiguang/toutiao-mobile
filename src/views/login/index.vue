<template>
    <div class="login-container">
      <van-nav-bar
        class="app-top"
        title="登录/注册"
        left-arrow
        @click-left="$router.back()"
      />

      <!-- 登录表单 -->
      <van-form
        validate-first
        :show-error="false"
        :show-error-message="false"
        @submit="onlogin"
        @failed="onFailed">
        <van-field
          v-model="user.mobile"
          icon-prefix="toutiao"
          left-icon="shouji"
          placeholder="请输入手机号"
          :rules="userFormRules.mobile"
        />
        <van-field
          v-model="user.code"
          clearable
          icon-prefix="toutiao"
          left-icon="yanzhengma"
          placeholder="请输入验证码"
          :rules="userFormRules.code"
        >
          <template #button>
            <van-button class="send-btn" size="mini" round>发送验证码</van-button>
          </template>
        </van-field>
        <div class="login-btn-wrap">
          <van-button
            class="login-btn"
            type="primary"
            block
            native-type="submit"
            >登录</van-button>
        </div>
      </van-form>
      <!-- /登录表单 -->
    </div>
</template>

<script>
import { login } from '@/api/user'
import { Toast } from 'vant'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      }
    }
  },
  methods: {
    // 登录提交
    async onlogin () {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const res = await login(this.user)
        console.log(res)
        Toast.success('登录成功')
      } catch (err) {
        Toast.fail('登录失败，手机号或验证码错误')
        console.log(err)
        console.log('登录失败', err)
      }
    },
    // 验证失败
    onFailed (err) {
      Toast({
        message: err.errors[0].message,
        position: 'top'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
