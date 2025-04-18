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
export default {
  name: 'PublicCubes',

  data() {
    return {
      cubes: []
    }
  },

  async mounted() {
    const { cubes } = await this.$post('/api/magic/cube/all')
    this.cubes = cubes.sort((l, r) => l.name.localeCompare(r.name))
  },
}
</script>
