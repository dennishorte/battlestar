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
    <div
      v-for="(c, idx) in components"
      :key="idx"
      @dragstart="grabComponent($event, c)"
      draggable>
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

      const sourceString = event.dataTransfer.getData('source')
      const sourceInt = parseInt(sourceString)

      this.$parent.$emit('space-component-move', {
        component: event.dataTransfer.getData('component'),
        source: isNaN(sourceInt) ? sourceString : sourceInt,
        target: parseInt(event.target.getAttribute('data-index')),
      })
    },

    grabComponent(event, name) {
      const zoneElem = event.target.closest('.space-region')
      const zoneIndex = zoneElem.getAttribute('data-index')

      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('component', name)
      event.dataTransfer.setData('source', zoneIndex)
    }
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
