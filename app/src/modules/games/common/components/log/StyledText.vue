<template>
  <span :class="classes">{{ text }}</span>
</template>


<script setup>
defineProps({
  classes: {
    type: String,
    default: '',
  },
  text: {
    type: [String, Number],
    default: '',
  },
})
</script>


<style scoped>
.counter-name {
  font-weight: 600;
}

.counter-delta {
  font-weight: 600;
}
.counter-pos {
  color: #198754;
}
.counter-neg {
  color: #dc3545;
}
</style>
