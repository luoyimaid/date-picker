<template>
  <div id="app">
    <datePickerVue></datePickerVue>
  </div> 
</template>

<script>
import datePickerVue from './lib/date-picker.vue';
export default {
  name: 'app',

  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    datePickerVue
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
