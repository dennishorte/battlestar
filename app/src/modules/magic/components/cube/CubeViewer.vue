<template>
  <div class="cube-viewer">
    {{ id }}
  </div>
</template>


<script>
export default {
  name: 'CubeViewer',

  data() {
    return {
      id: this.$route.params.id,
    }
  },
}
</script>
