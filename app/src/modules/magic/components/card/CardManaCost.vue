<template>
  <div
    class="frame-mana-cost"
    :class="{
      'scar-tape': oldVersions.length > 0,
    }"
    @click="emit('show-color-picker')"
  >
    <ManaCost
      v-if="card.manaCost(index).length > 0"
      :cost="card.manaCost(index)"
    />
    <i
      v-else-if="isEditable"
      class="ms ms-2x ms-ci ms-ci-5 opacity-10"
    />
  </div>
</template>


<script setup>
import { ref } from 'vue'
import ManaCost from './ManaCost.vue'

defineProps({
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
    default: false,
  },
})

const emit = defineEmits(['show-color-picker'])
const oldVersions = ref([])
</script>


<style scoped>
.opacity-10 {
  opacity: 0.1;
}
</style>
