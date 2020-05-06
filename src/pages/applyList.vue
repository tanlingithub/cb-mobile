<template>
  <div class="index">
    <van-nav-bar :title="handleTitle" left-text left-arrow @click-left="onClickLeft" />
    <div class="search-bar">
      <!-- <van-search placeholder="搜索" v-model="value" /> -->
      <div class="search-box">
        <van-icon name="search" />
        <span>搜索</span>
      </div>
      <van-icon name="filter-o" />
      <span style="font-size:20px;">筛选</span>
    </div>
    <van-divider />
    <div
      class="apply-list"
      v-for="(item, index) in applyList"
      :key="index"
      @click="goChannelDetail(item._id,item.status,item.currentIndex, item.step,index,item)"
    >
      <van-row>
        <van-col span="3">
          <!-- <span class="left-circle"></span> -->
          <img :src="avatar" alt class="role-header" />
        </van-col>
        <van-col span="21" offset="0">
          <div class="apply-detail">
            <div class="apply-man">
              <!--              {{ item.role | handleNickName }}-->
              <span class="man-text">经销商</span>
              <span>提交的开店申请</span>
              <!-- <span>{{ item.applyTime }}</span> -->
            </div>
            <div class="store-name">门店名称：{{ item.name }}</div>
            <div
              class="store-address"
            >所在地址：{{ item.addressData && item.addressData.formattedAddress }}</div>
            <div class="apply-status row-box">
              <span class="apply-time">{{ item.createdAt | handleCreateTime }}</span>
              <div>
                <span class="type-circle" :class="item.circleType"></span>
                <span class="apply-status">{{ handleStatus(item.status,item.currentIndex, index) }}</span>
              </div>
            </div>
          </div>
        </van-col>
      </van-row>
      <van-divider />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import dayjs from 'dayjs'
import cookie from 'js-cookie'
import avatars from '../const/avatar'
import {NavBar, Icon, Divider, Field, Row, Col} from 'vant'
Vue.use(NavBar)
  .use(Icon)
  .use(Divider)
  .use(Field)
  .use(Row)
  .use(Col)
export default {
  layout: 'blank',
  components: {},
  head() {
    return {
      title: '我发起的'
    }
  },
  data() {
    return {
      applyList: [],
      role: '',
      avatar: ''
    }
  },
  computed: {
    handleTitle() {
      if (this.$route.query.id == 0) {
        return '我发起的'
      } else if (this.$route.query.id == 1) {
        return '待我审批'
      } else if (this.$route.query.id == 2) {
        return '待我处理'
      }
    }
  },
  filters: {
    handleType(val) {
      // return ['待审批','审批中','已完成','审批驳回'][val]
      return ['待审批', '已完成', '待处理'][val]
    },
    handleCreateTime(val) {
      return dayjs(val).format('YYYY-MM-DD')
    },
    handleNickName(val) {
      return cookie.get('username')
    }
  },
  mounted() {
    let role = cookie.get('role')
    this.role = role
    let params = {
      role
    }
    if (parseInt(this.$route.query.id)) {
      params.type = this.$route.query.id
    }
    this.$axios
      .get('http://47.92.95.20:7001/poc/api/v1/kabin/apply/list', {
        params
      })
      .then(res => {
        if (res.data.success) {
          let applyList = this.applyList
          applyList = [...res.data.payload.data]
          applyList.forEach(ele => {
            ele.circleType = [
              'circle-yellow',
              'circle-green',
              'circle-blue',
              'circle-red'
            ][ele.type]
          })
          if (role !== 'jxs') {
            applyList = applyList.filter(item => {
              return item.currentIndex != 0 && item.currentIndex !== 9
            })
          }
          this.applyList = applyList
          this.avatar = avatars['jxs']
        }
      })
  },
  methods: {
    onClickLeft() {
      this.$router.push('/')
    },
    goChannelDetail(id, status, currentIndex, step, index, item) {
      if (currentIndex == '0') {
        this.$router.push({
          path: 'apply',
          query: {
            id: id,
            name: item.name,
            type: item.type,
            address: item.addressData.formattedAddress,
            detailAddress: item.detailAddress,
            amount: item.amount,
            storeType: item.storeType,
            people: item.people,
            peoplePhone: item.peoplePhone,
            note: item.note,
            contractsImages: item.contractsImages
          }
        })
        return
      }
      let role = cookie.get('role')
      let routes = [
        'channelDetail/application',
        'channelDetail/drawing',
        'channelDetail/progress',
        'channelDetail/presentation'
      ]
      if (role === 'jxs') {
        this.$router.push({
          path: 'channelDetail',
          query: {
            id,
            status,
            currentIndex: currentIndex
          }
        })
      } else {
        this.$router.push({
          path: routes[step - 1],
          query: {
            id,
            status,
            currentIndex: currentIndex
          }
        })
      }
    },
    handleStatus(status, currentIndex, index) {
      let {role, applyList} = this
      if (currentIndex === 9) {
        return '已完成'
      }
      let currentNode = applyList[index].nodes[currentIndex]
      if (role === 'jxs' || currentNode.role === role) {
        return '待审批'
      } else {
        switch (currentIndex) {
          case 0:
            return '待经销商处理'
            break
          case 1:
            return '待大区审批'
            break
          case 2:
            return '待渠道部审批'
            break
          case 3:
            return '待经销商处理'
            break
          case 4:
            return '待审批'
            break
          case 5:
            return '待经销商处理'
            break
          case 6:
            // return '待空间部审批'
            return '待处理'
            break
          case 7:
            return '待经销商处理'
            break
          case 8:
            return '待审批'
            break
          case 9:
            return '已完成'
        }
      }
      // if(status == "1"){
      //   return "已完成"
      // }
      // if(index == "0" || index == "6"){
      //   return "待处理"
      // }else{
      //   return "待审批"
      // }
    }
  }
}
</script>

<style lang="less">
.index {
  .row-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
  }
  .van-nav-bar {
    background: rgb(242, 242, 242);
  }

  .van-nav-bar__title {
    font-size: 24px;
    font-weight: 600;
  }

  .van-icon {
    color: #000;
  }

  .search-bar {
    background: rgb(245, 245, 249);
    height: 40px;
    line-height: 40px;
    text-align: center;

    .search-box {
      display: inline-block;
      width: 80%;
      height: 39px;
      line-height: 39px;
      font-size: 20px;
      background: rgba(242, 242, 242, 1);
      border-radius: 50px;
      margin-top: 5px;
    }
  }

  .apply-list {
    text-align: left;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 40px 0 rgba(0, 0, 0, 0.08);
    border-radius: 20px;
    margin: 0 6px;
    .role-header {
      width: 59px;
      margin: 14px 0 0 10px;
    }
    .left-circle {
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgb(215, 215, 215);
      margin: 15px 0 0 15px;
    }

    .apply-detail {
      margin: 10px 0 0 30px;

      .man-text {
        font-weight: 600;
      }
      .apply-time {
        display: inline-block;
        width: 50%;
      }
      .type-circle {
        display: inline-block;
        width: 10px;
        height: 10px;
        border: 2px solid rgb(252, 200, 0);
        border-radius: 50%;
      }
      .circle-blue {
        border-color: #3a8ee6;
      }
      .circle-yellow {
        border-color: rgb(252, 200, 0);
      }
      .circle-green {
        border-color: rgb(87, 212, 52);
      }
      .circle-red {
        border-color: rgb(246, 25, 52);
      }
    }
  }
}
</style>
