<template>
  <MagicWrapper :alsoLoading="loadingCube">
    <div class="cube-viewer">
      {{ id }} {{ cube.name }}
    </div>
  </MagicWrapper>
</template>


<script>
import axios from 'axios'

import MagicWrapper from '../MagicWrapper'


export default {
  name: 'CubeViewer',

  components: {
    MagicWrapper,
  },

  data() {
    return {
      cube: null,
      id: this.$route.params.id,
      loadingCube: true,
    }
  },

  methods: {
    async loadCube() {
      this.loading = true

      const requestResult = await axios.post('/api/magic/cube/fetch', {
        cubeId: this.id
      })

      if (requestResult.data.status === 'success') {
        console.log(requestResult.data)
        this.cube = requestResult.data.cube
        this.loadingCube = false
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
