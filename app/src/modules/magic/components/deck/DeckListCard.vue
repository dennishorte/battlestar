<template>
  <div class="deck-list-card">
    {{ cardName }}
  </div>
</template>


<script>
export default {
  name: 'DeckListCard',

  props: {
    cardName: String,
  },
}
</script>


<style scoped>
</style>
