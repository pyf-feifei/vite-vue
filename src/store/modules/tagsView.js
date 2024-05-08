import { defineStore } from 'pinia'
const useTagsViewStore = defineStore('tagsView', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      visitedViews: reactive([]),
      cachedViews: reactive([]),
    }
  },
  getters: {},
  actions: {
    delAllViews() {
      return new Promise((resolve) => {
        const affixTags = this.visitedViews.filter((tag) => tag?.affix)
        this.visitedViews = affixTags
        this.cachedViews = []
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews],
        })
      })
    },
    /**
     * 添加缓存视图到缓存视图列表中
     */
    addCachedView(view) {
      const viewName = view.name
      // 如果缓存视图名称已经存在于缓存视图列表中，则不再添加
      if (this.cachedViews.includes(viewName)) {
        return
      }

      // 如果视图需要缓存（keepAlive），则将其路由名称添加到缓存视图列表中
      if (view.keepAlive) {
        cachedViews.push(viewName)
      }
    },
    /**
     * 从已访问视图列表中删除指定的视图
     */
    delVisitedView(view) {
      return new Promise((resolve) => {
        for (const [i, v] of this.visitedViews.entries()) {
          // 找到与指定视图路径匹配的视图，在已访问视图列表中删除该视图
          if (v.path === view.path) {
            this.visitedViews.splice(i, 1)
            break
          }
        }
        resolve([...this.visitedViews])
      })
    },
    /**
     * 从缓存的视图列表中删除指定的视图
     */
    delCachedView(view) {
      const viewName = view.name
      return new Promise((resolve) => {
        const index = this.cachedViews.indexOf(viewName)
        index > -1 && this.cachedViews.splice(index, 1)
        resolve([...this.cachedViews])
      })
    },
    /**
     *  删除visitedViews和cachedViews
     */
    delView(view) {
      return new Promise((resolve) => {
        this.delVisitedView(view)
        this.delCachedView(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews],
        })
      })
    },
    /**
     * 从已访问视图列表中删除指定以外的其他的视图
     * @param {*} view
     * @returns
     */
    delOtherVisitedViews(view) {
      return new Promise((resolve) => {
        this.visitedViews = this.visitedViews.filter((v) => {
          return v?.affix || v.path === view.path
        })
        resolve([...this.visitedViews])
      })
    },
    /**
     * 从缓存的视图列表中删除指定以外的其他视图
     * @param {*} view
     * @returns
     */
    delOtherCachedViews(view) {
      const viewName = view.name
      return new Promise((resolve) => {
        const index = this.cachedViews.indexOf(viewName)
        if (index > -1) {
          this.cachedViews = this.cachedViews.slice(index, index + 1)
        } else {
          // if index = -1, there is no cached tags
          this.cachedViews = []
        }
        resolve([...this.cachedViews])
      })
    },
    /**
     * 关闭其他标签
     * @param {*} view
     * @returns
     */
    delOtherViews(view) {
      return new Promise((resolve) => {
        this.delOtherVisitedViews(view)
        this.delOtherCachedViews(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews],
        })
      })
    },
    /**
     * 更新当前tag
     * @param {*} view
     */
    updateVisitedView(view) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
    /**
     * 添加已访问视图到已访问视图列表中
     */
    addVisitedView(view) {
      // 如果已经存在于已访问的视图列表中，则不再添加
      if (this.visitedViews.some((v) => v.path === view.path)) {
        return
      }
      // 如果视图是固定的（affix），则在已访问的视图列表的开头添加
      if (view.affix) {
        this.visitedViews.unshift(view)
      } else {
        // 如果视图不是固定的，则在已访问的视图列表的末尾添加
        this.visitedViews.push(view)
      }
    },
    /**
     * 添加缓存视图到缓存视图列表中
     */
    addCachedView(view) {
      const viewName = view.name
      // 如果缓存视图名称已经存在于缓存视图列表中，则不再添加
      if (this.cachedViews.includes(viewName)) {
        return
      }

      // 如果视图需要缓存（keepAlive），则将其路由名称添加到缓存视图列表中
      if (view.keepAlive) {
        this.cachedViews.push(viewName)
      }
    },

    /**
     * 添加tage路由到visitedViews和cachedViews,
     * @param {*} view
     */
    addView(view) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    /**
     * 关闭左侧标签
     * @param {*} view
     * @returns
     */
    delLeftViews(view) {
      return new Promise((resolve) => {
        const currIndex = this.visitedViews.findIndex(
          (v) => v.path === view.path
        )
        if (currIndex === -1) {
          return
        }
        this.visitedViews = this.visitedViews.filter((item, index) => {
          if (index >= currIndex || item?.affix) {
            return true
          }

          const cacheIndex = this.cachedViews.indexOf(item.name)
          if (cacheIndex > -1) {
            this.cachedViews.splice(cacheIndex, 1)
          }
          return false
        })
        resolve({
          visitedViews: [...this.visitedViews],
        })
      })
    },
    /**
     * 关闭右侧标签
     * @param {*} view
     * @returns
     */
    delRightViews(view) {
      return new Promise((resolve) => {
        const currIndex = this.visitedViews.findIndex(
          (v) => v.path === view.path
        )
        if (currIndex === -1) {
          return
        }
        this.visitedViews = this.visitedViews.filter((item, index) => {
          if (index <= currIndex || item?.affix) {
            return true
          }
        })
        resolve({
          visitedViews: [...this.visitedViews],
        })
      })
    },
  },
})
export default useTagsViewStore()
