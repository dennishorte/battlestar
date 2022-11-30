<template>
  <div class="wrapper" :class="wrapperClasses">
    <div class="card-line">
      <i class="bi bi-eye-fill" v-if="cardIsRevealed"></i>
      <i class="bi bi-eye" v-else-if="cardIsViewed"></i>

      <CardListItem
        :card="card"
        :class="extraClasses"
        :hide-popup="hidden"
        :show-mana-cost="showManaCost"
      >
        <template #name>{{ displayName }}</template>
      </CardListItem>
    </div>

    <Dropdown v-if="highlighted" :notitle="true" :menu-end="true" class="menu dropdown">
      <DropdownButton @click.stop="twiddle" v-if="this.card.tapped">untap</DropdownButton>
      <DropdownButton @click.stop="twiddle" v-else>tap</DropdownButton>

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
        return 'hidden'
      }
      else {
        return this.card.data.card_faces[0].name
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
    morph() {
      console.log('morph', this.card.name)
    },

    twiddle() {
      this.do(null, {
        name: 'twiddle',
        cardId: this.card.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },

    reveal() {
      this.do(null, {
        name: 'reveal',
        cardId: this.card.id,
      })
      this.$store.dispatch('magic/game/unselectCard')
    },
  },
}
</script>


<style scoped>
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
