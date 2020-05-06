<template>
  <div class="header-nav-bar">
    <van-nav-bar
      :left-text="leftText"
      :right-text="rightText"
      :left-arrow="!!leftText"
      @click-left="goBack"
      @click-right="onsubmit"
      fixed
    >
      <h1 slot="title" class="title">
        {{ title }}
      </h1>
    </van-nav-bar>
  </div>
</template>

<script>
import {NavBar} from 'vant'
import {INDEX} from '@/const/path.js'
export default {
  name: 'header-nav-bar',
  components: {
    'van-nav-bar': NavBar
  },
  props: {
    title: {
      default: '',
      type: String
    },
    rightText: {
      default: '',
      type: String
    },
		leftText: {
      default: '返回',
      type: String
    }
  },
  methods: {
    goBack() {
      history.length > 1 ? this.$router.back() : this.$router.push(INDEX)
    },
    /**
     * 提交
     */
    onsubmit() {
      this.$emit('onsubmit')
    }
  }
}
</script>

<style lang="less">
@import '~assets/var';

.header-nav-bar {
  position: relative;
  z-index: 100;
  height: @nav-height;

  .van-nav-bar {
    height: @nav-height;
    line-height: @nav-height;
    background-color: @primary-color;

    .van-icon {
      color: @white;
    }

    &::after {
      border: none;
    }
  }

  .van-nav-bar__text {
    color: @white;

    &:active {
      background: transparent;
    }
  }

  .van-nav-bar--fixed {
    position: fixed;
  }
}

.title {
  color: #fff;
}
</style>
