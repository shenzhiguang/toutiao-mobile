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
        ref="loginFormRef"
        :show-error="false"
        :show-error-message="false"
        @submit="onlogin"
        @failed="onFailed">
        <van-field
          v-model="user.mobile"
          icon-prefix="toutiao"
          left-icon="shouji"
          center
          name="mobile"
          placeholder="请输入手机号"
          :rules="userFormRules.mobile"
        />
        <van-field
          v-model="user.code"
          clearable
          icon-prefix="toutiao"
          left-icon="yanzhengma"
          center
          name="code"
          placeholder="请输入验证码"
          :rules="userFormRules.code"
        >
          <template #button>
            <van-count-down
              v-if="countDownOrSendSms"
              :time="1000 * 60"
              format="ss s"
              @finish="countDownOrSendSms = false"
              />
            <van-button
              v-else
              class="send-btn"
              size="mini"
              round
              :loading="isloading"
              @click.prevent="onSendSms"
            >发送验证码</van-button>
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
import { login, sendSms } from '@/api/user'
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
      },
      // 控制发送验证码和倒计时的显示
      countDownOrSendSms: false,
      // 控制发送验证码的 loading 的显示
      isloading: false
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
        const { data: res } = await login(this.user)
        console.log(res)
        this.$store.commit('setUser', res.data)
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
    },
    // 发送验证码
    async onSendSms () {
      try {
        // 先验证手机号
        await this.$refs.loginFormRef.validate('mobile')
        // 验证通过，发送验证码
        // 显示 loading ，防止网络过慢，用户多次点击导致多次发送请求
        this.isloading = true
        const res = await sendSms(this.user.mobile)
        console.log(res)
        // 显示倒计时
        this.countDownOrSendSms = true
      } catch (err) {
        let message = ''
        if (err && err.resposne && err.respsone.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        Toast({
          message,
          position: 'top'
        })
      }
      // 无论成功与否，都要关闭 loading
      this.isloading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .van-cell {
    height: 46px;
  }
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
