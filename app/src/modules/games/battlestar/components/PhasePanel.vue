<template>
  <div class="phase-panel">
    <b-form-group
      id="phase-select-group"
      label-cols="3"
      labelFor="phase-selected"
    >
      <template v-slot:label>
        <div @click="toggleDetails">
          <span>
            Phase
          </span>
          <font-awesome-icon v-if="showDetails" :icon="['fas', 'chevron-down']" />
          <font-awesome-icon v-else :icon="['fas', 'chevron-up']" />
        </div>
      </template>

      <b-form-select
        id="phase-select"
        :options="options"
        :value="phase"
        @change="phaseChanged"
      >
      </b-form-select>
    </b-form-group>

    <div v-if="showDetails">
      <SetupCharacterSelection v-if="phase === 'setup-character-selection'" />
      <SetupDistributeTitleCards v-if="phase === 'setup-distribute-title-cards'" />
      <SetupDistributeLoyaltyCards v-if="phase === 'setup-distribute-loyalty-cards'" />

      <MainCrisis v-if="phase === 'main-crisis'" />
      <MainNextPlayer v-if="phase === 'main-next-player'" />
      <MainReceiveSkills v-if="phase === 'main-receive-skills'" />

      <div class="phase-description">

        <div v-if="phase === 'setup-receive-skills'">
          <p>Each player, <strong>except</strong> the starting player ({{ players[0].name }}), receives three skill cards of types they could normally receive during the receive skills step.</p>
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
  </div>
</template>


<script>
import MainCrisis from './MainCrisis'
import MainNextPlayer from './MainNextPlayer'
import MainReceiveSkills from './MainReceiveSkills'
import SetupCharacterSelection from './SetupCharacterSelection'
import SetupDistributeLoyaltyCards from './SetupDistributeLoyaltyCards'
import SetupDistributeTitleCards from './SetupDistributeTitleCards'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
library.add(faChevronDown, faChevronUp)


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
      {
        value: 'main-next-player',
        text: 'Next Player',
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
    MainCrisis,
    MainNextPlayer,
    MainReceiveSkills,
    SetupCharacterSelection,
    SetupDistributeLoyaltyCards,
    SetupDistributeTitleCards,
  },

  data() {
    return {
      options,
      showDetailsValue: false,
    }
  },

  computed: {
    phase() {
      return this.$store.getters['bsg/phase']
    },

    players() {
      return this.$store.getters['bsg/players']
    },

    showDetails() {
      if (this.phase === 'main-next-player') {
        return true
      }
      else {
        return this.showDetailsValue
      }
    },
  },

  methods: {
    phaseChanged(value) {
      this.$store.commit('bsg/phaseSet', value)
    },

    toggleDetails() {
      this.showDetailsValue = !this.showDetailsValue
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

.phase-selector {
  display: flex;
  flex-direction: row;
}
</style>
