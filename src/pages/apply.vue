<template>
  <div class="index">
    <script src="https://webapi.amap.com/maps?v=1.4.14&key=821a0873240942cfa32ceabddd9e7984"></script>
    <van-nav-bar
      title="开店申请"
      left-text=" "
      right-text=""
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="apply-group">
      <van-field
        v-model="applyForm.name"
        label="门店名称"
        placeholder="请输入门店名称"
        input-align="right"
      />
      <van-cell
        title="门店类型"
        is-link
        :value="storeType"
        @click="showPopup = true"
      />
    </div>
    <div class="apply-group">
      <van-cell
        is-link
        :value="locationArea"
        border
        @click="getLocation"
      >
        <template slot="title">
          <van-icon name="location" />
          <span class="custom-title">所在地区</span>
        </template>
      </van-cell>
      <van-field
        v-model="applyForm.detailAddress"
        placeholder="详细地址"
        input-align="right"
      />
    </div>
    <!-- <van-overlay
      :show="mapShow"
    > -->
    <!-- <poc-map :mapShow="mapShow"></poc-map> -->
    <!-- </van-overlay> -->
    <div class="apply-group">
      <van-field
        v-model="applyForm.people"
        label="业务对接人"
        placeholder=""
        input-align="right"
      />
      <van-field
        v-model="applyForm.peoplePhone"
        label="对接人手机号"
        placeholder=""
        input-align="right"
      />
    </div>
    <div class="apply-group single">
      <van-field
        v-model="applyForm.amount"
        label="租金"
        right-icon="gold-coin"
        placeholder=""
        input-align="right"
      />
    </div>
    <van-popup v-model="showPopup" position="bottom" :style="{height: '20%'}">
      <div class="popItem" @click="setStoreType(1)">百货商场</div>
      <div class="popItem" @click="setStoreType(2)">商场连锁卖场</div>
      <div class="popItem" @click="setStoreType(0)">其他</div>
    </van-popup>
    <div class="apply-group single">
      <van-field
        v-model="applyForm.note"
        label="备注"
        placeholder=""
        type="textarea"
        input-align="right"
      />
    </div>
    <div class="apply-paper">
      <div class="paper-title">合同</div>
      <div class="apply-pictures">
        <van-uploader :before-read="beforeRead" :after-read="afterRead" v-model="fileList" multiple />
      </div>
    </div>
    <div class="apply-flow">
      <div class="flow-name">审批流程</div>
      <van-steps direction="vertical" :active="0">
        <van-step>
          <div class="step-box">
            <span class="step-head">发起申请</span>
          </div>
          <div class="step-content">
            <span class="step-name">我本人</span>
            <img :src="avatars.jxs" alt="" class="role-header">
          </div>
          <div class="step-time">{{ nowTime }}</div>
        </van-step>
        <van-step>
          <div class="step-box">
            <span class="step-head">连续多级审批</span>
            <span class="step-time"></span>
          </div>
          <div class="step-content">
            <span class="step-name">开店申请</span>
            <img :src="avatars.dq" alt="" class="role-header">
            <img :src="avatars.zb" alt="" class="role-header">
          </div>
        </van-step>
        <van-step>
          <div class="step-box">
            <span class="step-head">1人审批</span>
            <span class="step-time"></span>
          </div>
          <div class="step-content">
            <span class="step-name">空间图纸</span>
            <img :src="avatars.kj" alt="" class="role-header">
          </div>
        </van-step>
        <van-step>
          <div class="step-box">
            <span class="step-head">1人审批</span>
            <span class="step-time"></span>
          </div>
          <div class="step-content">
            <span class="step-name">装修进度</span>
            <img :src="avatars.kj" alt="" class="role-header">
          </div>
        </van-step>
        <van-step>
          <div class="step-box">
            <span class="step-head">1人审批</span>
            <span class="step-time"></span>
          </div>
          <div class="step-content">
            <span class="step-name">开业上报</span>
            <img :src="avatars.zb" alt="" class="role-header">
          </div>
        </van-step>
      </van-steps>
    </div>
    <div class="apply-push" @click="submitApply">
      提交申请
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { upload } from '../utils'
import dayjs from 'dayjs'
import cookie from 'js-cookie'
import avatars from '../const/avatar'
// import naviMap from '../components/map'
import { mapGetters } from 'vuex'
import {
  NavBar,
  Cell,
  CellGroup,
  Icon,
  Panel,
  Step,
  Steps,
  Uploader,
  Popup,
  Field,
  Divider,
  Notify,
	Toast
} from 'vant'
import { log } from 'util';
Vue.use(Cell)
  .use(CellGroup)
  .use(NavBar)
  .use(Icon)
  .use(Panel)
  .use(Step)
  .use(Steps)
  .use(Uploader)
  .use(Popup)
  .use(Field)
  .use(Divider)
  .use(Notify)
  // .use(Overlay)
export default {
  layout: 'blank',
  components: {
    // 'poc-map':naviMap,
  },
  head() {
    return {
      title: '开店申请'
    }
  },
  data() {
    return {
      showPopup: false,
      fileList: [],
      storeType: '商城连锁卖场',
      locationArea: '点击选择',
      detailAddress:'',
      addressData:'',
      applyForm: {
        name: '',
        type: 1,
        storeType: 2, //'商城连锁卖场-2,其他-0,百货商场-1',
        people: '',
        peoplePhone: '',
        amount: '',
        contractsImages: [],
        note: '',
        role:'jxs'
      },
      nowTime:'',
      avatar:'',
      mapShow:false,
      avatars,
    }
  },

  computed:{
  	...mapGetters('channelDetail', ['getAddress'])
  },

  activated(){
  	this.locationArea = this.getAddress
    console.log(this.getAddress)
    // let address = localStorage.getItem('location')
		// let detailAddress = localStorage.getItem('regeocode')
		// if (address) {
		//   let addressData = JSON.parse(detailAddress)
		//   this.locationArea = addressData && addressData.formattedAddress
		// }
		let applyForm = window.sessionStorage.getItem('applyForm')
		if(applyForm){
			this.applyForm = JSON.parse(applyForm)
    }
  },
  mounted() {
    this.nowTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    this.avatar = avatars[cookie.get('role')]
    if(this.$route.query.name){
      this.applyForm = {...this.$route.query}
      this.storeType = ['其他', '百货商场', '商城连锁卖场'][this.$route.query.storeType]
      this.locationArea = this.$route.query.address
      this.detailAddress = this.$route.query.detailAddress
      this.$route.query.contractsImages.forEach(ele=>{
        this.fileList.push({url:ele})
      })
    }
  },
  methods: {
    onClickLeft() {
      // this.$router.push('/')
      this.$router.back()
    },
    onClickRight() {},

		beforeRead(file){
			if(file.size > 1024 * 1024){
				Toast('图片不能大于1M')
				return false
			}
			return true
    },

    async afterRead(file) {
    	let {contractsImages} = this.applyForm

      let loading = Toast.loading({
				duration: 100000,
				mask: true,
				message: '文件上传中...'
			})
     let url =  await upload(file)

      this.applyForm.contractsImages = [
				url,
        ...contractsImages
      ]
      loading.clear()
    },
    setStoreType(type) {
      this.showPopup = false
      this.storeType = ['其他', '百货商场', '商城连锁卖场'][type]
    },

		/**
     * 字段检测
		 * @param data
		 * @param fields
		 */
    check(data, fields = []){
			for (let field of fields){
				if(!data[field]){
					return false
        }
			}
			return true
			// for (let item in data){
      //
      // }
    },

    submitApply() {
      let data = {
        ...this.applyForm
      }

      let { id } = this.$route.query
      data.addressData = {
        formattedAddress:this.locationArea,
      }
      // if(this.detailAddress){
      //   data.addressData.detailAddress = this.detailAddress
      // }
			let res = this.check(data, Object.keys(data))
      if(!res){
				return Toast('输入不能为空')
      }

			let loading = Toast.loading({
				duration: 20000,
				mask: true,
				message: '正在提交...'
			})

      let body

      let url = ''
      if(id){
				url = '/poc/api/v1/kabin/apply/apply'
        body = {
					_id: id,
          data: {
						type: 1,
						...data
          }
        }
      }else {
				url = '/poc/api/v1/kabin/apply/create'
        body = data
      }

      this.$axios.post(url, body).then(res => {
        localStorage.removeItem('location')
        localStorage.removeItem('regeocode')
        Notify({
          message: '提交成功',
          duration: 1000,
          background: '#1989fa',
					onClose: ()=>{
						this.$router.replace({
              path: 'applyList',
              query: {
              	id: 0
              }
            })
        }
        });
				loading.clear()


      }).catch(function () {
				Toast('提交失败')
			}).finally(function () {
        loading.clear()
			})
    },

    getLocation(){
    	window.sessionStorage.setItem('applyForm', JSON.stringify(this.applyForm))
			this.$router.push(
        {
          path: '/currentLocation',
					query: {
						keepAlive: true
          }
        }
      )
    }


  }
}
</script>

<style lang="less">
.index {
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

  .apply-group {
    margin-top: 11px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 40px 0 rgba(0, 0, 0, 0.08);
    border-radius: 20px;

    .van-cell {
      text-align: left;
      border-bottom: 0px solid rgb(228, 228, 228);

      .van-cell__title {
        span {
          font-weight: 600;
        }
      }
    }

    .van-cell:nth-of-type(1) {
      border-radius: 20px 20px 0 0;
    }

    .van-cell:nth-of-type(2) {
      border-radius: 0 0 20px 20px;
    }
  }

  .single {
    .van-cell:nth-of-type(1) {
      border-radius: 20px 20px;
    }
  }

  .popItem {
    height: 40px;
    line-height: 40px;
    border-top: 1px solid rgb(228, 228, 228);
  }

  .apply-comments {
    height: 80px;
    background: rgb(255, 255, 255);
    border-top: 2px solid rgb(228, 228, 228);
    border-bottom: 2px solid rgb(228, 228, 228);

    .comments-text {
      text-align: left;
      margin-top: 10px;
      margin-left: 15px;
    }
  }

  .apply-paper {
    border: 1px soild rgb(228, 228, 228);
    background: rgb(255, 255, 255);
    border-radius: 20px 20px;

    .paper-title {
      text-align: left;
      margin-top: 10px;
      margin-left: 15px;
      font-weight: 600;
    }

    .apply-pictures {
      text-align: left;

      .van-uploader {
        margin-left: 40px;
      }
    }
  }

  .apply-flow {
    margin-top: 15px;
    border-top: 2px solid rgb(228, 228, 228);
    border-bottom: 2px solid rgb(228, 228, 228);
    background: rgb(255, 255, 255);
    text-align: left;
    border-radius: 20px 20px;

    .van-icon-checked::before{
      content: " ";
      display: inline-block;
      width: 13px;
      height: 13px;
      background-color: #FCC800;
      border: 5px solid black;
      border-radius: 50%;
    }
    .van-step__line{
      top:16px;
      left:-17px;
      width: 0;
      border-right: 4px dashed #979797;
    }
    .van-hairline:nth-of-type(5) .van-step__line{
      border-right: 0;
    }

    .van-step__circle{
      width: 13px;
      height: 13px;
      background-color: #FCC800;
      border: 5px solid black;
      border-radius: 50%;
    }

    .flow-name {
      margin-top: 10px;
      margin-left: 15px;
      font-weight: 600;
    }

    .step-box {
      color: black;
      width: 108px;
      height: 41px;
      line-height: 41px;
      background: rgba(254,245,209,1);
      border-radius: 50px;
      text-align: center;
      font-weight: 600;
    }
    .step-time {
      // margin-left: 90px;
      color: #838383;
    }

    .step-content {
      line-height: 40px height 40px;
      color: black;
      .step-name {
        display: inline-block;
        width: 65px;
        margin: 20px;
      }
      .role-header{
        margin-left: 88px;
        width: 54px;
      }
      img:nth-of-type(2){
        margin: 0;
      }

      .step-circle {
        display: inline-block;
        margin-left: 80px;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 50% 50%;
        background: rgb(215, 215, 215);
      }

      .step-circle1 {
        display: inline-block;
        margin-left: 10px;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 50% 50%;
        background: rgb(215, 215, 215);
      }

      .step-circle-active {
        background: rgb(27, 130, 210);
      }
    }
  }

  .apply-push {
    margin: 20px 0 20px 20px;
    font-size: 24px;
    font-family: 'PingFangSC-Medium';
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 58px;
    width: 90%;
    height: 58px;
    background: rgba(40, 40, 40, 1);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.3);
    border-radius: 21px;
  }
}
</style>
