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
      v-if="!meta.hideFiles"
      v-for="file in sortedFiles"
      class="nested file-name"
      :class="file === selectedFile ? 'selected' : ''"
      @click="clickFile(file)"
    >
      <i class="bi-box"></i> {{ file.name }}
    </div>

    <Folder
      v-if="!meta.hideFolders"
      v-for="folder in sortedFolders"
      class="nested"
      :content="folder"
      :meta="meta"
    />
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

    sortedFiles() {
      return this
        .content
        .files
        .sort((l, r) => l.name.localeCompare(r.name))
    },

    sortedFolders() {
      return this
        .content
        .folders
        .sort((l, r) => {
          if (l.name === '__trash') {
            return 1
          }
          if (r.name === '__trash') {
            return -1
          }
          return l.name.localeCompare(r.name)
        })
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
