<template>
  <div class="alert alert-warning">
    <h3>Scar Round!</h3>

    <BAlert :model-value="true" v-for="scar in props.scars" :key="scar.id">
      {{ scar.text }}
    </BAlert>

    <div>
      To add a scar to a card, click the card you want to scar. A dialog will pop up that shows the two scars and the card editor. Make the appropriate edits to the card, and then click the button corresponding to the scar you used. You can add optional comments if you want.
    </div>

    <div>
      To apply a scar, you just edit the card to make it match what the scar says. You can edit any part of the card by clicking on it and putting in the new values you want it to have.
    </div>

    <BAlert :model-value="true" class="mt-4">
      tips
      <ul>
        <li>It's funny to make a really broken card, but later on, when someone is playing against that card, and they're having a fun game of magic, and then suddenly lose to their opponent's uber-bomb, it's less funny.</li>
        <li>The same scar applied to a one drop might be broken but applied to a six drop might be boring.</li>
        <li>You don't have to apply the scar exactly as written; play around with it.</li>
        <li>Some good flavor and a little spice 🌶️ go a long way.</li>
      </ul>
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
