<template>
  <div
    class="card-list-item"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @mousemove="mousemove"
    @click="onClick"
  >

    <div class="name">
      <i class="bi bi-lightning-fill" v-if="!!card.custom_id"></i>
      <slot name="name">{{ name }}</slot>
    </div>

    <div class="extra-info">
      <ManaCost v-if="showManaCost" class="mana-cost" :cost="manaCost" />
      <div v-else-if(="showPower" class="mana-cost">
        {{ powerToughness }}
      </div>
    </div>

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
      default: false,
    },

    onClick: {
      type: Function,
      default: () => {},
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

    powerToughness() {
      if (this.card.morph) {
        return '2/2'
      }

      const face = this.card.data.card_faces.find(face => face.name === this.card.activeFace)
      if (face.power) {
        return `${face.power}/${face.toughness}`
      }
      else {
        return ''
      }
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
  white-space: nowrap;
  overflow: hidden;
  min-height: 1.4em;
  max-height: 1.4em;
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 1.4em;
}

.mana-cost {
  font-size: .8em;
  padding-top: 1px;
  padding-left: 5px;
  height: 100%;
}
</style>
