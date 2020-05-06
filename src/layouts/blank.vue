<template>
  <div class="wrapper">
    <template v-if="$route.query.keepAlive">
      <nuxt keep-alive></nuxt>
    </template>
    <nuxt v-else></nuxt>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {}
  },
  watch:{

  },
  methods: {},
  computed: {}
}
</script>

<style lang="stylus">
.wrapper {
  text-align: center;
  height: 100%;
}
</style>
