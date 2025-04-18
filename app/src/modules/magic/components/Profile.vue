<template>
  <div class="magic-profile container">
    <div class="row">

      <div class="col">
        <MagicMenu />
        <SectionHeader>My Data</SectionHeader>
      </div>

      <div class="col">
        <DraftList />
      </div>

      <div class="col">
        <SectionHeader>
          <div class="d-flex justify-content-between">
            <div>My Cubes</div>
            <div @click="createCube"><i class="bi bi-plus-square"></i></div>
          </div>
        </SectionHeader>
        <div v-for="cube in myCubes" :key="cube._id">
          <router-link :to="`/magic/cube/${cube._id}`">{{ cube.name }}</router-link>
        </div>

        <SectionHeader>Other Cubes</SectionHeader>
        <div v-for="cube in otherCubes" :key="cube._id">
          <router-link :to="`/magic/cube/${cube._id}`">{{ cube.name }}</router-link>
        </div>
      </div>

    </div>

  </div>
</template>


<script>
import { mapState } from 'vuex'

import DraftList from './DraftList'
import MagicMenu from './MagicMenu'
import SectionHeader from '@/components/SectionHeader'

export default {
  name: 'MagicProfile',

  components: {
    DraftList,
    MagicMenu,
    SectionHeader,
  },

  data() {
    return {
      actor: this.$store.getters['auth/user'],
    }
  },


  computed: {
    ...mapState('magic/cube', ['cubes']),

    myCubes() {
      return this.cubes.filter(cube => cube.userId === this.actor._id)
    },

    otherCubes() {
      return this.cubes.filter(cube => cube.userId !== this.actor._id)
    },
  },

  methods: {
    async createCube() {
      const cubeId = await this.$store.dispatch('magic/cube/create')
      this.$router.push('/magic/cube/' + cubeId)
    },
  },

  created() {
    this.$store.dispatch('magic/cube/loadAllCubes')
  }
}
</script>


<style scoped>
.file-manager {
  border: 1px solid darkgray;
  background-color: var(--bs-light);
  min-height: 17rem;
  border-radius: .25em;
}
</style>
