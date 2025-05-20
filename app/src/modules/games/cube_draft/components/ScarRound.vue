<template>
  <div class="alert alert-warning">
    <h3>Scar Round!</h3>

    <BAlert :model-value="true" v-for="scar in props.scars" :key="scar.id">
      {{ scar.text }}
    </BAlert>

  </div>
</template>


<script setup>
const props = defineProps({
  scars: {
    type: Array,
    default: () => [],
  },
})
</script>


<style scoped>
</style>
