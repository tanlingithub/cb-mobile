<template>
  <div class="applyDetail">
    <header-nav-bar
            :left-text="leftText"
            :title="soureTitle"
            :right-text="rightText"
            @onsubmit="close"
    ></header-nav-bar>
    <div>
      <div v-for="(cell, index) in formData[pageId]" :key="index" v-if="!cell.hidden">
        <div v-if="cell.type === 'input'" class="input">
          <cell :title="cell.name">
            <Field
              class="input"
              v-model="cell.value"
              :placeholder="cell.placeholder"
            />
          </cell>
        </div>
        <div v-else-if="cell.type === 'image'" class="image">
          <cell :title="cell.name">
            <img
              v-for="(image, index) in cell.value"
              :key="index"
              :src="image"
              @click="onPreview(image)"
              class="agreements"
              alt=""
            />
          </cell>
        </div>
        <div v-else-if="cell.type === 'annex'" class="annex group">
          <cell :title="cell.name" value-class="cell-value">
            <Uploader
              :before-read="beforeRead"
              v-model="cell.value"
              :after-read="({file}) => upload({file, cell})"
            >
            </Uploader>
          </cell>
        </div>

        <div v-else-if="cell.type === 'time'">
          <cell :title="cell.name">
            <div @click="dateShow = true"> {{ format(cell) || '请选择时间'}} </div>
            <Popup
                    v-model="dateShow"
                    round
                    position="bottom"
                    :style="{ height: '40%' }"
            >
              <datetime-picker
                      type="date"
                      @confirm="dateShow = false"
                      @cancel="dateShow = false"
                      v-model="cell.date"
              ></datetime-picker>

            </Popup>
          </cell>

        </div>

        <cell v-else class="text" :title="cell.name">
          <div class="cell-value">
            {{ cell.cb ? cell.cb(cell.value) : cell.value }} {{cell.suffix || ''}}
          </div>
        </cell>
      </div>
    </div>

    <van-button v-if="pageId === 'application' && role === 'jxs'" size="large" plain class="submit back" @click="back"
      >返回渠道资料</van-button
    >

    <template v-if="status === 0">
      <template v-if="role !== 'jxs'">
        <div class="btn-group">
          <van-button   plain class="submit reject" @click="reject"
          >不通过</van-button>
          <van-button   plain class="submit" @click="onsubmit"
          >审批通过</van-button>
        </div>
      </template>
      <template v-else>
        <van-button
                v-if="pageId !== 'application'"
                size="large"
                plain
                class="submit"
                @click="onsubmit"
        >提交</van-button>
      </template>
    </template>
    <Popup
            v-model="preview"
            round
            class="preview-popup"
    >
      <div >
        <img class="preview" :src="previewUrl" alt=""/>
      </div>

    </Popup>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import HeaderNavBar from '@/components/header-nav-bar'
import {
  Step,
  Steps,
  Panel,
  Cell,
  CellGroup,
  Field,
  Uploader,
  Icon,
  DatetimePicker,
  Button,
  Toast,
	Area,
	Popup,
	NavBar
} from 'vant'
import {apply, reject, channelDetail} from '../../const/api'
import {upload, getDate} from '../../utils'
import cookie from 'js-cookie'
import { handlePlace } from '../../utils'
const pages = ['application', 'drawing', 'progress', 'presentation']
const titles = {
  application: '开店申请详情',
  drawing: '空间图纸详情',
  progress: '装修进度详情',
  presentation: '开业上报详情'
}
const getStoreType = function (type) {
	let storeType = ['其他', '百货商场', '商场连锁卖场' ]
  return storeType[type]
}



export default {
  layout: 'blank',
  components: {

    HeaderNavBar,
    Steps,
    Step,
    Panel,
    Cell,
    CellGroup,
    Field,
    Uploader,
    Toast,
    Icon,
    DatetimePicker,
    'van-button': Button,
		Popup,
		NavBar
  },
  head() {
    let {pageId} = this
    return {
      title: titles[pageId]
    }
  },
  data() {
    return {
			rightText: '',
			dateShow: false,
			payload: {},
			preview: false, // 预览
			leftText: '返回',
			previewUrl: '', // 预览地址
			soureTitle: '',
			status: 0,
    	role: '',
			userName: '',
      pageId: '',
      disable: false,
      fileList: [],
      formData: {
        application: [
          {
            name: '审批编号',
            col: '_id',
            value: '201908081608'
          },
          {
            name: '所在机构',
            col: 'company',
            value: '广州XX有限公司'
          },
          {
            name: '门店名称',
            col: 'name',
            value: '广州市天河区天河城店'
          },
          {
            name: '门店类型',
            col: 'storeType',
            value: 1,
						cb: getStoreType
          },
          {
            name: '所在地区',
            col: 'addressData',
            value: [],
            cb: handlePlace
          },
          {
            name: '详细地址',
            col: 'detailAddress',
            value: 'A栋508'
          },
          {
            name: '业务对接人',
            col: 'people',
            value: '陈小姐'
          },
          {
            name: '对接人电话',
            col: 'peoplePhone',
            value: '13987890987'
          },
          {
            name: '开店租金',
            col: 'amount',
            value: '10000',
            suffix: '元',
						hidden: false
          },
          {
            type: 'image',
            name: '合同',
            col: 'contractsImages',
            value: []
          }
        ],
        drawing: [
          {
            name: '审批编号',
            col: '_id',
            value: '201908081608'
          },
          {
            name: '所在机构',
            col: 'company',
            value: '广州XX有限公司'
          },
          {
            name: '门店名称',
            col: 'name',
            value: '广州市天河区天河城店'
          },
          {
            name: '门店类型',
            col: 'storeType',
						value: 1,
            cb: getStoreType

          },
          {
            name: '所在地区',
            col: 'addressData',
            value: [],
            cb: handlePlace
          },
          {
            name: '详细地址',
            col: 'detailAddress',
            value: 'A栋508'
          },
          {
            type: 'annex',
            col: 'spaceDrawingImages',
            name: '上传图纸',
            value: []
          }
        ],
        progress: [
          {
            name: '审批编号',
            col: '_id',
            value: '201908081608'
          },
          {
            name: '所在机构',
            col: 'company',
            value: '广州XX有限公司'
          },
          {
            name: '所在地区',
            col: 'addressData',
            value: [],
            cb: handlePlace
          },
          {
            name: '详细地址',
            col: 'detailAddress',
            value: 'A栋508'
          },
          {
            type: 'input',
            col: 'decorateType',
            name: '装修类型',
            value: '广州XX有限公司',
						placeholder: '请输入',
          },
          {
            type: 'input',
            name: '完工尺寸',
            col: 'size',
            value: '广州XX有限公司',
						placeholder: '请输入',
          },
          {
            type: 'input',
            name: '建设内容',
            col: 'buildContent',
            value: '广州XX有限公司',
						placeholder: '请输入',
          },
          {
            type: 'annex',
            name: '现场照片',
            col: 'liveImages',
            value: [
            ]
          },
          {
            type: 'annex',
            name: '协议',
            col: 'decorateProtocolImages',
            value: []
          }
        ],
        presentation: [
          {
            name: '审批编号',
            col: '_id',
            value: '201908081608'
          },
          {
            name: '所在机构',
            col: 'company',
            value: '广州XX有限公司'
          },
          {
            name: '所在地区',
            col: 'addressData',
            value: [],
						cb: handlePlace
          },
          {
            name: '详细地址',
            col: 'detailAddress',
            value: 'A栋508'
          },
          {
						type: 'time',
            name: '开业时间',
						placeholder: '请输入',
            col: 'openTime',
            value: ''
          },
          {
						type: 'input',
            name: '跟场负责人',
						placeholder: '请输入',
            col: 'followPeople',
            value: '王生'
          },
          {
          	type: 'input',
            name: '周边环境',
						placeholder: '请输入',
            col: 'nearEnv',
            value: ''
          },
          {
            type: 'annex',
            name: '协议',
            col: 'openProtocolImages',
            value: []
          },
          {
            type: 'annex',
            name: '附件',
            col: 'openAccessoryImages',
            value: []
          }
        ]
      }
    }
  },

  filters: {},
  created() {
    let pageId = this.$route.params.id
    this.pageId = pageId
    if (pages.indexOf(pageId) === -1) {
      return this.$router.replace('/')
    }

    this.userName = cookie.get('userName')
    this.role = cookie.get('role')
  },
  mounted() {
    this.soureTitle = this.title
    this.getData()
  },
  computed: {
    // ...mapGetters('channelDetail', ['getPayload']),
    title() {
      let {pageId} = this
      return titles[pageId]
    },


  },
  watch: {
		preview(val){
			if(val){
				this.leftText = ''
        this.soureTitle = '预览'
        this.rightText = '关闭'
      }else {
				this.soureTitle = this.title
				this.leftText = '返回'
				this.rightText = ''
      }
    }
  },
  methods: {
		format( cell ){
			if(!cell.date){
				return  cell.value
      }
			let fmt = getDate(cell.date)
      cell.value = fmt
			return fmt
		},
    // ...mapMutations({
    //   setPayload: 'channelDetail/setPayload'
    // }),
    /**
     * 获取页面数据
     */
    async getData() {
			let loading = Toast.loading({
				duration: 20000,
				mask: true,
				message: '加载中...'
			})
				try {
					let {pageId, formData} = this
					let source = formData[pageId]
					let { id, currentIndex } = this.$route.query
					if(!id) throw '无编号'
					let {data} = await this.$axios.get(channelDetail, {
						params: {
							collection: 'kabin_task',
							_id: id || '5d52b619cf713a16f5f92864'
						}
					})


          if (!data.success) throw '网络异常'

          this.payload  = data.payload
					source.map(item => {
						let value = this.payload[item.col]
            if(item.type === 'annex'){
							item.value = value.map(_=>{
								return {url: _}
              })
              return
            }

						// if(item.col === 'amount'){
						// 	item.value === '****'
						// }else {

						if(this.role !== 'admin' && this.role !== 'jxs' && this.role !== 'dq' && item.col === 'amount'){
							// item.value = '****'
							item.hidden = true
						}else {
							item.value = value
            }
            // }
					})

					let { nodes} = this.payload
          let {
						status,
            role
          } = nodes[currentIndex]

          // 驳回
          if(this.payload.currentIndex === 0){
						this.done()
						return
          }

          // 管理员
          if(this.role === 'admin'){
						this.done()
            return
          }

          // 不同的角色访问
          if(this.role !== role){
						this.done()
						return
          }

          // 不是当前节点
          let { query } = this.$route
          if(query.status === 1){
						this.done()
						return
          }

          // 提交完成
          if(status === 1){
						this.done()
          }else if(pageId === 'drawing'){
          	// 图纸没有修改权
            // 经销商除外
          	if(this.role !== 'jxs'){
							this.done()
              this.status = 0
            }
          }

				} catch (e) {
					Toast('网络异常')
				} finally {
					loading.clear()
				}
    },


    done(){
			let {pageId, formData, role} = this
			let source = formData[pageId]
			this.status = 1
			source.map(item=>{
				if(this.status === 1){
					if(item.type === 'input' || item.type === 'time'){
						item.type = 'text'
					}else if(item.type === 'annex'){
						item.type = 'image'
            let urls = item.value.map(_=>{
            	return _.url
            })
            item.value = urls
					}
				}

				if(role !== 'admin' && role !== 'jxs' && role !== 'dq' && item.col === 'amount'){
					// item.value = '****'
          item.hidden = true
        }
				// item.value = 123123

      })

    },

    /**
     * 提交
     */
    async onsubmit() {
      let loading = Toast.loading({
				duration:100000,
        mask: true,
        message: '加载中...'
      })
      try {
        let {pageId, formData, payload} = this
        let source = formData[pageId]
        let updateData = {}
        source.map(item => {
        	console.log(item.col, item.value )
					updateData[item.col] = item.value
          if(item.type === 'annex'){
						updateData[item.col] = item.value.map(_=>_.url)
          }
        })
        delete updateData._id
        await this.$axios.post(apply, {
          data: updateData,
          _id: payload._id
        })
        await this.getData()
				Toast('审批已通过')
      } catch (e) {
				Toast('网络异常')
      } finally {
        loading.clear()
      }
    },

    async reject(){
			let loading = Toast.loading({
				duration:100000,
				mask: true,
				message: '加载中...'
			})
      try {
				let {pageId, formData, payload} = this
				let source = formData[pageId]
				let updateData = {}
				source.map(item => {
					payload[item.col] = item.value
					if(item.type === 'annex'){
						updateData[item.col] = item.value.map(_=>_.url)
					}
				})
				await this.$axios.post(reject, {
					_id: payload._id
				})
				await this.getData()
				Toast('审批已驳回')
			}catch (e) {
				Toast(e)
			}finally {
				loading.clear()
			}
    },

		beforeRead(file){
			if(file.size > 1024 * 1024){
				Toast('图片不能大于1M')
				return false
			}
			return true
		},

    async upload(files) {
      let loading = Toast.loading({
				duration:100000,
        mask: true,
        message: '加载中...'
      })
      let url = await upload(files)
      console.log(url)
      let {cell} = files
      this.formData[this.pageId].find(item => {
        if (item.col === cell.col) {
          item.value[item.value.length - 1] = {
            url
          }
        }
      })
      loading.clear()
    },

    back() {
      this.$router.go(-1)
    },

		onPreview(url){
    	this.previewUrl = url
    	this.preview = true
    },

		close(){
    	this.preview = false
    }
  }
}
</script>

<style lang="less">
.applyDetail {
  height: 100%;

  .cell-value {
    text-align: left;
  }

  .annex {
    .van-cell {
      .van-cell__value {
        margin-top: 15px;
      }

      flex-direction: column;
    }
  }

  .van-cell__value .cell-value {
    text-align: right;
  }

  .imgs-box {
    text-align: left;
    margin-left: 71px;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
  }

  .van-cell {
    border-bottom: 1px solid #f1f1f1;
  }

  .group {
    margin-top: 10px;
  }

  .image {
    .van-cell__value {
      text-align: left;
    }
  }

  .van-cell__title {
    width: 112px;
    flex: none;
    text-align: left;
  }

  .imgs {
    width: 91px;
    margin-right: 5px;
    max-height: 150px;
  }

  .input {
    padding: 0;
    input{
      text-align: right;
    }
  }

  .agreements {
    width: 91px;
    margin-right: 5px;
  }

  .icon {
    border: 1px dotted gray;
    border-radius: 5px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 123px;
  }

  .submit {
    margin-top: 30px;
    width: 45%;
    background: #282828;
    color: #f4c200;
    border-radius: 15px;
  }
  .back{
    width: 60%;
    background:rgba(255,255,255,1);
    box-shadow:0px 4px 20px 0px rgba(204,163,2,0.2);
  }
  .reject{
    background:rgba(255,255,255,1);
    box-shadow:0px 4px 20px 0px rgba(204,163,2,0.2);
  }
  .btn-group{
    display: flex;
    justify-content: space-between;
    width: 83%;
    margin: 0px auto;
  }

  .image{
    .van-cell{
      flex-direction: column;
    }
    .van-cell__value{
      margin: 15px 0;
      display: flex;
      flex-wrap: wrap;

    }
    img{
      max-height: 200px;
    }
  }
  .van-overlay{
    z-index: 8 !important;
  }
  .preview-popup{
    z-index: 9 !important;
  }
  .preview{
    img{
      width: 100%;
    }
  }
}
</style>
