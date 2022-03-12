<template>
  <div class="card-collapsed" :class="[card.color]">

    <CardText v-for="(effect, index) in visibleEchoEffects" :key="index" :text="effect" />
    <CardText v-for="(effect, index) in visibleInspireEffects" :key="index" :text="effect" />

  </div>
</template>


<script>
import CardText from './CardText'

export default {
  name: 'CardStacked',

  components: {
    CardText,
  },

  inject: ['game'],

  props: {
    card: Object,
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

    visibleInspireEffects() {
      const effects = this.game.getVisibleEffects(this.card, 'inspire')
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
</style>
