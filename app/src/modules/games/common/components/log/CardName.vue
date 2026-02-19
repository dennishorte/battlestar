<template>
  <span
    class="card-name"
    @click="click"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @mousemove="mousemove"
    :class="classes"
    :style="styles"
  >{{ displayName }}</span>
</template>


<script setup>
import { computed, inject } from 'vue'
import { useGameLog } from '../../composables/useGameLog'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
})

const game = inject('game')
const funcs = useGameLog()

const card = computed(() => game.value?.cards?.byId(props.name))

const classes = computed(() => {
  return funcs.cardClasses ? funcs.cardClasses(card.value) : []
})

const displayName = computed(() => {
  if (card.value) {
    if (typeof card.value.name === 'function') {
      return card.value.name()
    }
    else {
      return card.value.name
    }
  }
  else {
    return props.name
  }
})

const styles = computed(() => {
  return funcs.cardStyles ? funcs.cardStyles(card.value) : []
})

function click() {
  if (funcs.cardClick) {
    funcs.cardClick(card.value)
  }
}

function mouseover() {
  if (funcs.cardMouseover) {
    funcs.cardMouseover(card.value)
  }
}

function mouseleave() {
  if (funcs.cardMouseleave) {
    funcs.cardMouseleave(card.value)
  }
}

function mousemove(event) {
  if (funcs.cardMousemove) {
    funcs.cardMousemove(event, card.value)
  }
}
</script>


<style scoped>
.card-name {
  display: inline;
}
</style>
