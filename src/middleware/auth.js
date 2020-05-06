import cookie from 'js-cookie'
import {STORAGE_KEYS} from '@/const/common'
import * as WeChat from '@/plugins/wechat'
import {login} from '../const/api'
// 认证跳转登录注册页
const REGISTER_PAGE = '/login'

/**
 * 1. 认证拦截:
 *    - 验证token, 否则跳转登录页
 * 3. 更新用户信息
 *
 */
// export default async function({app, route, redirect, store, isDev, isServer}) {
// if (isServer) return // 跳过sever
// if (route.path === REGISTER_PAGE) return // 跳过登录页
//
// const hasToken = !!cookie.get(STORAGE_KEYS.TOKEN)
//
// // 跳转登录页
// if (!hasToken) {
//   return redirect(REGISTER_PAGE, {redirectUri: location.href})
// }
//
// // 更新用户信息（非强制刷新）
// if (hasToken) {
//   await store.dispatch('getUserInfo')
// }
// }

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export default async function(ctx) {
  let {app, store, redirect, route} = ctx
  if (route.path === REGISTER_PAGE) return
  // console.log(store.getters['auth/getUserInfo'])
  // if (!cookie.get('token')) {
  //   return redirect(REGISTER_PAGE, {redirectUri: location.href})
  // }
}
