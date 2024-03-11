import VuePlyr from 'vue-plyr' //VuePlyr
import 'vue-plyr/dist/vue-plyr.css' //加载VuePlyr样式
export function setupVuePlyr(app) {
  app.use(VuePlyr, {
    plyr: {},
  }) //加载VuePlyr
}
