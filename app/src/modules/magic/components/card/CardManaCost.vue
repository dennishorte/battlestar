<template>
  <div class="frame-mana-cost" @click="emit('show-color-picker')">
    <ManaCost
      v-if="props.card.manaCost(props.index).length > 0"
      :cost="props.card.manaCost(props.index)"
    />
    <i
      v-else-if="isEditable"
      class="ms ms-2x ms-ci ms-ci-5 opacity-10"
    />
  </div>
</template>


<script setup>
import ManaCost from './ManaCost.vue'

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  isEditable: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['show-color-picker'])
</script>


<style scoped>
.opacity-10 {
  opacity: 0.1;
}
</style>
