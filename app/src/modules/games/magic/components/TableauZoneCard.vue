<template>
  <div class="wrapper" :class="wrapperClasses">
    <CardListItem
      :card="card"
      :class="extraClasses"
      :hide-popup="hidden"
    >
      <template #name>{{ displayName }}</template>
    </CardListItem>

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

  inject: ['actor', 'do'],

  props: {
    card: Object,
  },

  computed: {
    displayName() {
      if (this.hidden) {
        return 'hidden'
      }
      else {
        return card.data.card_faces[0].name
      }
    },

    extraClasses() {
      const classes = []
      if (this.hidden) classes.push('hidden')
      if (this.card.tapped) classes.push('tapped')
      return classes
    },

    hidden() {
      return !this.card.visibility.includes(this.actor.name)
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
    },

    reveal() {
      this.do(null, {
        name: 'reveal',
        cardId: this.card.id,
      })
    },
  },
}
</script>


<style scoped>
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
