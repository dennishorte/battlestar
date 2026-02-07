<template>
  <div class="alert alert-warning">
    <h3>Scar Round!</h3>

    <BAlert :model-value="true" v-for="scar in props.scars" :key="scar.id">
      {{ scar.text }}
    </BAlert>

    <div>
      To add a scar to a card, click the card you want to scar. A dialog will pop up that shows the two scars and the card editor. Make the appropriate edits to the card, and then click the button corresponding to the scar you used. You can add optional comments if you want.
    </div>

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
