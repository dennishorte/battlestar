<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="css">
#app {
    font-family: Verdana, sans-serif;
}

.section-heading {
    font-size: 1.6em;
    font-weight: 450;
}

.link-unstyled, .link-unstyled:link, .link-unstyled:hover {
    color: inherit;
    text-decoration: inherit;
}
</style>
