<template>
  <div :class="displayClasses">
    {{ displayName }}
  </div>
</template>


<script>
export default {
  name: 'CardBasic',

  props: {
    displayClasses: Array,
    displayName: String,
  }
}
</script>


<style scoped>
</style
>
