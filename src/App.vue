<template>
  <div id="app">
    <x-flow></x-flow>
  </div>
</template>

<script>
import "normalize.css";
import xFlow from "./components/xFlow";
export default {
  name: "app",
  components: {
    xFlow
  }
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
