<template>
  <div
    :class="[
      `bg-${expansion}`,
      'card-base',
      sizeClass,
    ]">
    {{ name }}
  </div>
</template>


<script>
export default {
  name: 'CardSquareDetails',

  props: {
    name: String,
    expansion: String,
    sizeClass: {
      type: String,
      default: 'square',
    },
  },
}
</script>


<style scoped>
.card-base {
  height: 1.5em;
  color: white;
  text-align: center;
  margin-right: 2px;
  margin-bottom: 2px;
  padding-left: 3px;
  padding-right: 3px;
  display: inline-block;
  border: 1px solid #7d6c50;
}

.square {
  width: 1.25em;
}
</style>
