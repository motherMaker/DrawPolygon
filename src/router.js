const routers = [{
    path: '/',
    meta: {
        title: '描点工具页面'
    },
    component: (resolve) => require(['./views/index.vue'], resolve)
}];
export default routers;