<template>
  <div
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @mousemove="mousemove"
    @click="onClick"
  >
    <div
      v-if="separateFaces"
      v-for="(_, faceIndex) in card.numFaces()"
      class="card-list-item"
    >

      <div class="name">
        <i class="bi bi-arrow-return-right" v-if="faceIndex !== 0"></i>
        <i class="bi bi-lightning-fill" v-if="card.isScarred(faceIndex)"></i>
        <slot name="name">{{ card.name(faceIndex) }}</slot>
      </div>

      <div class="extra-info">
        <ManaCost v-if="showManaCost" class="mana-cost" :cost="card.manaCost(faceIndex)" />
        <div v-else-if="showPower" class="mana-cost">
          {{ card.powerToughness(faceIndex) }}
        </div>
      </div>
    </div>

    <div v-else class="card-list-item">
      <div class="name">
        <i class="bi bi-lightning-fill" v-if="card.isScarred()"></i>
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

  props: {
    card: Object,

    onClick: {
      type: Function,
      default: () => {},
    },

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
  },

  methods: {
    mouseover() {
      if (this.card) {
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
</style>
