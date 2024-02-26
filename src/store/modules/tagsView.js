import { defineStore } from 'pinia'
const useTagsViewStore = defineStore('tagsView', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      visitedViews: ref([]),
      cachedViews: ref([]),
    }
  },
  getters: {},
  actions: {
    delAllViews() {
      return new Promise((resolve) => {
        const affixTags = visitedViews.value.filter((tag) => tag?.affix)
        state.visitedViews = affixTags
        state.cachedViews = []
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews],
        })
      })
    },
    /**
     * 添加缓存视图到缓存视图列表中
     */
    addCachedView(view) {
      const viewName = view.name
      // 如果缓存视图名称已经存在于缓存视图列表中，则不再添加
      if (state.cachedViews.includes(viewName)) {
        return
      }

      // 如果视图需要缓存（keepAlive），则将其路由名称添加到缓存视图列表中
      if (view.keepAlive) {
        cachedViews.push(viewName)
      }
    },
  },
})
export default useTagsViewStore()
