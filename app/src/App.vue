<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',

  mounted() {
    if(process.env.NODE_ENV === 'development') {
      document.querySelector('body').style.backgroundImage = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='rgb(240, 240, 240)' font-size='20'>development</text></svg>")`
    }
  }
}
</script>

<style lang="css">
#app {
  font-family: Verdana, sans-serif;
  max-width: 400px;
  margin: auto;
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
