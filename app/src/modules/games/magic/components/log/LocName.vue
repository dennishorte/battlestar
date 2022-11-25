<template>
  <div class="loc-name">
    {{ name }}
  </div>
</template>


<script>
export default {
  name: 'LocName',

  props: {
    name: String,
  },
}
</script>


<style scoped>
.loc-name {
  display: inline-block;
  background-color: var(--tyr-location-background);
  border-radius: .1em;
  padding: 0 .4em;
}
</style>
