import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import UnoCSS from 'unocss/vite'
import { loadEnv } from 'vite'

const pathSrc = path.resolve(__dirname, 'src')
// https://vitejs.dev/config/
export default defineConfig((mode) => {
  const env = loadEnv(mode.mode, process.cwd())
  return {
    plugins: [
      vue(),
      UnoCSS({
        /* options */
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(pathSrc, 'assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core'],
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
        vueTemplate: true, // 是否在 vue 模板中自动导入
      }),
      Components({
        dirs: ['src'],
        extensions: ['vue'],
        resolvers: [
          // 自动注册图标组件
          // IconsResolver({
          //   enabledCollections: ['ep'],
          // }),
          IconsResolver(),
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
        ],
      }),
      Icons({
        autoInstall: true,
      }),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: {
      host: '0.0.0.0', //解决vite use--host to expose
      port: Number(env.VITE_APP_PORT),
      open: true,
      proxy: {
        /**
         * 反向代理解决跨域配置
         * http://localhost:3000/dev-api/users (F12可见请求路径) => http://localhost:8989/users (实际请求后端 API 路径)
         *
         * env.VITE_APP_BASE_API: /dev-api
         * env.VITE_APP_TARGET_URL: http://localhost:8989
         * env.VITE_APP_TARGET_BASE_API: ""
         */
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          target: env.VITE_APP_TARGET_URL,
          rewrite: (path) =>
            path.replace(
              new RegExp('^' + env.VITE_APP_BASE_API),
              env.VITE_APP_TARGET_BASE_API
            ),
        },
      },
    },
  }
})
