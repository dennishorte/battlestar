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
      <Component :is="phaseComponent" />

      <div class="phase-description">

        <div v-if="phase === 'setup-receive-skills'">
          <p>Each player, <strong>except</strong> the starting player ({{ players[0].name }}), receives three skill cards of types they could normally receive during the receive skills step.</p>
        </div>

        <div v-if="phase === 'main-movement'">
          <p>The active player can move his pawn to another location.</p>
          <p>Changing ships or docking a fighter requires the player to discard one skill card.</p>
        </div>

        <div v-if="phase ==='main-action'">
          <p>Take a single action.</p>
          <p>Actions can be selected from the character's location, skill cards, quorum cards, or character abilities. All actions have the prefix "Action:"</p>
        </div>

        <div v-if="phase === 'jump-choose-destination'">
          <p>The admiral looks at two destination cards and selects one of them to be the destination.</p>
        </div>

        <div v-if="phase === 'jump-use-ftl-control'">
          <p>
            If the fleet marker has moved to one of the blue spaces of
            the Jump Preparation track, players may force the fleet to
            jump using the “FTL Control” location. If the fleet jumps due to
            someone activating this location, there is a chance that the
            fleet will lose some population.
          </p>
          <p>
            The current player rolls the die, and if a “6” or lower is rolled,
            then a number of population is lost equal to the number listed
            on the current space of the Jump Preparation track. Players
            then follow all steps for “Jumping the Fleet” on this page.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
import JumpRemoveShips from './JumpRemoveShips'
import MainActivateCylonShips from './MainActivateCylonShips'
import MainCleanup from './MainCleanup'
import MainCrisis from './MainCrisis'
import MainPrepareForJump from './MainPrepareForJump'
import MainReceiveSkills from './MainReceiveSkills'
import MainStartTurn from './MainStartTurn'
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
        value: 'main-start-turn',
        text: 'Start Turn',
      },
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
        value: 'main-cleanup',
        text: 'Cleanup',
      },
    ]
  },
  {
    label: 'Skill Check',
    options: [
      {
        value: 'skill-check-read-card',
        text: 'Read Card',
      },
      {
        value: 'skill-check-destiny-deck',
        text: 'Play from Destiny Deck',
      },
      {
        value: 'skill-check-play-skills',
        text: 'Play Skills',
      },
      {
        value: 'skill-check-determine-result',
        text: 'Determine Result',
      },
    ],
  },
  {
    label: 'Jump',
    options: [
      {
        value: 'jump-use-ftl-control',
        text: 'Use FTL Control',
      },
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
    JumpRemoveShips,
    MainActivateCylonShips,
    MainCrisis,
    MainPrepareForJump,
    MainCleanup,
    MainReceiveSkills,
    MainStartTurn,
    SetupCharacterSelection,
    SetupDistributeLoyaltyCards,
    SetupDistributeTitleCards,
  },

  data() {
    return {
      options,
      showDetailsValue: process.env.NODE_ENV === 'development' ? false : true,
    }
  },

  computed: {
    phase() {
      return ''
    },

    phaseComponent() {
      if (this.phase === 'setup-character-selection')
        return 'SetupCharacterSelection'

      if (this.phase === 'setup-distribute-title-cards')
        return 'SetupDistributeTitleCards'

      if (this.phase === 'setup-distribute-loyalty-cards')
        return 'SetupDistributeLoyaltyCards'

      if (this.phase === 'main-activate-cylon-ships')
        return 'MainActivateCylonShips'

      if (this.phase === 'main-crisis')
        return 'MainCrisis'

      if (this.phase === 'main-cleanup')
        return 'MainCleanup'

      if (this.phase === 'main-prepare-for-jump')
        return 'MainPrepareForJump'

      if (this.phase === 'main-receive-skills')
        return 'MainReceiveSkills'

      if (this.phase === 'main-start-turn')
        return 'MainStartTurn'

      if (this.phase === 'jump-remove-ships')
        return 'JumpRemoveShips'

      return null
    },

    players() {
      return this.$game.getPlayerAll()
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
      console.log('set phase', value)
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
