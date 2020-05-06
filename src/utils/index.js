import areaList from '../const/arealist'

export function isNull(o) {
  return o === null || o === void 0
}

/**
 * 上传图片函数
 * 1. 根目录要配置 .env
 * 2. 挂到 Uploader 组件的 :after-read 上
 * @param file
 * @returns {Promise<Uint8Array | BigInt64Array | (void | string)[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array>}
 * @author laitingyou
 */
export async function upload({file}) {
  const aliOSS = require('ali-oss')
  let fileName = file.name
  let suffix = fileName.match(/\.(png|jpeg|jpg)$/)[1]

  let client = new aliOSS({
    region: process.env.OSS_REGION,
    bucket: process.env.OSS_BUCKET,
    accessKeyId: process.env.OSS_KEY,
    accessKeySecret: process.env.OSS_SECRET
  })
  // let OSS_DIR = process.env.OSS_DIR
  let name = `${new Date() * 1}.${suffix}`
  let {
    res
  } = await client.multipartUpload(name, file, {
    parallel: 1,
    partSize: 1024 * 1024 * 1024
  })
  let {status, requestUrls} = res
  if (status !== 200)
    throw {
      status,
      message: 'upload fail'
    }
  // 只能一张一张传输
  return requestUrls.map(url => {
    return url.replace(/\.(png|jpeg|jpg).*$/, `.${suffix}`)
  })[0]
}

/**
 * code
 * @param arr
 * @returns {*}
 */
export const handlePlace = function (obj = {}) {

  // let total = {
  //   ...areaList['province_list'],
  //   ...areaList['city_list'],
  //   ...areaList['county_list'],
  // }
  // return total[arr[0]] + total[arr[1]] + total[arr[2]]

    return obj['formattedAddress'] || ''
}

export const getDate = function (time = '') {
  if(!time) return ''
  let dateData = ''
  if(typeof time === 'number'){
    dateData = new Date(1 * time)
  }else if(typeof time === 'object'){
    dateData = new Date( time)
  }

  let y = dateData.getFullYear()
  let m = dateData.getMonth() + 1
  let d = dateData.getDate()
  let fullDate = `${y}-${m}-${d}`
  return fullDate

}
