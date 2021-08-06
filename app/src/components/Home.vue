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
import axios from 'axios'
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
  methods: {
    async getAllUsers() {
      const response = await axios('/api/users')
      console.log(response)
    },
  },
  mounted() {
    this.getAllUsers()
  }
}
</script>
