<template>
  <div class="dropdown float-end">
    <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
      menu
    </button>

    <ul class="dropdown-menu">
      <slot></slot>
    </ul>
  </div>
</template>


<script>
export default {
  name: 'Dropdown',
}
</script>


<style scoped>
</style>
