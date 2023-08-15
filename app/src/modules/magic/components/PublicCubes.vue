<template>
  <div class="public-cubes">
    <h3>Public Cubes</h3>

    <div v-for="cube in cubes">
      <router-link :to="'/magic/cube/' + cube._id">
        {{ cube.name }}
      </router-link>
    </div>

  </div>
</template>


<script>
import axios from 'axios'


export default {
  name: 'PublicCubes',

  data() {
    return {
      cubes: []
    }
  },

  async mounted() {
    const requestResult = await axios.post('/api/magic/cube/fetchPublic')

    if (requestResult.data.status === 'success') {
      this.cubes = requestResult.data.cubes.sort((l, r) => l.name.localeCompare(r.name))
    }

    else {
      alert('Error loading public cubes: ' + requestResult.data.message)
    }
  },
}
</script>
