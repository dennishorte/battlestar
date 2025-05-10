<template>
  <div
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @mousemove="mousemove"
    class="card-list-item"
  >
    <div
      v-if="separateFaces"
      v-for="faceIndex in faceIndices"
      :key="faceIndex"
      class="card-list-item-face"
      :class="faceIndex === card.g.activeFaceIndex ? '' : 'alt-face'"
      @click="$emit('card-face-clicked', { card, faceIndex })"
    >

      <div class="name">
        <i class="bi bi-arrow-return-right" v-if="faceIndex !== card.g.activeFaceIndex"/>
        <i class="bi bi-lightning-fill" v-if="card.isScarred(faceIndex)"/>
        <slot name="name" :face-index="faceIndex">{{ card.name(faceIndex) }}</slot>
      </div>

      <div class="extra-info">
        <ManaCost v-if="showManaCost" class="mana-cost" :cost="card.manaCost(faceIndex)" />
        <div v-else-if="showPower && card.power(faceIndex)" class="mana-cost">
          {{ card.powerToughness(faceIndex) }}
        </div>
      </div>
    </div>

    <div v-else class="card-list-item-face" @click="$emit('card-clicked', card)">
      <div class="name">
        <i class="bi bi-lightning-fill" v-if="card.isScarred()"/>
        <slot name="name">{{ card.name() }}</slot>
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

  inject: ['actor'],

  props: {
    card: Object,

    separateFaces: {
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

    canView: {
      type: Function,
      default: () => true,
    },
  },

  computed: {
    faceIndices() {
      const output = []
      output.push(this.card.g.activeFaceIndex)
      for (let i = 0; i < this.card.numFaces(); i++) {
        if (i !== this.card.g.activeFaceIndex) {
          output.push(i)
        }
      }
      return output
    },
  },

  methods: {
    mouseover() {
      if (this.card && this.canView(this.card)) {
        this.$store.commit('magic/setMouseoverCard', this.card)
      }
    },

    mouseleave() {
      if (this.card) {
        this.$store.commit('magic/unsetMouseoverCard', this.card)
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
  width: 100%;
}

.card-list-item-face {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 1.4em;
  max-height: 1.4em;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  align-items: center;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 1.4em;
  display: flex;
  align-items: center;
  flex: 1;
}

.bi-arrow-return-right {
  margin-left: 5px;
}

.extra-info {
  flex-shrink: 0; /* Prevent the mana cost from shrinking */
  display: flex;
  align-items: center;
}

.mana-cost {
  font-size: .8em;
  padding-top: 1px;
  padding-left: 5px;
  height: 100%;
}

.alt-face {
  color: #999;
}
</style>
