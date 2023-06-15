<template>
  <div class="wrapper" :class="wrapperClasses">
    <div class="card-line">
      <i class="bi bi-eye-fill" v-if="cardIsRevealed"></i>
      <i class="bi bi-eye" v-else-if="cardIsViewed"></i>

      <i class="bi bi-browser-edge" v-if="card.morph"></i>
      <i class="bi bi-bookmark-fill" v-if="card.token"></i>

      <template v-if="showGravePowers">
        <i class="ms ms-cost ms-ability-aftermath" v-if="hasAftermath" />
        <i class="ms ms-cost ms-ability-disturb" v-if="hasDisturb" />
        <i class="ms ms-cost ms-ability-embalm" v-if="hasEmbalm" />
        <i class="ms ms-cost ms-ability-eternalize" v-if="hasEternalize" />
        <i class="ms ms-cost ms-flashback" v-if="hasFlashback" />
        <i class="ms ms-cost ms-ability-unearth" v-if="hasUnearth" />
        <i class="ms ms-cost ms-ability-escape" v-if="hasEscape" />
      </template>

      <CardListItem
        :card="card"
        :class="extraClasses"
        :hide-popup="hidden"
        :show-mana-cost="showManaCost"
        :show-power="showPower"
      >
        <template #name>{{ displayName }}</template>
      </CardListItem>
    </div>

    <div v-if="annotation" class="annotation">
      {{ annotation }}
    </div>

    <div ref="menu" :class="highlighted ? '' : 'd-none'">
      <Dropdown :notitle="true" :menu-end="true" class="menu dropdown">
        <DropdownButton @click.stop="twiddle" v-if="card.tapped">untap</DropdownButton>
        <DropdownButton @click.stop="twiddle" v-else>tap</DropdownButton>

        <DropdownButton @click.stop="closeup">close up</DropdownButton>

        <DropdownButton @click.stop="unmorph" v-if="card.morph">unmorph</DropdownButton>
        <DropdownButton @click.stop="morph" v-else>morph</DropdownButton>

        <DropdownButton @click.stop="reveal">reveal</DropdownButton>
        <DropdownButton @click.stop="stack">stack</DropdownButton>

        <DropdownDivider />

        <li v-for="counter in Object.keys(card.counters)">
          <button @click.stop="() => {}" class="dropdown-item counter-button">
            <CounterButtons @click.stop="() => {}" :card="card" :name="counter" />
          </button>
        </li>

        <DropdownDivider />

        <DropdownButton @click="toggleUntap">
          doesn't untap
          <i class="bi bi-check-square" v-if="card.noUntap"></i>
          <i class="bi bi-square" v-else></i>
        </DropdownButton>

      </Dropdown>
    </div>

  </div>
</template>


<script>
import { Dropdown as bsDropdown } from 'bootstrap'

import CardListItem from '@/modules/magic/components/CardListItem'
import CounterButtons from './CounterButtons'
import Dropdown from '@/components/Dropdown'
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'


export default {
  name: 'TableauZoneCard',

  components: {
    CardListItem,
    CounterButtons,
    Dropdown,
    DropdownButton,
    DropdownDivider,
  },

  inject: ['actor', 'do', 'game'],

  props: {
    card: Object,

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

      if (this.card.annotation) {
        parts.push(this.card.annotation)
      }

      if (this.card.annotationEOT) {
        parts.push(this.card.annotationEOT)
      }

      return parts.join(', ')
    },

    cardIsRevealed() {
      return !this.cardZoneIsPublic && this.card.visibility.length > 1
    },

    cardIsViewed() {
      const zoneTokens = this.card.zone.split('.')
      const inALibrary = zoneTokens.slice(-1)[0] === 'library'
      const inActorZone = zoneTokens.slice(-2, -1)[0] === this.actor.name
      const inActorLibrary = inActorZone && inALibrary

      return !this.cardZoneIsPublic && this.card.visibility.length === 1 && inActorLibrary
    },

    cardZoneIsPublic() {
      const zone = this.game.getZoneByCard(this.card)
      return zone.kind === 'public'
    },

    displayName() {
      if (this.hidden) {
        if (this.card.morph) {
          return 'morph'
        }
        else {
          return 'hidden'
        }
      }
      else {
        return this.card.activeFace
      }
    },

    extraClasses() {
      const classes = []
      if (this.hidden) classes.push('hidden')
      if (this.card.tapped) classes.push('tapped')
      return classes
    },

    hasAftermath() { return this.hasGraveAbility('Aftermath') },
    hasDisturb() { return this.hasGraveAbility('Disturb') },
    hasEmbalm() { return this.hasGraveAbility('Embalm') },
    hasEscape() { return this.hasGraveAbility('Escape') },
    hasEternalize() { return this.hasGraveAbility('Eternalize') },
    hasFlashback() { return this.hasGraveAbility('Flashback') },
    hasUnearth() { return this.hasGraveAbility('Unearth') },

    hidden() {
      const player = this.game.getPlayerByName(this.actor.name)
      return !this.card.visibility.includes(player)
    },

    highlighted() {
      return this.$store.state.magic.game.selectedCardId === this.card.id
    },

    wrapperClasses() {
      const classes = []
      if (this.highlighted) classes.push('highlighted')
      return classes
    },
  },

  methods: {
    closeup() {
      this.$modal('card-closeup-modal').show()
    },

    hasGraveAbility(name) {
      return this.card.data.card_faces.some(face => face.oracle_text.includes(name))
    },

    morph() {
      this.do(null, {
        name: 'morph',
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
