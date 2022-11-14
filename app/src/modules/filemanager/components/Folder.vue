<template>
  <div class="folder">
    <div
      class="folder-name"
      @click="clickFolder"
      :class="content.path === selectedFolderPath ? 'selected' : ''"
    >
      <i class="bi-folder"></i>
      {{ content.name || 'root' }}
    </div>

    <div
      v-for="file in content.files"
      class="nested file-name"
      :class="file === selectedFile ? 'selected' : ''"
      @click="clickFile(file)"
    >
      <i class="bi-box"></i> {{ file.name }}
    </div>

    <Folder v-for="folder in content.folders" class="nested" :content="folder" :meta="meta" />
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
    selectedFile() {
      return this.meta.selection ? this.meta.selection.file : null
    },

    selectedFolderPath() {
      if (this.meta.selection && this.meta.selection.folder) {
        return this.meta.selection.folder.path
      }
      else {
        return null
      }
    },
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
.folder-name,
.file-name {
  padding-left: .25em;
}

.nested {
  margin-left: 1em;
}

.selected {
  background-color: lightblue;
  border-radius: .25em;
}
</style>
