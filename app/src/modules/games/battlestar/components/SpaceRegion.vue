<template>
<b-col
  @click="dropComponent"
  :class="[
          'space-region',
          highlighted ? 'highlighted' : '',
  ]"
  :data-index="index"
  cols="5">

  <div class="space-region-components">
    <div
      v-for="(c, idx) in components"
      :key="idx"
      @click="clickComponent($event, c)">
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

  computed: {
    highlighted() {
      return this.$store.getters['bsg/spaceComponentGrabbing']
    }
  },

  methods: {
    clickComponent(event, name) {
      if (!this.$store.getters['bsg/spaceComponentGrabbing']) {
        const zoneElem = event.target.closest('.space-region')
        const zoneIndex = zoneElem.getAttribute('data-index')
        this.$store.commit('bsg/spaceComponentGrab', {
          component: name,
          source: zoneIndex,
          message: `Holding ${name} from region ${zoneIndex}`,
        })
        event.stopPropagation()
      }
    },

    dropComponent(event) {
      if (this.$store.getters['bsg/spaceComponentGrabbing']) {
        const targetRegion = event.target.closest('.space-region')
        const target = parseInt(targetRegion.getAttribute('data-index'))
        this.$store.commit('bsg/spaceComponentDrop', target)
      }
    },
  },

}
</script>


<style scoped>
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

.highlighted, .space-region-drop {
    box-shadow: inset 10px 10px 20px #9df, inset -10px -10px 20px #9df;
}

.space-region-index {
    position: absolute;
    bottom: .25em;
    right: .4em;
}
</style>
