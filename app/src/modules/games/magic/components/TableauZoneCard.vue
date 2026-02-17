<template>
  <div class="wrapper" :class="wrapperClasses">
    <div class="card-line">
      <CardListItem
        :card="card"
        :class="extraClasses"
        :hide-popup="hidden"
        :show-mana-cost="showManaCost"
        :show-power="showPower"
        :separate-faces="!hidden"
        :can-view="canView"
        :suppress-scar-icon="true"
      >
        <template v-slot:icons>
          <i class="bi bi-eye-fill" v-if="cardIsRevealed"/>
          <i class="bi bi-eye" v-else-if="cardIsViewed"/>
          <i class="bi bi-eye-slash-fill" v-else-if="cardIsSecret"/>

          <i class="bi bi-browser-edge" v-if="card.morph"/>
          <i class="bi bi-bookmark-fill" v-if="card.token"/>

          <i class="bi bi-lightning-fill" v-if="showScarIcon"/>

          <template v-if="showGravePowers">
            <i class="ms ms-cost ms-ability-aftermath" v-if="hasAftermath" />
            <i class="ms ms-cost ms-ability-disturb" v-if="hasDisturb" />
            <i class="ms ms-cost ms-ability-embalm" v-if="hasEmbalm" />
            <i class="ms ms-cost ms-ability-eternalize" v-if="hasEternalize" />
            <i class="ms ms-cost ms-ability-jumpstart" v-if="hasJumpstart" />
            <i class="ms ms-cost ms-flashback" v-if="hasFlashback" />
            <i class="ms ms-cost ms-ability-unearth" v-if="hasUnearth" />
            <i class="ms ms-cost ms-ability-escape" v-if="hasEscape" />
            <i class="ms ms-cost ms-flashback" v-if="hasHarmonize" />
            <i class="bi bi-bandaid ms ms-cost" v-if="hasReturnFromGrave" />
          </template>
        </template>

        <template v-slot:name="slotProps">{{ displayName(slotProps.faceIndex) }}</template>
      </CardListItem>
    </div>

    <div v-if="annotation" class="annotation">
      {{ annotation }}
    </div>

    <div ref="menu" :class="highlighted ? '' : 'd-none'">
      <DropdownMenu :notitle="true" :menu-end="true" class="menu dropdown">
        <DropdownButton @click.stop="twiddle" v-if="card.tapped">untap</DropdownButton>
        <DropdownButton @click.stop="twiddle" v-else>tap</DropdownButton>

        <DropdownButton @click.stop="closeup">close up</DropdownButton>

        <DropdownButton @click.stop="unmorph" v-if="card.morph">unmorph</DropdownButton>
        <DropdownButton @click.stop="morph" v-else>morph</DropdownButton>

        <DropdownButton @click.stop="unsecret" v-if="card.secret">unsecret</DropdownButton>
        <DropdownButton @click.stop="secret" v-else>secret</DropdownButton>

        <DropdownButton @click.stop="detach" v-if="card.attachedTo">detach</DropdownButton>
        <DropdownButton @click.stop="attach" v-else>attach</DropdownButton>

        <DropdownButton @click.stop="reveal">reveal</DropdownButton>
        <DropdownButton @click.stop="stack">stack</DropdownButton>

        <DropdownDivider />

        <li v-for="counter in Object.keys(card.counters)" :key="counter">
          <button @click.stop="() => {}" class="dropdown-item counter-button">
            <CounterButtons @click.stop="() => {}" :card="card" :name="counter" />
          </button>
        </li>

        <li v-for="tracker in Object.keys(card.trackers)" :key="tracker">
          <button @click.stop="() => {}" class="dropdown-item tracker-button">
            <CounterButtons
              @click.stop="() => {}"
              :card="card"
              :name="tracker"
              kind="tracker"
            />
          </button>
        </li>

        <DropdownDivider />

        <DropdownButton @click="toggleUntap">
          doesn't untap
          <i class="bi bi-check-square" v-if="card.noUntap"/>
          <i class="bi bi-square" v-else/>
        </DropdownButton>

      </DropdownMenu>
    </div>

  </div>
</template>


<script>
import { Dropdown as bsDropdown } from 'bootstrap'

import CardListItem from '@/modules/magic/components/CardListItem.vue'
import CounterButtons from './CounterButtons.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import DropdownButton from '@/components/DropdownButton.vue'
import DropdownDivider from '@/components/DropdownDivider.vue'


export default {
  name: 'TableauZoneCard',

  components: {
    CardListItem,
    CounterButtons,
    DropdownMenu,
    DropdownButton,
    DropdownDivider,
  },

  inject: ['actor', 'do', 'game'],

  props: {
    card: {
      type: Object,
      required: true
    },

    showGravePowers: {
      type: Boolean,
      default: false,
    },

    showManaCost: {
      type: Boolean,
      default: false,
    },

    showPower: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    annotation() {
      const parts = []

      for (const [key, value] of Object.entries(this.card.counters)) {
        if (value !== 0) {
          parts.push(`${key}: ${value}`)
        }
      }

      for (const [key, value] of Object.entries(this.card.trackers)) {
        if (value !== 0) {
          parts.push(`${key}: ${value}`)
        }
      }

      if (this.card.annotation) {
        parts.push(this.card.annotation)
      }

      if (this.card.attachedTo) {
        parts.push('attached to: ' + this.getDisplayName(this.card.attachedTo))
      }

      if (this.card.attached.length > 0) {
        const names = this.card.attached.map(c => this.getDisplayName(c)).join(', ')
        parts.push('attached: ' + names)
      }

      if (this.card.annotationEOT) {
        parts.push('eot: ' + this.card.annotationEOT)
      }

      if (this.card.annotationPerpetual && !this.hidden) {
        parts.push('perpetual: ' + this.card.annotationPerpetual)
      }

      return parts.join(', ')
    },

    cardIsSecret() {
      return this.card.secret === true
    },

    cardIsRevealed() {
      return !this.cardZoneIsPublic && this.card.visibility.length > 1
    },

    cardIsViewed() {
      const zoneTokens = this.card.zone.id.split('.')
      const inALibrary = zoneTokens.slice(-1)[0] === 'library'
      const inActorZone = zoneTokens.slice(-2, -1)[0] === this.actor.name
      const inActorLibrary = inActorZone && inALibrary

      return !this.cardZoneIsPublic && this.card.visibility.length === 1 && inActorLibrary
    },

    cardZoneIsPublic() {
      return this.card.zone.kind() === 'public'
    },

    extraClasses() {
      const classes = []
      if (this.hidden) {
        classes.push('hidden')
      }
      if (this.card.tapped) {
        classes.push('tapped')
      }
      return classes
    },

    hasAftermath() {
      return this.hasGraveAbility('Aftermath')
    },
    hasDisturb() {
      return this.hasGraveAbility('Disturb')
    },
    hasEmbalm() {
      return this.hasGraveAbility('Embalm')
    },
    hasEscape() {
      return this.hasGraveAbility('Escape')
    },
    hasEternalize() {
      return this.hasGraveAbility('Eternalize')
    },
    hasFlashback() {
      return this.hasGraveAbility('Flashback')
    },
    hasJumpstart() {
      return this.hasGraveAbility('Jump-start')
    },
    hasHarmonize() {
      return this.hasGraveAbility('Harmonize')
    },
    hasUnearth() {
      return this.hasGraveAbility('Unearth')
    },

    hasReturnFromGrave() {
      return this.card.data.card_faces.some(face => {
        const return_string = 'return ' + face.name.toLowerCase() + ' from your graveyard'
        return (
          face.oracle_text
          && face.oracle_text.toLowerCase().includes(return_string)
        )
      })
    },

    hidden() {
      return this.getHidden(this.card)
    },

    highlighted() {
      return this.$store.state.magic.game.selectedCardId === this.card.id
    },

    isScarred() {
      return this.card.isScarred()
    },

    showScarIcon() {
      return this.isScarred && !this.hidden
    },

    wrapperClasses() {
      const classes = []
      if (this.highlighted) {
        classes.push('highlighted')
      }
      return classes
    },
  },

  methods: {
    attach() {
      const callback = (card) => {
        this.do(null, {
          name: 'attach',
          cardId: this.card.id,
          targetId: card.id
        })
      }

      this.$store.commit('magic/game/setChooseTargetCallback', callback)
      this.$store.dispatch('magic/game/unselectCard')
    },

    canView(card) {
      const player = this.game.players.byName(this.actor.name)
      return card.isVisible(player)
    },

    closeup() {
      this.$modal('card-closeup-modal').show()
    },

    detach() {
      this.do(null, {
        name: 'detach',
        cardId: this.card.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    displayName(faceIndex) {
      return this.getDisplayName(this.card, faceIndex)
    },

    getDisplayName(card, faceIndex=null) {
      const player = this.game.players.byName(this.actor.name)
      return card.displayName(player, faceIndex)
    },

    getHidden(card) {
      return !this.canView(card)
    },

    hasGraveAbility(name) {
      return this.card.data.card_faces.some(face => {
        return (
          face.oracle_text
          && face.oracle_text.includes(name)
        )
      })
    },

    morph() {
      this.do(null, {
        name: 'morph',
        cardId: this.card.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    secret() {
      this.do(null, {
        name: 'secret',
        cardId: this.card.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    twiddle() {
      if (this.card.tapped) {
        this.do(null, {
          name: 'untap',
          cardId: this.card.id,
        })
      }
      else {
        this.do(null, {
          name: 'tap',
          cardId: this.card.id,
        })
      }
      this.$store.dispatch('magic/game/unselectCard')
    },

    reveal() {
      this.do(null, {
        name: 'reveal',
        cardId: this.card.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    stack() {
      this.do(null, {
        name: 'stack effect',
        cardId: this.card.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    toggleUntap() {
      this.do(null, {
        name: this.card.noUntap ? 'notap clear' : 'notap set',
        cardId: this.card.id,
      })
    },

    unmorph() {
      this.do(null, {
        name: 'unmorph',
        cardId: this.card.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    unsecret() {
      this.do(null, {
        name: 'unsecret',
        cardId: this.card.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },
  },

  watch: {
    highlighted(newValue) {
      if (newValue) {
        const toggleElem = this.$refs.menu.querySelector('.dropdown-toggle')
        const dropdown = new bsDropdown(toggleElem)
        dropdown.show()
      }
    },
  },
}
</script>


<style scoped>
.annotation {
  color: var(--bs-secondary);
  font-size: .8em;
  margin-left: .5em;
  margin-top: -.25em;
}

.card-line {
  display: flex;
  flex-direction: row;
}

.counter-button {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.hidden {
  font-weight: 100;
}

.tapped {
  color: var(--bs-secondary);
  font-style: italic;
}

.menu {
  position: absolute;
  top: -.8em;
  right: 0;
  z-index: 200;
}

.wrapper {
  position: relative;
  margin: 0 -.25em;
  padding: 0 .25em;
}
</style>
