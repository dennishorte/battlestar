<template>
<div class="hello">
  <Header />

  <div class="container">
    <div class="row">
      <div class="col">
        {{ message }}
      </div>
    </div>
  </div>

</div>
</template>

<script>
import Header from './Header.vue'

export default {
  name: 'Dashboard',
  components: {
    Header,
  },
  data() {
    return {
      message: "Hello, World!",
    }
  },
}
</script>
