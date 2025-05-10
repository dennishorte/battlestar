<template>
  <div class="dropdown">
    <button
      class="btn btn-light dropdown-toggle"
      data-bs-toggle="dropdown"
    />

    <ul class="dropdown-menu dropdown-menu-end">
      <slot/>
    </ul>
  </div>
</template>


<script>
export default {
  name: 'TableauZoneMenu',

  props: {
  },

  computed: {
  },
}
</script>


<style scoped>
.dropdown-toggle {
  max-height: 1.5em;
  padding: 0 1.2em;
}
</style>
