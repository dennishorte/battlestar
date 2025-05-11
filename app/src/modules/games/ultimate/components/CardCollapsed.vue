<template>
  <div class="card-collapsed" :class="[card.color]">

    <div v-for="(effect, index) in visibleEchoEffects" :key="index" class="card-effect">
      <CardBiscuit :biscuit="'&'" />
      <CardText :text="effect" />
    </div>

  </div>
</template>


<script>
import CardBiscuit from './CardBiscuit'
import CardText from './CardText'

export default {
  name: 'CardStacked',

  components: {
    CardBiscuit,
    CardText,
  },

  inject: ['game'],

  props: {
    card: {
      type: Object,
      required: true
    },
  },

  computed: {
    splay() {
      return this.game.getSplayByCard(this.card)
    },

    visibleEchoEffects() {
      const effects = this.game.getVisibleEffects(this.card, 'echo')
      if (effects) {
        return effects.texts
      }
      else {
        return []
      }
    },

  },
}
</script>


<style scoped>
.card-collapsed {
  border: 1px solid #7d6c50;
  padding: .2rem;
  margin-bottom: 1px;
  max-width: 300px;
  min-height: .5em;
  font-size: .8em;
}

.card-effect {
  display: flex;
  flex-direction: row;
}
</style>
