<template>
  <div class="phase-panel">
    <div class="heading">
      Status
    </div>

    <b-form-group
      id="phase-select-group"
      label-cols="2"
      label="Phase"
      labelFor="phase-selected"
    >
      <b-form-select
        id="phase-select"
        :options="options"
        :value="phase"
        @change="phaseChanged"
      >
      </b-form-select>
    </b-form-group>

    <div class="phase-description">

      <div v-if="phase === 'setup-character-selection'">
        <p>You can see and select characters from the info menu.</p>
        <p>There are four character types: political leader, military leader, pilot, support.</p>
        <p>Starting with the first player ({{ firstPlayer }}), each player chooses from the remaining characters a character of the type that is most plentiful. The exception is that a support character can be chosen at any time.</p>
        <p class="heading">Remaining:</p>
        <b-table small :items="characterTypeCounts"></b-table>
      </div>

      <div v-if="phase === 'setup-distribute-title-cards'">
        <b-button block @click="distributeTitleCards">click to distribute title cards</b-button>
      </div>

      <div v-if="phase === 'setup-distribute-loyalty-cards'">
        <b-button
          block
          variant="primary"
          @click="distributeLoyaltyCards"
        >
          click to distribute loyalty cards
        </b-button>
        <p>Clicking this a second time will redistribute all of the loyalty cards.</p>
      </div>

    </div>
  </div>
</template>


<script>
import util from '@/util.js'
import loyaltyCards from '../res/loyalty.js'

const options = [
  {
    label: 'Setup',
    options: [
      {
        value: 'setup-character-selection',
        text: 'Character Selection',
      },
      {
        value: 'setup-distribute-title-cards',
        text: 'Distribute Title Cards',
      },
      {
        value: 'setup-distribute-loyalty-cards',
        text: 'Distribute Loyalty Cards',
      },
      {
        value: 'setup-receive-skills',
        text: 'Receive Skills',
      },
    ],
  },
  {
    label: 'Main',
    options: [
      {
        value: 'main-receive-skills',
        text: 'Receive Skills',
      },
      {
        value: 'main-movement',
        text: 'Movement',
      },
      {
        value: 'main-action',
        text: 'Action',
      },
      {
        value: 'main-crisis',
        text: 'Crisis',
      },
      {
        value: 'main-activate-cylon-ships',
        text: 'Activate Cylon Ships',
      },
      {
        value: 'main-prepare-for-jump',
        text: 'Prepare for Jump',
      },
      {
        value: 'main-hand-limit',
        text: 'Hand Limit',
      },
    ]
  },
  {
    label: 'Skill Check',
    options: [
      {
        value: 'crisis-read-card',
        text: 'Read Card',
      },
      {
        value: 'crisis-destiny-deck',
        text: 'Play from Destiny Deck',
      },
      {
        value: 'crisis-play-skills',
        text: 'Play Skills',
      },
      {
        value: 'crisis-determine-result',
        text: 'Determine Result',
      },
    ],
  },
  {
    label: 'Jump',
    options: [
      {
        value: 'jump-remove-ships',
        text: 'Remove Ships',
      },
      {
        value: 'jump-choose-destination',
        text: 'Choose Destination',
      },
      {
        value: 'jump-follow-instructions',
        text: 'Follow Instructions',
      },
      {
        value: 'jump-kobol-instructions',
        text: 'Kobol Instructions',
      },
      {
        value: 'jump-reset-jump-preparation-track',
        text: 'Reset Jump Preparation Track',
      },
    ],
  },
]


export default {
  name: 'PhasePanel',

  props: {
    characters: Array,
    loyaltyCards: Array,
  },

  data() {
    return {
      options,
    }
  },

  computed: {
    characterTypeCounts() {
      const claimed = this.$store.state.bsg.game.players.map(p => p.character)
      const counts = {
        Politics: 0,
        Military: 0,
        Pilot: 0,
        Support: 0,
      }

      for (const char of this.characters) {
        if (!claimed.includes(char.name)) {
          counts[char['role']] += 1
        }
      }

      const tableItems = Object.entries(counts).map(arr => ({
        role: arr[0],
        count: arr[1]
      }))

      return tableItems
    },

    firstPlayer() {
      return this.$store.state.bsg.game.players[0].name
    },

    phase() {
      return this.$store.state.bsg.game.phase
    },
  },

  methods: {
    _assignTitle(title) {
      const key = `${title} line of succession order`
      const characterOrdering = [...this.characters].sort((l, r) => l[key] - r[key])
      const players = this.$store.state.bsg.game.players

      for (const char of characterOrdering) {
        for (const player of players) {
          if (player.character === char.name) {
            this.$store.commit('bsg/titleAssign', {
              title: title,
              character: char.name,
            })
            return
          }
        }
      }

      throw "Unable to assign title: " + title
    },

    distributeLoyaltyCards() {
      const players = this.$store.state.bsg.game.players
      const numPlayers = players.length

      let humanCards = loyaltyCards.filter(c => c.name === 'You Are Not a Cylon')
      const cylonCards = loyaltyCards.filter(c => c.name === 'You Are a Cylon')
      util.shuffleArray(humanCards)
      util.shuffleArray(cylonCards)

      const numCylons = numPlayers < 5 ? 1 : 2
      let numHumans = numPlayers < 5 ? numPlayers + 2 : numPlayers + 3
      if (players.some(p => p.character === "Gaius Baltar")) {
        numHumans += 1
      }
      if (players.some(p => p.character === "Sharon Valerii")) {
        numHumans += 1
      }

      // Build the initial deck
      const deck = [...cylonCards.slice(0, numCylons), ...humanCards.slice(0, numHumans)]
      util.shuffleArray(deck)
      this.$store.commit('bsg/loyaltyDeckSet', deck)

      for (const player of players) {
        this.$store.commit('bsg/loyaltyCardDraw', player._id)

        if (player.character === 'Gaius Baltar') {
          this.$store.commit('bsg/loyaltyCardDraw', player._id)
        }
      }
    },

    distributeTitleCards() {
      this._assignTitle('admiral')
      this._assignTitle('president')
    },

    phaseChanged(value) {
      this.$store.commit('bsg/phaseSet', value)
    },
  },

}
</script>


<style scoped>
.phase-description {
  color: #444;
  font-size: .7em;
  margin-left: 1em;
  margin-right: 1em;
}
</style>
