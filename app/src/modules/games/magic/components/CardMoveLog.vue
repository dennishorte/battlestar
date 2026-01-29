<template>
  <div class="card-move-log">
    <div>move: <CardName v-if="cardId" :name="cardId" /><span v-else>{{ cardName }}</span></div>
    <div class="card-move-detail">from: {{ from }}</div>
    <div class="card-move-detail">to: {{ to }}</div>
  </div>
</template>

<script>
import CardName from '@/modules/games/common/components/log/CardName'

export default {
  name: 'CardMoveLog',

  components: {
    CardName,
  },

  props: {
    line: {
      type: Object,
      required: true,
    },
  },

  computed: {
    cardId() {
      const cardArg = this.line.args.card
      if (cardArg.classes.includes('card-hidden')) {
        return null
      }
      return String(cardArg.cardId)
    },

    cardName() {
      return this.line.args.card.value
    },

    from() {
      return this.line.args.zone1.value
    },

    to() {
      const placement = this.line.args.placement
      const zone = this.line.args.zone2.value
      return placement ? `${placement.value} ${zone}` : zone
    },
  },
}
</script>

<style scoped>
.card-move-detail {
  padding-left: 2ch;
}
</style>
