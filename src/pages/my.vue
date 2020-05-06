<template>
  <div class="register-page">
    <div class="logo">
      <img src="../../static/login_banner.png" alt="专妍你的美丽" />
    </div>
      <van-button
        class="login"
        @click="logout"
        >退出登录</van-button
      >
  </div>
</template>
<script>
import cookie from 'js-cookie'
export default {
  name: 'login-page',
  layout: 'blank',
  components: {
  },
  head() {
    return {
      title: '我的'
    }
  },
  data() {
    return {

    }
  },
  created() {
  },
  computed: {

  },
  methods: {
		logout(){
			cookie.set('token', '')
      this.$router.replace('/')
    }
  }
}
</script>
<style lang="less">
@import '~assets/var';

@radius-size: 4px;

.logo {

  img{
    width: 100%;
  }
}

.register-page {
  background-color: #fff;
  height: 100%;
  box-sizing: border-box; // IE-BOX
  .login{
    background:rgba(255,255,255,1);
    box-shadow:0px 4px 20px 0px rgba(209, 161, 2, 0.27);
    border-radius:30px;
    width: 80%;
    margin: 50px auto;
    display: block;
  }
}
</style>
