<template>
  <div class="index">

    <div class="top-header">
      Cabbeen
    </div>
    <div class="blank-letter">
      <!-- <img src="../assets/banner .png" alt="" /> -->
    </div>
    <div class="menu-panel">
      <div class="applications-often">
        常用应用
      </div>
      <div class="background-line"></div>
      <div class="application-table">
        <div class="apply-store" @click="gotoApply('apply')">
          <img src="../assets/icon_store.png" alt="" />
          <div class="app-text">{{ applyText }}</div>
          <!-- <span class="app-construct">一段简单的描述</span> -->
        </div>
        <div class="apply-store" @click="gotoApply('applyList')">
          <img src="../assets/icon_task.png" alt="" />
          <div class="app-text">{{ applyList }}</div>
          <!-- <span class="app-construct">一段简单的描述</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import cookie from 'js-cookie'

export default {
  layout: 'layout-with-footer',
  components: {},
  head() {
    return {
      title: 'CABBEEN'
    }
  },
  data() {
    return {
      applyText:'待我审批',
      applyList:'待我处理'
    }
  },
  filters: {},
  mounted() {
    if(cookie.get('role')=='jxs'){
      this.applyText = '开店申请'
      this.applyList = '我发起的'
    }
  },
  computed: {},
  watch: {},
  methods: {
    //$router.push('/apply')
    gotoApply(type){
      if(cookie.get('role')=='jxs'){
        if(type == 'apply'){
          this.$router.push({
            path: '/apply',
            query: {
							keepAlive: true
            }
          })
        }else if(type == 'applyList'){
          this.$router.push({
            path:'/applyList',
            query: {id: 0}
          })
        }
      }else{
        if(type == 'apply'){
          //待审批
          this.$router.push({
            path:'/applyList',
            query: {id: 1}
          })
        }else if(type == 'applyList'){
          //待处理
          this.$router.push({
            path:'/applyList',
            query: {id: 2}
          })
        }
      }
    }
  }
}
</script>

<style lang="less">
.index {
  .top-header {
    font-size: 19px;
    padding: 10px 10px;
    text-align: center;
    color: #000;
    font-weight: bold;
  }

  .blank-letter {
    background-image: url('../../static/banner.png');
    background-size: 100% 100%;
    width: 100%;
    height: 234px;

    img {
      width: 100%;
      height: 234px;
    }
  }

  .menu-panel {
    position: absolute;
    top: 39%;
    width: 100%;
    height: 356px;
    background: rgba(255, 255, 255, 1);
    border-radius: 28px 28px 0 0;

    .applications-often {
      margin-top: 30px;
      font-size: 26px;
      font-weight: bold;
      margin-left: 20px;
    }

    .application-table {
      display: flex;
      // margin-left: 40px;

      margin-top: 20px;

      .apply-store {
        text-align: center;
        width: 44%;
        height: 150px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 4px 50px 0 rgba(0, 0, 0, 0.08);
        border-radius: 20px;
        margin-left: 17px;

        img {
          width: 60px;
          height: 60px;
          margin: 31px 0 0 0;
        }

        .app-text {
          font-size: 20px;
          font-weight: 600;
          // margin-left: 20px;
        }

        .app-construct {
          color: rgb(130, 130, 130);
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
