<template>
  <div class="card-name">
    CardName: {{ name }}
  </div>
</template>


<script>
export default {
  name: 'CardName',

  props: {
    name: String,
  },
}
</script>


<style scoped>
.card-name {
  display: inline-block;
}
</style>
