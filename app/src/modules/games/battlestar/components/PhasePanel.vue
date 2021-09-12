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

    <SetupDistributeTitleCards v-if="phase === 'setup-distribute-title-cards'" />
    <LoyaltySetup v-if="phase === 'setup-distribute-loyalty-cards'" />


    <div class="phase-description">

      <div v-if="phase === 'setup-character-selection'">
        <p>You can see and select characters from the info menu.</p>
        <p>There are four character types: political leader, military leader, pilot, support.</p>
        <p>Starting with the first player ({{ firstPlayer }}), each player chooses from the remaining characters a character of the type that is most plentiful. The exception is that a support character can be chosen at any time.</p>
        <p class="heading">Remaining:</p>
        <b-table small :items="characterTypeCounts"></b-table>
      </div>

      <div v-if="phase === 'setup-receive-skills'">
        <p>Each player, <strong>except</strong> the starting player, receives three skill cards of types they could normally receive during the receive skills step.</p>

        <SkillDecks />
      </div>

      <div v-if="phase === 'main-receive-skills'">
        <p>The active player draws all of the skill cards listed on his character sheet.</p>
        <p>If the character sheet shows skills with a star, the player draws a card for only one of the starred skills.</p>

        <SkillDecks />
      </div>

      <div v-if="phase === 'main-movement'">
        <p>The active player can move his pawn to another location.</p>
        <p>Changing ships or docking a fighter requires the player to discard one skill card.</p>
        <p>You can move your pawn by clicking on it and then clicking on the location you want to move to.</p>
      </div>

      <div v-if="phase ==='main-action'">
        <p>Take a single action.</p>
        <p>Actions can be selected from the character's location, skill cards, quorum cards, or character abilities. All actions have the prefix "Action:"</p>
      </div>

      <div v-if="phase === 'jump-choose-destination'">
        <p>The admiral looks at two destination cards and selects one of them to be the destination.</p>
      </div>

    </div>
  </div>
</template>


<script>
import LoyaltySetup from './LoyaltySetup'
import SetupDistributeTitleCards from './SetupDistributeTitleCards'
import SkillDecks from './SkillDecks'


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

  components: {
    LoyaltySetup,
    SetupDistributeTitleCards,
    SkillDecks,
  },

  data() {
    return {
      options,
    }
  },

  computed: {
    admiralDestinationCards() {
      return this.$store.state.bsg.game.destination.admiralViewing
    },

    characterTypeCounts() {
      const players = this.$store.getters['bsg/players']
      const playerCharacters = players
        .map(player => {
          const hand = this.$store.getters['bsg/hand'](player.name).cards
          for (const card of hand) {
            if (card.kind === 'character') {
              return card
            }
          }
          return null
        })
        .filter(x => !!x)

      const counts = {
        Politics: 0,
        Military: 0,
        Pilot: 0,
        Support: 0,
      }

      const characterData = this.$store.getters['bsg/deckData']('character').cards
      for (const char of characterData) {
        if (!playerCharacters.find(ch => ch.name === char.name)) {
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

    setupLoyaltyComplete() {
      return this.$store.getters['bsg/setupLoyaltyComplete']
    },
  },

  methods: {
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
