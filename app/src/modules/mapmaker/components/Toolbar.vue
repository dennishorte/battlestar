<template>
  <b-sidebar id="toolbar" class="toolbar" title="Map Tools" bg-variant="dark" text-variant="light">

    <div class="tool-button" v-b-toggle.add-options>add</div>
    <b-collapse id="add-options">
      <div
        v-for="(kind, index) in nodeKinds"
        :key="index"
        @click="$emit('tool-add', kind)"
        class="tool-button-sub-option"
      >
        {{ kind }}
      </div>
    </b-collapse>

    <hr />

    <div class="tool-button" @click="$emit('tool-connect')">connect</div>
    <div class="tool-button" @click="$emit('tool-cut')">cut</div>

    <hr />

    <div class="tool-button" v-b-toggle.transform-options>transform</div>
    <b-collapse id="transform-options">
      <div>
        scale x: <b-form-input v-model.number="scale.x"></b-form-input>
        scale y: <b-form-input v-model.number="scale.y"></b-form-input>
      </div>

      <div>
        translate x: <b-form-input v-model.number="translate.x"></b-form-input>
        translate y: <b-form-input v-model.number="translate.y"></b-form-input>
      </div>

      <div>
        <b-button @click="resetTransform">reset</b-button>
        <b-button @click="applyTransform">apply</b-button>
      </div>
    </b-collapse>

    <hr />

    <div class="tool-button" @click="$emit('tool-load')">load</div>
    <div class="tool-button" @click="$emit('tool-export')">export</div>

  </b-sidebar>
</template>


<script>
export default {
  name: 'Toolbar',

  props: {
    nodeKinds: Array,
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
