<template>
<div class="space-zone">

  <b-row no-gutters>
    <b-col class="space-menu" md="2">
      <div class="space-components">
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
      </div>

      <div class="space-components-clear">
        <b-button @click="clearSpaceComponents">
          clear
        </b-button>
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
        <b-col class="space-remover-wrapper" md="2">
          <div
            class="space-remover"
            @dragenter="dragEnterRemove"
            @dragleave="dragLeaveRemove"
            @drop="dropRemove"
            @dragover.prevent
            @dragenter.prevent>
            remover
          </div>
        </b-col>
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
    clearSpaceComponents() {
      this.$emit('space-components-clear')
    },

    dragEnterRemove() {
      event.preventDefault()
      if (event.target.classList.contains('space-remover')) {
        event.target.classList.add('space-remover-drop')
      }
    },

    dragLeaveRemove() {
      event.target.classList.remove('space-remover-drop')
    },

    dropRemove() {
      event.target.classList.add('space-remover-drop')
      this.$emit('space-component-remove', {
        component: event.dataTransfer.getData('component'),
        source: event.dataTransfer.getData('source'),
      })
    },

    grabComponent(event, component) {
      event.dataTransfer.dropEffect = 'copy'
      event.dataTransfer.effectAllowed = 'copy'
      event.dataTransfer.setData('component', component.name)
      event.dataTransfer.setData('source', 'supply')
    },

    removeComponent(event) {
      this.$emit('space-component-remove', {
        compoenent: event.dataTransfer.getValue('component'),
        source: event.dataTransfer.getValue('source'),
      })
    },
  }
}
</script>

<style>
.space-galactica {
    border: 1px solid #ddd;
    border-radius: 8em/1.5em;
    background-color: #777;

    display: flex;
    justify-content: center;
    align-items: center;
}

.space-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.space-remover-wrapper {
    padding: .25em!important;
}

.space-remover {
    color: #ccd;
    background-color: #dde;
    border: 1px solid #bbb;
    border-radius: 100% 100%;
    flex-grow: 1;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}

.space-remover-drop {
    border-color: red;
    color: #fff;
    background-color: #fbb;
}

.space-zone {
    background-color: #abd;
    padding: .5em;
}
</style>
