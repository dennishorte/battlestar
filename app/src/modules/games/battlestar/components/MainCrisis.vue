<template>
  <div class="main-crisis">
    <div class="description">
      <p>The active player turns over the top card of the crisis deck (by moving it to the common zone).</p>

      <b-button-group v-if="isChoice" class="w-100 mb-2">
        <b-button @click="help('none')" variant="danger">none</b-button>
        <b-button @click="help('a little')" variant="warning">a little</b-button>
        <b-button @click="help('a lot')" variant="primary">a lot</b-button>
      </b-button-group>

      <b-row>
        <b-col>
          <CrisisCard v-if="card.name" :card="card" />
        </b-col>

        <b-col v-if="isChoice">
          <div
            v-for="player in playersOrdered"
            :key="player.name"
          >
            <div class="heading">{{ player.name }}</div>
            <div class="indented">
              <span v-if="!!player.crisisHelp">
                {{ player.crisisHelp }}
              </span>
              <span v-else class="faint">
                waiting
              </span>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>


  </div>
</template>


<script>
import CrisisCard from './CrisisCard'

export default {
  name: 'MainCrisis',

  components: {
    CrisisCard,
  },

  computed: {
    card() {
      return this.$store.getters['bsg/commonCrisis'] || {}
    },

    isChoice() {
      return this.card
          && (this.card.type === 'Skill Check' || this.card.type === 'Optional Skill Check')
    },

    playersOrdered() {
      const players = [...this.$store.getters['bsg/players']]
      const viewer = this.$store.getters['bsg/uiViewer']
      while (players[players.length - 1].name !== viewer.name) {
        players.push(players.shift())
      }

      return players
    },
  },

  methods: {

    help(amount) {
      this.$store.commit('bsg/crisisHelp', {
        playerName: this.$store.getters['bsg/uiViewer'].name,
        amount,
      })
  },

},

}
</script>


<style scoped>
.description {
  color: #444;
  font-size: .7em;
}

.faint {
  color: gray;
}

.indented {
  margin-left: .5em;
  margin-bottom: .25em;
  margin-top: -.25em;
}
</style>
