import VirtualScroll from './VScroll.vue'

const plugin = {
    install(Vue) {
        Vue.component('VirtualScroll', VirtualScroll)
    }
}

export default plugin