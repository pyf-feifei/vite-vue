import JSEncrypt from 'jsencrypt'
/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 深层克隆
 * @param {*} source
 * @returns
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
/**
 *  深层合并两个对象
 * @param obj1 obj2 两个object，不限制对象层级
 * @return newObject 深层合并后的新对象
 */
export function deepMerge(obj1, obj2) {
  for (var key in obj2) {
    obj1[key] =
      obj1[key] &&
        Object.prototype.toString.call(obj1[key]) === '[object Object]'
        ? deepMerge(obj1[key], obj2[key])
        : obj2[key]
  }
  return obj1
}
/**
 * form验证数字
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validatorNum(rule, value, callback) {
  if (value && !/^-?\d+?(\.\d+)?(?:\/\d+?)?$/.test(value)) {
    callback('只能输入数字')
  } else {
    callback()
  }
}
/**
 * form验证数字为整数
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validatorNumInteger(rule, value, callback) {
  if (value && !/^\d+$/.test(value)) {
    callback('只能输入数字')
  } else {
    callback()
  }
}
/**
 * 时间格式化
 * @param {*} fmt
 * @param {*} date
 * @returns
 */
export function dateFtt(fmt, date) {
  if (fmt && !date && fmt instanceof Date) {
    date = fmt
    fmt = 'yyyy-MM-dd'
  } else {
    switch (fmt) {
      case 'date':
        fmt = 'yyyy-MM-dd'
        break
      case 'datetime':
        fmt = 'yyyy-MM-dd hh:mm:ss'
        break
    }
  }
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  // author: meizz
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
/**
 * 平铺对象转树状对象
 * @param {*} data
 * @param {*} idKey
 * @param {*} parentIdKey
 * @returns
 */
export function buildTree(data, idKey = 'id', parentIdKey = 'parentId') {
  let tree = []
  const itemById = {}

  data.forEach((item) => {
    if (item.parentIds) {
      let parentArray = item.parentIds
        .split('][')
        .map((id) => parseInt(id.replace('[', '').replace(']', '')))
      item[parentIdKey] = parentArray[parentArray.length - 1]
    }
    itemById[item[idKey]] = { ...item, children: [] }
  })
  // 遍历数组，将每个项放到其父节点的 children 数组中
  data.forEach((item) => {
    const parentId = item[parentIdKey]
    if (itemById.hasOwnProperty(parentId)) {
      itemById[parentId].children.push(itemById[item[idKey]])
    } else {
      tree.push(itemById[item[idKey]])
    }
  })

  return tree
}
/**
 * 根据某个属性，返回这个属性为true的所有子父节点的树状数组
 * @param {*} data 可以转树状数组的平铺数组
 * @param {*} idKey id字段Key
 * @param {*} parentIdKey parentId字段Key
 * @param {*} filterKey  筛选属性
 * @param {*} filterValue  筛选属性值
 * @returns
 */
function filterTreeByProperty(
  data,
  idKey = 'id',
  parentIdKey = 'parentId',
  filterKey = 'haveConstructionCom',
  filterValue = true
) {
  let tree = []
  const itemById = {}

  data.forEach((item) => {
    if (item.parentIds) {
      let parentArray = item.parentIds
        .split('][')
        .map((id) => parseInt(id.replace('[', '').replace(']', '')))
      item[parentIdKey] = parentArray[parentArray.length - 1]
    }
  })
  let filterAllFatherData = (data, itemData) => {
    if (itemData[parentIdKey]) {
      let findFather = data.find((ite) => itemData[parentIdKey] === ite[idKey])
      if (findFather) {
        if (!itemById.hasOwnProperty(findFather[idKey])) {
          itemById[findFather[idKey]] = { ...findFather, children: [] }
        }
        filterAllFatherData(data, findFather)
      }
    }
  }
  let filterAllSonData = (data, itemData) => {
    let findSon = data.filter((ite) => itemData[idKey] === ite[parentIdKey])
    if (findSon.length) {
      findSon.forEach((son) => {
        if (!itemById.hasOwnProperty(son[idKey])) {
          itemById[son[idKey]] = { ...son, children: [] }
        }
        filterAllSonData(data, son)
      })
    }
  }
  data.forEach((item) => {
    if (item[filterKey] === filterValue) {
      if (!itemById.hasOwnProperty(item[idKey])) {
        itemById[item[idKey]] = { ...item, children: [] }
      }

      filterAllFatherData(data, item)
      filterAllSonData(data, item)
    }
  })

  Object.values(itemById).forEach((item) => {
    const parentId = item[parentIdKey]
    if (itemById.hasOwnProperty(parentId)) {
      itemById[parentId].children.push(itemById[item[idKey]])
    } else {
      tree.push(itemById[item[idKey]])
    }
  })
  return tree
}

/**
 *
 * @param {*} data 可以转树状数组的平铺数组
 * @param {*} id 要找子集的对应对象
 * @param {*} idKey id字段Key
 * @param {*} parentIdKey parentId字段Key
 * @param {*} withIdData 返回值是否携带id对应的obj
 * @returns
 */
export function getSonObjsById(
  data,
  id,
  idKey = 'id',
  parentIdKey = 'parentId',
  withIdData = true
) {
  data.forEach((item) => {
    if (item.parentIds) {
      let parentArray = item.parentIds
        .split('][')
        .map((id) => parseInt(id.replace('[', '').replace(']', '')))
      item[parentIdKey] = parentArray[parentArray.length - 1]
    }
  })
  let itemById = {}
  let sonArr = []
  let filterAllSonData = (data, itemData = {}) => {
    let findSon = data.filter((ite) => itemData[idKey] === ite[parentIdKey])
    if (findSon.length) {
      findSon.forEach((son) => {
        if (!itemById.hasOwnProperty(son[idKey])) {
          itemById[son[idKey]] = son
        }
        filterAllSonData(data, son)
      })
    }
  }
  let idData = data.find((item) => item.id === id)
  filterAllSonData(data, idData)
  Object.values(itemById).forEach((item) => {
    sonArr.push(itemById[item[idKey]])
  })
  withIdData && idData && sonArr.unshift(idData)
  return sonArr
}

/**
 * 把树状对象平铺
 * @param {*} tree
 * @param {*} parentIdKey
 * @param {*} childrenKey
 * @param {*} idKey
 * @returns
 */
export function flattenTree(
  tree,
  parentIdKey = 'parentId',
  childrenKey = 'children',
  idKey = 'id'
) {
  const flattenedTree = []

  function flatten(node, parentId = null) {
    const flattenedNode = { ...node }
    flattenedNode[parentIdKey] = parentId

    delete flattenedNode[childrenKey]

    flattenedTree.push(flattenedNode)

    if (node[childrenKey]) {
      for (const child of node[childrenKey]) {
        flatten(child, node[idKey])
      }
    }
  }

  for (const node of tree) {
    flatten(node)
  }

  return flattenedTree
}
/**
 * 获取和id一个层级的数据
 * @param {*} arrTree
 * @param {*} id
 * @returns
 */
export function getIdTierData(arrTree, id, idKey = 'soleId') {
  // 定义一个结果数组
  let result = []
  // 定义一个辅助函数，用于递归遍历树
  function traverse(arrTreeIn, idIn, idKey = 'soleId') {
    // 如果当前节点的层级等于目标层级，就将其加入结果数组
    arrTreeIn.forEach((item) => {
      let findData = arrTreeIn.find((ite) => ite[idKey] === idIn)
      if (findData) {
        result = arrTreeIn
      } else {
        if (item.children) {
          traverse(item.children, idIn, idKey)
        }
      }
    })
  }
  // 从根节点开始遍历，初始层级为1
  traverse(arrTree, id, idKey)
  // 返回结果数组
  return result
}
/**
 * 获取和id父级一个层级的数据
 * @param {*} arrTree
 * @param {*} id
 * @returns
 */
export function getIdFatherTierData(arrTree, id, idKey = 'soleId') {
  // 定义一个结果数组
  let fatherResult = []
  // 定义一个辅助函数，用于递归遍历树
  function traverse(arrTreeIn, idIn, idKey = 'soleId', fatherArr = []) {
    // 如果当前节点的层级等于目标层级，就将其加入结果数组
    arrTreeIn.forEach((item) => {
      let findData = arrTreeIn.find((ite) => ite[idKey] === idIn)
      if (findData) {
        fatherResult = fatherArr
      } else {
        if (item.children) {
          traverse(item.children, idIn, idKey, arrTreeIn)
        }
      }
    })
  }
  // 从根节点开始遍历，初始层级为1
  traverse(arrTree, id, idKey)
  // 返回结果数组
  return fatherResult
}
/**
 * 获取和id父级的数据
 * @param {*} arrTree
 * @param {*} id 要查的id数据
 * @param {*} idKey id值对应的idKey
 * @returns
 */
export function getIdFatherData(arrTree, id, idKey = 'soleId') {
  // 定义一个结果数组
  let fatherData = null
  // 定义一个辅助函数，用于递归遍历树
  function traverse(arrTreeIn, idIn, idKey = 'soleId', toFatherDate = null) {
    // 如果当前节点的层级等于目标层级，就将其加入结果数组
    arrTreeIn.forEach((item) => {
      let findData = arrTreeIn.find((ite) => ite[idKey] === idIn)
      if (findData) {
        fatherData = toFatherDate
      } else {
        if (item.children) {
          traverse(item.children, idIn, idKey, item)
        }
      }
    })
  }
  // 从根节点开始遍历，初始层级为1
  traverse(arrTree, id, idKey)
  // 返回结果数组
  return fatherData
}
/**
 * 通过传tree数据 和id获取和这个id的所有父级
 * @param {*} treeData
 * @param {*} id
 * @returns  [1,2,5]
 */
export function setIdsFatherArr(treeData, id) {
  let flatData = flattenTree(treeData)
  let parentIdArr = []
  if (!id) {
    return []
  }
  function findFatherId(inFlatData, id) {
    let findData = inFlatData.find((item) => item.id === id)
    if (
      findData &&
      findData.parentId &&
      inFlatData.find((ite) => ite.id === findData.parentId)
    ) {
      parentIdArr.unshift(findData.parentId)
      findFatherId(inFlatData, findData.parentId)
    } else {
      return
    }
  }
  findFatherId(flatData, id)
  parentIdArr.push(id)
  return parentIdArr
}
/**
 * 获取随机数
 * @param {*} sstr
 * @returns
 */
export function createMd5Id(sstr = '') {
  const str =
    `${new Date().getTime()}-${parseInt(
      Math.random() * 10000
    )}-${Math.random()}` + sstr
  const res = md5(sstr || str)
  return res
}

/**
 * 把对象的key转成驼峰
 * @param {*} obj
 * @returns
 */
export function toCamelCase(obj) {
  console.log('里', obj)
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    acc[camelKey] = obj[key]
    return acc
  }, {})
}

/**
 * 驼峰转下划线写法
 * @param {*} obj
 * @returns
 */
export function camelToUnderScore(obj) {
  const newObj = {}
  Object.keys(obj).forEach((key) => {
    const underscoreKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
    newObj[underscoreKey] = obj[key]
  })
  return newObj
}
/**
 * 加密
 * @param {*} value 要加密的字符串
 */
export function encrypt(value) {
  if (value == null || value === '') return null
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(import.meta.env.VITE_APP_PUBLI_CKEY)
  return encodeURIComponent(encrypt.encrypt(value))
}
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}

export default {
  hasClass,
  addClass,
  removeClass,
  deepClone,
  deepMerge,
  validatorNum,
  validatorNumInteger,
  dateFtt,
  buildTree,
  filterTreeByProperty,
  flattenTree,
  getIdTierData,
  getIdFatherTierData,
  getIdFatherData,
  setIdsFatherArr,
  createMd5Id,
  getSonObjsById,
  toCamelCase,
  camelToUnderScore,
  encrypt,
  isExternal
}
