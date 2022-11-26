<template>
  <div class="wrapper">
    <CardListItem :card="card" :class="extraClasses" />

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

  inject: ['game', 'player'],

  props: {
    card: Object,
  },

  computed: {
    extraClasses() {
      return this.highlighted ? 'highlighted' : ''
    },

    highlighted() {
      return this.$store.state.magic.game.selectedCard === this.card
    },
  },

  methods: {
    morph() {
      console.log('morph', this.card.name)
    },

    twiddle() {
      this.game.aTwiddle(this.card)
    },

    reveal() {
      this.game.aReveal(this.card)
    },
  },
}
</script>


<style scoped>
.highlighted {
  background-color: cyan;
}

.menu {
  position: absolute;
  top: -.8em;
  right: 0;
  z-index: 200;
}

.wrapper {
  position: relative;
}
</style>
