<template>
  <div class="index">
    <div class="">
      <form action="/">
        <van-search
          v-model="searchValue"
          placeholder="搜索你喜欢的商品"
          show-action
          @search="onSearch"
        >
          <van-icon slot="left-icon" name="search" />
          <div slot="action" @click="onSearch">搜索</div>
        </van-search>
      </form>
    </div>
    <van-swipe :autoplay="3000" :indicatorColor="indicatorColor">
      <van-swipe-item v-for="(banner, index) in banners" :key="index">
        <img :src="banner.url" class="banner" />
      </van-swipe-item>
    </van-swipe>

    <van-row class="hot-products" v-if="hotProducts.length">
      <div class="hot-products-name-wrapper">
        <icon-font icon="iconhot" class="icon"></icon-font>
        <div class="hot-products-name">热销商品</div>
      </div>
      <van-row>
        <van-col
          span="12"
          v-for="(product, prodIndex) in showProducts"
          :key="prodIndex"
        >
          <div class="product" @click="toDetail(product)">
            <div class="product-img-wrapper">
              <img v-lazy="product.imagesUrl" class="product-img" />
            </div>
            <p class="name">{{ product.name }}</p>
            <p class="price">{{ product.showPrice | price }}</p>
            <div class="product-desc">
              <p class="sold-num">{{ product.sales | soldNumFilter }}付款</p>
              <icon-font
                icon="iconziyuan"
                class="icon-cart"
                v-if="false"
              ></icon-font>
            </div>
          </div>
        </van-col>
      </van-row>
    </van-row>
    <div class="no-product">- {{ productTips }} -</div>
  </div>
</template>

<script>
import Vue from 'vue'
import {Swipe, SwipeItem} from 'vant'
import IconFont from '@/components/icon-font'
import {getGoods} from '@/const/api.js'
import {GOODS_DETAIL, HOST_LIST} from '@/const/path.js'
import {mapGetters, mapState, mapActions} from 'vuex'
import {Lazyload, Search} from 'vant'
Vue.use(Lazyload)
Vue.use(Search)

export default {
  layout: 'layout-with-footer',
  components: {
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    IconFont
  },
  head() {
    return {
      title: '妍丽商城'
    }
  },
  data() {
    return {
      banners: [
        {url: require('~/assets/swiper-1.jpg')},
        {url: require('~/assets/swiper-2.jpg')}
      ],
      indicatorColor: '#fff',
      hotProducts: [],
      showProducts: [],
      tabLineWidth: 85,
      tabLineHeight: 3,
      swipeThreshold: 3,
      searchValue: sessionStorage.getItem('searchKey')
    }
  },

  filters: {
    soldNumFilter(soldNum) {
      soldNum = parseInt(soldNum)
      return soldNum >= 10000 ? (soldNum / 10000).toFixed(1) + '万' : soldNum
    }
  },
  mounted() {
    this.$toast.loading({
      duration: 0,
      forbidClick: true,
      mask: true,
      message: '加载中...'
    })
    Promise.all([this.getHotProducts()])
      .then(([hotProducts]) => {
        this.hotProducts = hotProducts.data.payload
        this.hotProducts.forEach(item => {
          item.memPrice = (item.price * this.sale).toFixed(2)
          item.showPrice = item.salePrice
            ? Math.min(
                Number(item.price),
                Number(item.memPrice),
                Number(item.salePrice)
              )
            : item.memPrice
        })
        this.onSearch()
        // this.showProducts = [...this.hotProducts]
      })
      .catch(e => null)
      .finally(() => {
        this.$toast.clear()
      }),
      this.getCartNum(this.userId)
  },
  computed: {
    ...mapGetters('city', ['areaCode']),
    ...mapState(['sale', 'userId']),
    productTips() {
      return this.hotProducts.length ? '没有更多了' : '更多商品上架中，敬请期待'
    }
  },
  watch: {
    searchValue() {
      sessionStorage.setItem('searchKey', this.searchValue)
    }
  },
  methods: {
    ...mapActions('cart', ['getCartNum']),
    onSearch() {
      this.showProducts = []
      if (!this.searchValue) {
        this.showProducts = [...this.hotProducts]
      } else {
        this.hotProducts.forEach(pro => {
          if (new RegExp(this.searchValue).test(pro.name))
            this.showProducts.push(pro)
        })
      }
    },
    getHotProducts() {
      return this.$axios.get(getGoods)
    },
    toDetail(item) {
      let {id, code} = item
      this.$router.push({
        path: GOODS_DETAIL,
        query: {
          id,
          code
        }
      })
    },
    toHotlist() {
      this.$router.push({
        path: HOST_LIST
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~assets/var.styl';

.index {
  color: $text-gray;

  .search-wrapper {
    display: flex;
    height: 30px;
    padding: 10px 15px;
    line-height: 30px;
    background-color: $white;

    .search-bar {
      display: block;
      flex: 1;

      .bar {
        height: 30px;
        padding-left: 10px;
        border-radius: 20px;
        line-height: 30px;
        color: $gray;
        background-color: $bg-color;

        .van-icon-search {
          line-height: 30px;
          font-size: 16px;
          font-weight: bold;
          color: $primary-color;
        }

        .bar-text {
          vertical-align: top;
        }
      }
    }
  }

  .van-swipe {
    height: 187px;

    .van-swipe__indicator {
      width: 9px;
      height: 9px;
      background-color: #9b9b9b;
    }

    .banner {
      max-height: 100%;
      width: 100%;
    }
  }

  .msg-wrapper {
    display: flex;
    margin-bottom: 10px;
    padding: 0 15px;
    line-height: 30px;
    background-color: $white;

    .icon-msg {
      padding-right: 5px;
      vertical-align: middle;
      font-size: 10px;
      color: $primary-color;
    }

    .msg {
      flex: 1;
      font-size: 12px;
      vertical-align: middle;
    }

    .van-icon-arrow {
      line-height: 30px;
      color: $text-gray;
    }
  }

  .invite-poster-wrapper {
    display: flex;
    padding-bottom: 45%;
    margin-top: 10px;
    position: relative;
    background-color: #fff;

    .invite-poster {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .to-invite {
      position: absolute;
      width: 50%;
      height: 100%;

      &.right {
        right: 0;
      }
    }
  }

  .van-tabs {
    margin-top: 10px;
    background-color: $white;

    .van-tabs__wrap {
      z-index: 1;

      .van-tab {
        font-size: 15px;
        color: $gray;

        &.van-tab--active {
          color: $primary-color;
        }
      }
    }
  }

  .hot-products {
    margin-top: 10px;
    background-color: $white;

    .hot-products-name-wrapper {
      display: flex;
      height: 20px;
      padding: 15px 15px 5px;
      font-size: 15px;

      .icon {
        line-height: 20px;
        color: $primary-color;
      }

      .hot-products-name {
        flex: 1;
        margin-left: 5px;
        vertical-align: middle;
        color: $gray;
      }

      .check-more {
        line-height: 20px;

        .check-more-inner {
          vertical-align: middle;
        }

        .van-icon-arrow {
          vertical-align: middle;
          font-size: 15px;
        }
      }
    }
  }

  .van-row {
    padding: 5px;

    .product {
      margin: 5px;
      padding-bottom: 10px;
      font-size: 14px;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);

      .product-img-wrapper {
        padding-bottom: 100%;
        position: relative;

        .product-img {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }

      .name {
        display: -webkit-box;
        height: 37px;
        margin: 5px 10px;
        font-size: 13px;
        color: $gray;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        margin-left: 5px;
        margin-right: 5px;
        font-size: 15px;
        color: $primary-color;
      }

      .product-desc {
        display: flex;
        padding: 0 5px;

        .sold-num {
          flex: 1;
          font-size: 13px;
        }

        .icon-cart {
          margin-left: 5px;
          font-size: 15px;
          line-height: 22px;
        }
      }
    }
  }

  .no-product {
    padding-top: 10px;
    font-size: 14px;
    text-align: center;
    color: rgb(102, 102, 102);
  }
}
</style>
