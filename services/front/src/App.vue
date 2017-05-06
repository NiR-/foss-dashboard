<template>
  <div id="app" class="container-fluid">
    <router-view></router-view>
  </div>
</template>

<script>
import {Dashboard} from './components';

export default {
  name: 'app',
  components: {
    Dashboard
  }
}
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
