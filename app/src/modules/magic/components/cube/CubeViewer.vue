<template>
  <div v-if="!loading" class="cube-viewer">
    {{ id }} {{ cube.name }}
  </div>

  <div v-else class="alert alert-warning">loading</div>
</template>


<script>
import axios from 'axios'


export default {
  name: 'CubeViewer',

  data() {
    return {
      cube: null,
      id: this.$route.params.id,
      loading: true,
    }
  },

  methods: {
    async loadCube() {
      this.loading = true

      const requestResult = await axios.post('/api/cube/fetch', {
        cubeId: this.id
      })

      if (requestResult.data.status === 'success') {
        console.log(requestResult.data)
        this.cube = requestResult.data.cube
        this.loading = false
      }
      else {
        alert('Error loading cube: ' + this.id)
      }
    },
  },

  watch: {
    async $route() {
      this.id = this.$route.params.id
      await this.loadCube()
    },
  },

  async mounted() {
    await this.loadCube()
  },
}
</script>
