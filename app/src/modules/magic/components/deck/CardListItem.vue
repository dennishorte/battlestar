<template>
  <div class="card-list-item">
    {{ card.name }}
  </div>
</template>


<script>
export default {
  name: 'CardListItem',

  props: {
    card: Object,
  },
}
</script>


<style scoped>
.card-list-item {
  white-space: nowrap;
  overflow: hidden;
  min-height: 1.4em;
}

.card-popup {
  position: fixed;
  min-height: 5em;
  min-width: 5em;
  background-color: lightgray;
}
</style>
