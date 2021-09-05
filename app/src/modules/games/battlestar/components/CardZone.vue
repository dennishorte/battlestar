<template>
  <div class="CardZone">
    <div class="card-zone-heading">{{ name }}</div>
    <div>{{ cards.length }}</div>

      <div
        v-for="(card, index) in cards"
        :key="index"
        @click="click(index)"
      >
        <div>
          {{ index }}: {{ card.name }}
        </div>
      </div>

  </div>
</template>


<script>
import store from '../lib/storeUtil.js'

export default {
  name: 'CardZone',

  props: {
    name: String,

    type: {
      type: String,
      default: 'freestyle',
    },
    visibility: {
      type: String,
      default: 'hidden',
    },
  },

  components: {
  },

  computed: {
    cards() {
      return store.getZone.bind(this)(this.name).cards
    },
  },

  methods: {
    click(index) {
      this.$store.commit('bsg/grab', {
        zone: this.name,
        index: index,
      })
    },
    drop() {
      this.$store.commit('bsg/drop', this.name)
    },
  },
}
</script>


<style scoped>
</style>
