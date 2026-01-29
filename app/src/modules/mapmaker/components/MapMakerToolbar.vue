<template>
  <OffCanvas id="map-maker-toolbar">
    <template #header>
      Toolbar
    </template>

    <div class="tool-button" data-bs-toggle="collapse" data-bs-target="#add-options">add</div>
    <div class="collapse" id="add-options">
      <div
        v-for="(kind, index) in nodeKinds"
        :key="index"
        @click="$emit('tool-add', kind)"
      >
        {{ kind }}
      </div>
    </div>

    <hr />

    <div class="tool-button" @click="$emit('tool-connect')">connect</div>
    <div class="tool-button" @click="$emit('tool-cut')">cut</div>

    <hr />

    <div
      class="tool-button"
      data-bs-toggle="collapse"
      data-bs-target="#transform-options"
    >
      transform
    </div>
    <div class="collapse" id="transform-options">
      <div>
        Scale
        <input class="form-control" placeholder="x" v-model.number="scale.x" />
        <input class="form-control" placeholder="y" v-model.number="scale.y" />
      </div>

      <div>
        Translate
        <input class="form-control" placeholder="x" v-model.number="translate.x" />
        <input class="form-control" placeholder="y" v-model.number="translate.y" />
      </div>

      <div>
        <button class="btn btn-warning" @click="resetTransform">reset</button>
        <button class="btn btn-primary" @click="applyTransform">apply</button>
      </div>
    </div>

    <hr />

    <div class="tool-button" @click="$emit('tool-load')">load</div>
    <div class="tool-button" @click="$emit('tool-export')">export</div>

  </OffCanvas>
</template>


<script>
import OffCanvas from '@/components/OffCanvas.vue'


export default {
  name: 'MapMakerToolbar',

  components: {
    OffCanvas,
  },

  emits: [
    'tool-add',
    'tool-connect',
    'tool-cut',
    'tool-load',
    'tool-export',
    'tool-transform',
  ],

  props: {
    nodeKinds: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      scale: {
        x: 100,
        y: 100,
        locked: true,
      },

      translate: {
        x: 0,
        y: 0,
      },
    }
  },

  methods: {
    applyTransform() {
      this.$emit('tool-transform', {
        scale: {
          x: this.scale.x / 100,
          y: this.scale.y / 100,
        },
        translate: { ...this.translate },
      })
    },

    resetTransform() {
      this.scale.x = 100
      this.scale.y = 100
      this.translate.x = 0
      this.translate.y = 0
    },
  },
}
</script>


<style scoped>
.tool-button {
  display: block;
  margin: 0;
  padding: 5px 2em;
}

.tool-button:hover,
.collapse div:hover
{
  background-color: #4d5b7a;
}

.collapse div {
  margin: 0 2.5em;
  padding: 5px .5em;
  border-left: 1px solid lightgray;
}

button {
  margin-right: 2px;
}
</style>
