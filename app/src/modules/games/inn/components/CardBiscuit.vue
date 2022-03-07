<template>
  <span class="card-biscuit">
    <img v-if="!!imagePath" class="card-biscuit-image" :src="imagePath" />
  </span>
</template>


<script>
const imageMap = {
  'k': require('@/assets/img/biscuit-castle.png'),
  'i': require('@/assets/img/biscuit-clock.png'),
  'c': require('@/assets/img/biscuit-crown.png'),
  'f': require('@/assets/img/biscuit-factory.png'),
  'h': require('@/assets/img/biscuit-hex.png'),
  'l': require('@/assets/img/biscuit-leaf.png'),
  '<': require('@/assets/img/biscuit-left.png'),
  's': require('@/assets/img/biscuit-lightbulb.png'),
  '+': require('@/assets/img/biscuit-plus.png'),
  '>': require('@/assets/img/biscuit-right.png'),
  ';': require('@/assets/img/biscuit-whiteflag.png'),
}

export default {
  name: 'CardBiscuit',

  props: {
    biscuit: String,
  },

  computed: {
    imagePath() {
      return imageMap[this.biscuit]
    },
  },
}
</script>


<style scoped>
.card-biscuit {
  height: 15px;
  width: 15px;
  margin-right: 1px;
  margin-bottom: 1px;
}

.card-biscuit-image {
  height: 15px;
  width: 15px;
  object-fit: fill;
}
</style>
