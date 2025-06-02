<template>
  <div class="magic-profile container">
    <div class="row">

      <div class="col">
        <MagicMenu />
        <PlayerDecks @deck-clicked="viewDeck" />
      </div>

      <div class="col">
        <DraftList />
      </div>

      <div class="col">
        <SectionHeader>
          <div class="d-flex justify-content-between">
            <div>My Cubes</div>
            <div @click="createCube"><i class="bi bi-plus-square"/></div>
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

import PlayerDecks from './deck/PlayerDecks'
import DraftList from './DraftList'
import MagicMenu from './MagicMenu'
import SectionHeader from '@/components/SectionHeader'

export default {
  name: 'MagicProfile',

  components: {
    PlayerDecks,
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
      const cube = await this.$store.dispatch('magic/cube/create')
      this.$router.push('/magic/cube/' + cube._id)
    },

    viewDeck(deckId) {
      this.$router.push(`/magic/deck/${deckId}`)
    },
  },

  created() {
    this.$store.dispatch('magic/cube/loadAllCubes')
  }
}
</script>


<style scoped>
</style>
