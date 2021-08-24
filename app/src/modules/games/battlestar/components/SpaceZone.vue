<template>
<div class="space-zone">

  <b-row no-gutters>
    <b-col class="space-components" md="2">
      <div class="galactica-components">
        <div
          v-for="c in galacticaComponents"
          :key="c.name"
          @dragstart="grabComponent($event, c)"
          draggable>

          {{ c.name }}
        </div>
      </div>

      <div class="cylon-components">
        <div
          v-for="c in cylonComponents"
          :key="c.name"
          @dragstart="grabComponent($event, c)"
          draggable>

          {{ c.name }}
        </div>
      </div>
    </b-col>

    <b-col class="space-regions">

      <b-row no-gutters>
        <b-col md="2"></b-col>
        <SpaceRegion :index="0" :components="deployedComponents[0]" />
        <SpaceRegion :index="1" :components="deployedComponents[1]" />
      </b-row>

      <b-row no-gutters>
        <SpaceRegion :index="5" :components="deployedComponents[5]" />

        <b-col class="space-galactica" md="4">
          galactica
        </b-col>

        <SpaceRegion :index="2" :components="deployedComponents[2]" />
      </b-row>

      <b-row no-gutters>
        <b-col md="2"></b-col>
        <SpaceRegion :index="4" :components="deployedComponents[4]" />
        <SpaceRegion :index="3" :components="deployedComponents[3]" />
      </b-row>

    </b-col>
  </b-row>



</div>
</template>


<script>
import SpaceRegion from "./SpaceRegion"

const components = [
  {
    name: 'raptor',
    faction: 'galactica',
  },
  {
    name: 'viper',
    faction: 'galactica',
  },
  {
    name: 'civilian',
    faction: 'galactica',
  },
  {
    name: 'basestar',
    faction: 'cylon',
  },
  {
    name: 'raider',
    faction: 'cylon',
  },
  {
    name: 'heavy raider',
    faction: 'cylon',
  },
]


export default {
  name: 'SpaceZone',

  components: {
    SpaceRegion,
  },

  props: {
    deployedComponents: Array,
  },

  data() {
    return {
      components,
    }
  },

  computed: {
    cylonComponents() {
      return components.filter(c => c.faction === 'cylon')
    },
    galacticaComponents() {
      return components.filter(c => c.faction === 'galactica')
    }
  },

  methods: {
    grabComponent(event, component) {
      event.dataTransfer.dropEffect = 'copy'
      event.dataTransfer.effectAllowed = 'copy'
      event.dataTransfer.setData('component', component.name)
      event.dataTransfer.setData('source', 'supply')
    },
  }
}
</script>

<style>
.space-zone {
    background-color: #abd;
    padding: .5em;
}

.space-galactica {
    border: 1px solid #ddd;
    border-radius: 8em/1.5em;
    background-color: #777;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
