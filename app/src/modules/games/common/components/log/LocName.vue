<template>
  <span class="loc-name" :class="classes" :style="styles">{{ name }}</span>
</template>


<script setup>
import { computed, inject } from 'vue'
import { useGameLog } from '../../composables/useGameLog'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const game = inject('game')
const funcs = useGameLog()

const loc = computed(() => game.value?.zones?.byId(props.name))

const classes = computed(() => {
  return funcs.locClasses ? funcs.locClasses(loc.value) : []
})

const styles = computed(() => {
  return funcs.locStyles ? funcs.locStyles(loc.value) : []
})
</script>


<style scoped>
</style>
