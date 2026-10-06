<template>
  <GameLogText :text="text" />
</template>

<script setup>
import { computed } from 'vue'
import GameLogText from '@/modules/games/common/components/log/GameLogText.vue'

const props = defineProps({
  line: {
    type: Object,
    required: true,
  },
})

const text = computed(() => {
  const card = props.line.args?.card
  if (card?.cardId) {
    return `card(${card.cardId})`
  }
  return card?.value ?? 'a card'
})
</script>
