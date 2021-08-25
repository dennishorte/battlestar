<template>
<b-col
  @dragenter="dragEnter"
  @dragleave="dragLeave"
  @drop="drop"
  @dragover.prevent
  @dragenter.prevent
  class="space-region"
  :data-index="index"
  md="4">

  <div class="space-region-components">
    <div v-for="(c, idx) in components" :key="idx">
      {{ c }}
    </div>
  </div>

  <div class="space-region-index">
    {{ index }}
  </div>
</b-col>

</template>


<script>
export default {
  name: 'SpaceRegion',

  props: {
    index: Number,
    components: Array,
  },

  methods: {
    dragEnter(event) {
      event.preventDefault()
      if (event.target.classList.contains('space-region')) {
        event.target.classList.add('space-region-drop')
      }
    },

    dragLeave(event) {
      event.target.classList.remove('space-region-drop')
    },

    drop(event) {
      event.target.classList.remove('space-region-drop')
      this.$parent.$emit('space-component-move', {
        component: event.dataTransfer.getData('component'),
        source: event.dataTransfer.getData('source'),
        target: parseInt(event.target.getAttribute('data-index')),
      })
    },
  },

}
</script>


<style>
.space-region {
    min-height: 5em;
    border-style: solid;
    border-width: 1px;
    border-radius: .5em;

    color: #ddf;
    background-color: #44b;

    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
}

.space-region-drop {
    background-color: #55d;
}

.space-region-index {
    position: absolute;
    bottom: .25em;
    right: .4em;
}
</style>
