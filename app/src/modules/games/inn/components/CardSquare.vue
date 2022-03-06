<template>
  <div
    :class="[
      `bg-${card.expansion}`,
      'card-base',
      sizeClass,
    ]">
    {{ displayName }}
  </div>
</template>


<script>
export default {
  name: 'CardSquare',

  props: {
    card: Object,
  },

  computed: {
    displayName() {
      return this.card.isSpecialAchievement ? this.card.shortName : this.card.age
    },

    sizeClass() {
      return this.card.isSpecialAchievement ? 'card-rect' : 'card-square'
    },
  },
}
</script>


<style scoped>
.card-base {
  height: 1.2rem;
  color: white;
  text-align: center;
  margin-right: 2px;
  margin-bottom: 2px;
  padding-left: 3px;
  padding-right: 3px;
}

.card-rect {

}

.card-square {
  width: 1rem;
}
</style>
