<template>
  <div class="wrapper" :class="wrapperClasses">
    <div class="card-line">
      <i class="bi bi-eye-fill" v-if="cardIsRevealed"></i>
      <i class="bi bi-eye" v-else-if="cardIsViewed"></i>

      <i class="bi bi-browser-edge" v-if="card.morph"></i>

      <CardListItem
        :card="card"
        :class="extraClasses"
        :hide-popup="hidden"
        :show-mana-cost="showManaCost"
      >
        <template #name>{{ displayName }}</template>
      </CardListItem>
    </div>

    <div v-if="card.annotation" class="annotation">
      {{ card.annotation }}
    </div>

    <Dropdown v-if="highlighted" :notitle="true" :menu-end="true" class="menu dropdown">
      <DropdownButton @click.stop="twiddle" v-if="card.tapped">untap</DropdownButton>
      <DropdownButton @click.stop="twiddle" v-else>tap</DropdownButton>

      <DropdownButton @click.stop="closeup">close up</DropdownButton>

      <DropdownButton @click.stop="unmorph" v-if="card.morph">unmorph</DropdownButton>
      <DropdownButton @click.stop="morph" v-else>morph</DropdownButton>

      <DropdownButton @click.stop="reveal">reveal</DropdownButton>
    </Dropdown>

  </div>
</template>


<script>
import CardListItem from '@/modules/magic/components/CardListItem'
import Dropdown from '@/components/Dropdown'
import DropdownButton from '@/components/DropdownButton'

export default {
  name: 'TableauZoneCard',

  components: {
    CardListItem,
    Dropdown,
    DropdownButton,
  },

  inject: ['actor', 'do', 'game'],

  props: {
    card: Object,

    showManaCost: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
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

    hidden() {
      const player = this.game.getPlayerByName(this.actor.name)
      return !this.card.visibility.includes(player)
    },

    highlighted() {
      return this.$store.state.magic.game.selectedCard === this.card
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

    unmorph() {
      this.do(null, {
        name: 'unmorph',
        cardId: this.card.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
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
