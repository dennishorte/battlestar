<template>
  <div class="main-crisis">
    <div class="description">

      <b-button
        v-if="!activeCrisis"
        @click="drawCrisis"
        variant="primary"
        block>
        draw crisis card
      </b-button>

      <b-button-group v-else class="w-100 mb-2" style="background-color: white;">
        <b-button
          @click="setStep('discuss')"
          :variant="crisisStep === 'discuss' ? 'primary' : 'outline-primary'">
          discuss
        </b-button>

        <b-button
          @click="setStep('decide')"
          :variant="crisisStep === 'decide' ? 'primary' : 'outline-primary'">
          decide
        </b-button>

        <b-button
          @click="setStep('add cards')"
          :variant="crisisStep === 'add cards' ? 'primary' : 'outline-primary'">
          add cards
        </b-button>

        <b-button
          @click="setStep('resolve')"
          :variant="crisisStep === 'resolve' ? 'primary' : 'outline-primary'">
          resolve
        </b-button>
      </b-button-group>

      <b-button-group v-if="isSkillCheck && crisisStep === 'discuss'" class="w-100 mb-2">
        <b-button @click="help('none')" variant="danger">none</b-button>
        <b-button @click="help('a little')" variant="warning">a little</b-button>
        <b-button @click="help('a lot')" variant="primary">a lot</b-button>
      </b-button-group>

      <b-row>
        <b-col>
          <CrisisCard v-if="card.name" :card="card" />
        </b-col>

        <b-col v-if="isSkillCheck">
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

              <span v-if="player.crisisCount >= 0">
                {{ player.crisisCount }}
              </span>
              <span v-else class="faint">
                waiting
              </span>
            </div>
          </div>

          <div v-if="crisisStep === 'add cards'">
            <b-button variant="warning" @click="addDestinyCards" :disabled="crisisDestinyAdded">
              Add Destiny Cards
            </b-button>

            <b-button variant="success" @click="doneAdding" :disabled="crisisDone">
              Done Adding My Cards
            </b-button>
          </div>

        </b-col>
      </b-row>
    </div>


  </div>
</template>


<script>
import CrisisCard from './CrisisCard'

import { util } from 'battlestar-common'

export default {
  name: 'MainCrisis',

  components: {
    CrisisCard,
  },

  computed: {
    card() {
      return this.activeCrisis || {}
    },

    activeCrisis() {
      return this.$game.getCardActiveCrisis()
    },

    crisisDestinyAdded() {
      return false
    },

    crisisDone() {
      return false
    },

    crisisStep() {
      return ''
    },

    isSkillCheck() {
      return this.card
          && (this.card.type === 'Skill Check' || this.card.type === 'Optional Skill Check')
    },

    playersOrdered() {
      const players = util.deepcopy(this.$game.getPlayerAll())
      const activePlayer = this.$game.getPlayerCurrentTurn()
      while (players[players.length - 1].name !== activePlayer.name) {
        players.push(players.shift())
      }

      return players
    },
  },

  methods: {
    addDestinyCards() {
      console.log('add destiny cards')
    },

    drawCrisis() {
      console.log('draw crisis card')
    },

    doneAdding() {
      console.log('done adding cards')
    },

    help(amount) {
      console.log('help: ', amount)
    },

    setStep(name) {
      console.log('set crisis step', name)
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
