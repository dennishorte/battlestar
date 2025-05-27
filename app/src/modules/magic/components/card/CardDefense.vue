<template>
  <div class="defense-container">
    <i class="ms ms-defense defense-background"/>
    <span class="defense-number">{{ defense }}</span>
  </div>
</template>


<script>
export default {
  name: 'CardDefense',

  props: {
    defense: {
      type: [Number, String],
      required: true
    },
  },
}
</script>


<style scoped>
.defense-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.defense-background {
  position: absolute;
  color: black;
  font-size: 3em;
  z-index: 1;
  -webkit-text-stroke: 2px #aaa;
  text-stroke: 2px #aaa;
}

.defense-number {
  position: relative;
  color: white;
  z-index: 2;
  font-size: 1em;
}
</style>
