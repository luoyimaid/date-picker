import ly_datepicker from './date-picker.vue';
const datepickerPlugin = {
    install: function(Vue) {
        Vue.component(ly_datepicker.name, ly_datepicker)
    }
}
    // global 情况下 自动安装
    if (typeof window !== 'undefined' && window.Vue) {
        window.Vue.use(ly_datepicker)
    }
    // 导出模块
    export default ly_datepicker