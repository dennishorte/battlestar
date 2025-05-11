<template>
  <div class="section-header">
    <slot/>
  </div>
</template>


<script>
export default {
  name: 'SectionHeader',
}
</script>


<style scoped>
.section-header {
  margin-left: .5rem;
  margin-right: .5rem;
  margin-top: .25rem;
  padding: 0 .25rem;
  border-top: 1px solid #7d6c50;
  border-right: 1px solid #7d6c50;
  border-left: 1px solid #7d6c50;
  background-color: #FF7A0E;
}
</style>
