<template>
  <div class="loyalty-container">
    <i class="ms ms-loyalty-start loyalty-background"/>
    <span class="loyalty-number">{{ loyalty }}</span>
  </div>
</template>


<script>
export default {
  name: 'CardLoyalty',

  props: {
    loyalty: [Number, String],
  },
}
</script>


<style scoped>
.loyalty-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.loyalty-background {
  position: absolute;
  color: black;
  font-size: 3em;
  z-index: 1;
  -webkit-text-stroke: 2px #aaa;
  text-stroke: 2px #aaa;
}

.loyalty-number {
  position: relative;
  color: white;
  z-index: 2;
  font-size: 1em;
}
</style>
