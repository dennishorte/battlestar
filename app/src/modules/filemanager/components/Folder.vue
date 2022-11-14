<template>
  <div class="folder">
    <div class="folder-name" @click="clickFolder">
      <i class="bi-folder"></i>
      {{ content.name || 'root' }}
    </div>

    <div v-for="file in content.files" class="nested" @click="clickFile(file)">
      <i class="bi-box"></i> {{ file.name }}
    </div>

    <Folder v-for="folder in content.folders" class="nested" :content="folder" />
  </div>
</template>


<script>
export default {
  name: 'Folder',

  inject: ['bus'],

  props: {
    content: Object,
    meta: Object,
  },

  computed: {
  },

  methods: {
    clickFile(file) {
      this.bus.emit('click', {
        objectType: 'file',
        file,
      })
    },

    clickFolder() {
      this.bus.emit('click', {
        objectType: 'folder',
        folder: this.content,
      })
    },
  },
}
</script>


<style scoped>
.nested {
  margin-left: 1em;
}

.selected {
  background-color: lightblue;
  border-radius: .25em;
}
</style>
