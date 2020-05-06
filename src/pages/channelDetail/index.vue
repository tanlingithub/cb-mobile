<template>
  <div class="channelDetail">
    <header-nav-bar :title="title"></header-nav-bar>

<!--    <div class="avatar">-->
<!--      <img :src="avatar" alt="" />-->
<!--      <h2 class="name">{{name}}</h2>-->
<!--    </div>-->

    <div>
      <steps direction="vertical" :active="step - 1">
        <step v-for="(node, index) in nodes" :key="index">
          <panel
            :title="node.name"
            @click="routeTo(node.link, index)"
            :class="['panel', {disble: index > (step - 1)}]"
          >
            <CellGroup v-if="node.forms.length">
              <Cell
                v-for="(cell, cellIndex) in node.forms"
                :key="cellIndex"
                :title="cell.label"
                :border="false"
                >{{ cell.cb ? cell.cb(cell.value) : cell.value }}</Cell
              >
            </CellGroup>
            <div class="imgs-box" v-if="node.images.length">
              <img
                v-for="(image, imgIndex) in node.images"
                :key="imgIndex"
                class="imgs"
                :src="image"
                alt=""
              />
            </div>
            <div class="date">{{ node.date }}</div>
          </panel>
        </step>
      </steps>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import HeaderNavBar from '@/components/header-nav-bar'
import {Step, Steps, Panel, Cell, CellGroup, Toast} from 'vant'
import {channelDetail} from '../../const/api'
import cookie from 'js-cookie'
import avatars from '../../const/avatar'
import { handlePlace, getDate } from '../../utils'
export default {
  layout: 'blank',
  components: {
    HeaderNavBar,
    Steps,
    Step,
    Panel,
    Cell,
    CellGroup
  },
  head() {
    return {
      title: '渠道资料查看'
    }
  },
  data() {
    let pages = ['application', 'drawing', 'progress', 'presentation'].map(
      _ => 'channelDetail/' + _
    )
    return {
    	avatar: '',
      step: 1,
    	role: '',
      name: '',
      title: '渠道资料查看',
      currentIndex: 0,
      loading: false,
      nodes: [
        {
          link: pages[0],
          name: '开店申请',
          date: '',
          forms: [
            {
              label: '门店名称:',
              value: '广州市天河区天河城店'
            },
            {
              label: '所在地区:',
              value: [],
              cb: handlePlace
            },
            {
              label: '详细地址:',
              value: 'A栋508'
            }
          ],
          images: []
        },
        {
          link: pages[1],
          name: '空间图纸',
          date: '',
          forms: [],
          images: [
          ]
        },
        {
          link: pages[2],
          name: '装修进度',
          date: '',
          forms: [],
          images: [
          ]
        },
        {
          link: pages[3],
          name: '开业上报',
          date: '',
          forms: [
            {
              label: '开业时间:',
              value: ''
            }
          ],
          images: [
          ]
        }
      ]
    }
  },

  filters: {},
  mounted() {
  	this.role = cookie.get('role')
    if(this.role === 'admin') {
		  this.role = 'dq'
    }
		this.getData()
  },
  computed: {},
  watch: {},
  methods: {
    ...mapMutations({
      setPayload: 'channelDetail/setPayload'
    }),

    async getData() {
      let loading = Toast.loading({
        duration: 20000,
        mask: true,
        message: '加载中...'
      })
      try {
      	let { id } = this.$route.query
        if(!id) throw '无编号'
        let {data} = await this.$axios.get(channelDetail, {
          params: {
            collection: 'kabin_task',
            _id: id || '5d52b619cf713a16f5f92864'
          }
        })

        if (!data.success) throw '网络异常'
        let {
          payload: {
            nodes,
            currentIndex,
            spaceDrawingImages,
            name,
            addressData,
            detailAddress,
            decorateProtocolImages,
            openAccessoryImages,
            role,
						step,
						people,
						openTime
          }
        } = data

        if(currentIndex === 9){
        	currentIndex = 8
        }

        this.name = people
				nodes.map(item=>{
					if(item.doneTime){
						item.date = getDate(item.doneTime)
					}
				})
        this.step = step
				this.sourceIndex = currentIndex
        this.currentIndex = nodes[currentIndex]['step']
        // console.log()
        // this.avatar = avatars[role]
        this.avatar = avatars['jxs']

        this.setPayload(data.payload)

        this.roleNodes = nodes.filter((item, index)=>{
          return item.role === 'jxs'
        })

        this.roleNodes.map((item, index)=>{
        	this.nodes[index].date = item.date || ''
        })

        // 节点0
        let {forms} = this.nodes[0]
        forms[0].value = name
        forms[1].value = addressData
        forms[2].value = detailAddress
        // 节点1
        this.nodes[1].images = spaceDrawingImages
        // this.nodes[1].date = spaceDrawingImages

        // 节点2
        this.nodes[2].images = decorateProtocolImages

        // 节点3
        this.nodes[3].images = openAccessoryImages
        this.nodes[3].forms[0].value = openTime



      } catch (e) {
      	console.log(e)
        Toast(e)
      } finally {
        loading.clear()
      }
    },

    routeTo(path, index) {
      let { roleNodes, sourceIndex, step} = this
      let { id } = this.$route.query
      if (index > (step - 1)) {
        return Toast('等待审批')
      }
      let status = roleNodes[index].status
      this.$router.push({
        path,
        query: { status, id, currentIndex: sourceIndex }
      })
    }
  }
}
</script>

<style lang="less">
.channelDetail {
  background: #fff;
  height: 100%;
  padding-bottom: 21px;

  .panel {
    width: 96%;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 0 21px 2px #eae6e6;

    .van-cell-group {
      background: transparent;
    }

    .van-cell {
      background: transparent;
    }

    .van-cell__title {
      flex: none;
      margin-right: 10px;
    }

    .van-cell__value {
      text-align: left;
    }

    .date {
      text-align: left;
      color: #969799;
      padding: 7px 18px;
    }
  }

  .imgs-box {
    text-align: left;
    margin-left: 17px;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    padding-bottom: 18px;
  }

  .imgs {
    width: 91px;
    margin-right: 5px;
    max-height: 150px;
  }

  .avatar {
    display: flex;
    justify-content: left;
    align-items: center;
    margin: 14px;

    img {
      display: block;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #a2a2a2;
    }

    .name {
      font-size: 20px;
      margin-left: 15px;
    }
  }

  .disble {
    * {
      background: #e2e2e2 !important;
      opacity: 0.85 !important;
    }

    .van-cell::after {
      content: none;
    }
  }
}
</style>
