<template>
  <div
    class="card-list-item"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @mousemove="mousemove"
  >

    <div class="name">
      <slot name="name">{{ name }}</slot>
    </div>
    <ManaCost v-if="showManaCost" class="mana-cost" :cost="manaCost" />

  </div>
</template>


<script>
import ManaCost from './ManaCost'


export default {
  name: 'CardListItem',

  components: {
    ManaCost,
  },

  props: {
    card: Object,

    hidePopup: {
      type: Boolean,
      default: false
    },

    showManaCost: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    data() {
      if (this.card.data) {
        return this.card.data
      }
      else {
        return this.$store.getters['magic/cards/getLookupFunc'](this.card)
      }
    },

    name() {
      return this.data ? this.data.name : this.card.name
    },

    manaCost() {
      return this.data ? this.data.card_faces[0].mana_cost : ''
    },
  },

  methods: {
    mouseover() {
      if (this.data && !this.hidePopup) {
        this.$store.commit('magic/setMouseoverCard', this.data)
      }
    },

    mouseleave() {
      if (this.data) {
        this.$store.commit('magic/unsetMouseoverCard', this.data)
      }
    },

    mousemove(event) {
      this.$store.commit('magic/setMouseoverPosition', {
        x: event.clientX,
        y: event.clientY,
      })
    },
  },
}
</script>


<style scoped>
.card-list-item {
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  min-height: 1.4em;
  max-height: 1.4em;
  width: 100%;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 1.4em;
}

.mana-cost {
  position: absolute;
  top: 0;
  right: 0;
  font-size: .8em;
  padding-top: 1px;
  padding-left: 5px;
  background-color: white;
  height: 100%;
}
</style>
