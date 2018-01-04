import Vue from 'vue'
import Vuex from 'vuex'
import iView from 'iview'
import VueRouter from 'vue-router'
import Routers from './router'
import VueClipboard from 'vue-clipboard2'
import VueImgInputer from 'vue-img-inputer'
import Util from './libs/util'
import App from './app.vue'
import '../theme/index.less'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(iView)           // UI组件库
Vue.use(VueClipboard)   // 剪切板功能

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: Routers
}
const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    Util.title(to.meta.title)
    next()
})

router.afterEach(() => {
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

// vuex变量和方法
const store = new Vuex.Store({
    state: {
        count: 0,
        choosed: false,
        choosedDoorId: -1,
        editing: false,
        AllPolygons: {},
        AllPoints: {},
        CurrentIndex: 0,
        AllDatas: [],
        highLightDoorNum: -1
    },
    mutations: {
        increment(state) {
            state.count++
        },
        set_choosed(state, flag) {
            state.choosed = flag
        },
        set_choosedDoorId(state, doorId) {
            state.choosedDoorId = doorId
        },
        set_AllPolygons(state, polygons) {
            state.AllPolygons = polygons
        },
        set_AllPoints(state, points) {
            state.AllPoints = points
        },
        set_CurrentIndex(state, index) {
            state.CurrentIndex = index
        },
        set_tableDatas(state, obj) {
            state.AllDatas = obj
        },
        set_highLightDoorNum(state, doorId) {
            state.highLightDoorNum = doorId
        }
    }
})



new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})