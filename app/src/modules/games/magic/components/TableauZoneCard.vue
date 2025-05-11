<template>
  <div class="wrapper" :class="wrapperClasses">
    <div class="card-line">
      <i class="bi bi-eye-fill" v-if="cardIsRevealed"/>
      <i class="bi bi-eye" v-else-if="cardIsViewed"/>
      <i class="bi bi-eye-slash-fill" v-else-if="cardIsSecret"/>

      <i class="bi bi-browser-edge" v-if="card.g.morph"/>
      <i class="bi bi-bookmark-fill" v-if="card.g.token"/>

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

      <CardListItem
        :card="card"
        :class="extraClasses"
        :hide-popup="hidden"
        :show-mana-cost="showManaCost"
        :show-power="showPower"
        :separate-faces="!hidden"
        :can-view="canView"
      >
        <template v-slot:name="slotProps">{{ displayName(slotProps.faceIndex) }}</template>
      </CardListItem>
    </div>

    <div v-if="annotation" class="annotation">
      {{ annotation }}
    </div>

    <div ref="menu" :class="highlighted ? '' : 'd-none'">
      <Dropdown :notitle="true" :menu-end="true" class="menu dropdown">
        <DropdownButton @click.stop="twiddle" v-if="card.g.tapped">untap</DropdownButton>
        <DropdownButton @click.stop="twiddle" v-else>tap</DropdownButton>

        <DropdownButton @click.stop="closeup">close up</DropdownButton>

        <DropdownButton @click.stop="unmorph" v-if="card.g.morph">unmorph</DropdownButton>
        <DropdownButton @click.stop="morph" v-else>morph</DropdownButton>

        <DropdownButton @click.stop="unsecret" v-if="card.g.secret">unsecret</DropdownButton>
        <DropdownButton @click.stop="secret" v-else>secret</DropdownButton>

        <DropdownButton @click.stop="detach" v-if="card.g.attachedTo">detach</DropdownButton>
        <DropdownButton @click.stop="attach" v-else>attach</DropdownButton>

        <DropdownButton @click.stop="reveal">reveal</DropdownButton>
        <DropdownButton @click.stop="stack">stack</DropdownButton>

        <DropdownDivider />

        <li v-for="counter in Object.keys(card.g.counters)" :key="counter">
          <button @click.stop="() => {}" class="dropdown-item counter-button">
            <CounterButtons @click.stop="() => {}" :card="card" :name="counter" />
          </button>
        </li>

        <DropdownDivider />

        <DropdownButton @click="toggleUntap">
          doesn't untap
          <i class="bi bi-check-square" v-if="card.g.noUntap"/>
          <i class="bi bi-square" v-else/>
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

      for (const [key, value] of Object.entries(this.card.g.counters)) {
        if (value !== 0) {
          parts.push(`${key}: ${value}`)
        }
      }

      if (this.card.g.annotation) {
        parts.push(this.card.g.annotation)
      }

      if (this.card.g.attachedTo) {
        parts.push('attached to: ' + this.getDisplayName(this.card.g.attachedTo))
      }

      if (this.card.g.attached.length > 0) {
        const names = this.card.g.attached.map(c => this.getDisplayName(c)).join(', ')
        parts.push('attached: ' + names)
      }

      if (this.card.g.annotationEOT) {
        parts.push('eot: ' + this.card.g.annotationEOT)
      }

      return parts.join(', ')
    },

    cardIsSecret() {
      return this.card.g.secret === true
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

    extraClasses() {
      const classes = []
      if (this.hidden) {
        classes.push('hidden')
      }
      if (this.card.g.tapped) {
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
      return this.$store.state.magic.game.selectedCardId === this.card.g.id
    },

    isScarred() {
      return false
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
          cardId: this.card.g.id,
          targetId: card.g.id
        })
      }

      this.$store.commit('magic/game/setChooseTargetCallback', callback)
      this.$store.dispatch('magic/game/unselectCard')
    },

    canView(card) {
      const player = this.game.getPlayerByName(this.actor.name)
      return card.isVisible(player)
    },

    closeup() {
      this.$modal('card-closeup-modal').show()
    },

    detach() {
      this.do(null, {
        name: 'detach',
        cardId: this.card.g.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    displayName(faceIndex) {
      return this.getDisplayName(this.card, faceIndex)
    },

    getDisplayName(card, faceIndex=null) {
      const player = this.game.getPlayerByName(this.actor.name)
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
        cardId: this.card.g.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    secret() {
      this.do(null, {
        name: 'secret',
        cardId: this.card.g.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    twiddle() {
      if (this.card.g.tapped) {
        this.do(null, {
          name: 'untap',
          cardId: this.card.g.id,
        })
      }
      else {
        this.do(null, {
          name: 'tap',
          cardId: this.card.g.id,
        })
      }
      this.$store.dispatch('magic/game/unselectCard')
    },

    reveal() {
      this.do(null, {
        name: 'reveal',
        cardId: this.card.g.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    stack() {
      this.do(null, {
        name: 'stack effect',
        cardId: this.card.g.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    toggleUntap() {
      this.do(null, {
        name: this.card.g.noUntap ? 'notap clear' : 'notap set',
        cardId: this.card.g.id,
      })
    },

    unmorph() {
      this.do(null, {
        name: 'unmorph',
        cardId: this.card.g.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    unsecret() {
      this.do(null, {
        name: 'unsecret',
        cardId: this.card.g.id,
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
