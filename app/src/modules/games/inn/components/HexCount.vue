<template>
  <div class="hex-count-container">
    <span class="hex-count-text">
      {{ count }}
    </span>
</div>

</template>

<script>

const hexImage = require('@/assets/img/biscuit-hex.png')

export default {
  name: 'HexCount',

  props: {
    count: Number,
  },

  computed: {
    imageUrl() {
      return hexImage
    },
  }
}

</script>

<style scoped>

.hex-count-container {
  display: flex;
  height: 1.1em;
  width: 1.1em;
  margin-top: 1px;
  margin-right: 4px;
  
  opacity: 0.4;
  background-image: url("~@/assets/img/biscuit-hex.png");
  background-size: 1.1em 1.1em;
  
  align-items: center;
  justify-content: center;
}

.hex-count-text {
  color: white;
  font-size: 0.7em;
}

</style>