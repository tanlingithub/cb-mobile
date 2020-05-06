<template>
  <div class="register-page">
    <div class="logo">
      <img src="../../static/login_banner.png" alt="专妍你的美丽" />
    </div>
    <!-- 注册表单 -->
    <div class="form-section">
      <van-cell-group class="row">
        <van-field :left-icon="userIcon" v-model="username" placeholder="账号" class="has-border" />
      </van-cell-group>
      <van-cell-group class="row">
        <van-field
          :left-icon="pwdIcon"
          v-model="password"
          placeholder="密码"
          type="password"
          class="has-border"
        />
      </van-cell-group>

      <!--      <van-cell-group>-->
      <!--        <van-checkbox v-model="remeber">记住用户</van-checkbox>-->
      <!--      </van-cell-group>-->

      <van-button class="login" :loading="loading" @click="submit">登录</van-button>
      <!--<p class="tip">未注册用户点击登录即注册</p>-->
    </div>
  </div>
</template>
<script>
import {Checkbox} from 'vant'
import {cellPhone} from '@levy9527/pattern-js'
import {login} from '@/const/api'
import {USER_TYPES} from '@/const/common'
import {mapState, mapMutations, mapActions} from 'vuex'
import cookie from 'js-cookie'
import {STORAGE_KEYS} from '@/const/common'
import userIcon from '../assets/userIcon.png'
import pwdIcon from '../assets/icon_lock.png'
console.log(userIcon)
export default {
  name: 'login-page',
  layout: 'blank',
  components: {
    'van-checkbox': Checkbox
  },
  head() {
    return {
      title: '登陆'
    }
  },
  data() {
    return {
      userIcon: userIcon,
      pwdIcon: pwdIcon,
      loading: false, // 注册请求中

      // 登录数据
      username: null,
      password: null,
      remeber: false,
    }
  },
  created() {
    // this.$store.commit('logout')
  },
  computed: {
    enableSubmit() {
      return this.username && this.password
    }
  },
  methods: {
    ...mapMutations('auth', ['setUserInfo']),
    /**
     * 注册
     */
    async submit() {
      this.loading = true
      try {
        const {success, payload} = await this.$axios.$post(login, {
          username: this.username,
          password: this.password
        })
        cookie.set('username', payload.nickName)
        cookie.set('role', payload.role)
        cookie.set('token', JSON.stringify(payload))
        this.setUserInfo(payload)
        this.redirect()
      } catch (e) {
        this.$toast.fail('登陆失败')
      } finally {
        this.loading = false
      }
    },

    /**
     * 注册成功后重定向到指定页面
     */
    redirect(payload) {
      const {redirectUri} = this.$route.query

      const redirectUrl = decodeURIComponent(redirectUri || '')
      location.replace(redirectUrl)
    }
  }
}
</script>
<style lang="less">
@import '~assets/var';

@radius-size: 4px;

.logo {
  img {
    width: 100%;
  }
}

.register-page {
  background-color: #fff;
  height: 100%;
  box-sizing: border-box; // IE-BOX

  .form-section {
    border-radius: @radius-size;
    text-align: left;
    margin: 40px auto 0;

    .has-border {
      border-bottom: 1px solid #f4c200;
    }

    // border修改
    .has-border::after,
    .van-cell-group::after {
      border: none;
    }

    .row {
      width: 80%;
      margin: 0 auto 10px;
    }

    .checkbox-wrap {
      display: flex;
      align-items: center;

      .protocol {
        color: #6495fe;
      }
    }

    .btn {
      width: 100%;
      height: 40px;
      line-height: 40px;
      margin-top: 10px;
      color: #fff;
      background-color: @primary-color;
      border-color: @primary-color;
      border-radius: @radius-size;
    }
  }

  .tip {
    margin-top: 10px;
    color: #ccc;
  }

  .login {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 20px 0px rgba(209, 161, 2, 0.27);
    border-radius: 30px;
    width: 80%;
    margin: 50px auto;
    display: block;
  }
}
</style>
