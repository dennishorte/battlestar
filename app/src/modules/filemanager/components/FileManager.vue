<template>
  <div class="file-manager">
    <template v-if="fileStructure">

      <div class="menu">
        <Dropdown :notitle="true">
          <DropdownItem><button @click="newFile">New File</button></DropdownItem>
          <DropdownItem><button @click="duplicate" :disabled="!fileSelected">Duplicate</button></DropdownItem>
          <DropdownItem><button @click="edit" :disabled="!fileSelected">Edit/Move</button></DropdownItem>
          <DropdownDivider />
          <DropdownItem><button @click="deleteFile" :disabled="!fileSelected">Delete</button></DropdownItem>
        </Dropdown>
      </div>

      <Folder :content="fileStructure" :meta="meta" />
    </template>

    <div v-else class="alert alert-danger">Missing File Structure</div>

    <EditModal :file="meta.selection.file" :id="editModalId" @save="updateFile" />
    <NewFileModal
      :selection="meta.selection"
      :file-types="fileTypes"
      :id="newFileModalId"
      @create="createFile"
    />
  </div>
</template>


<script>
import mitt from 'mitt'
import { v4 as uuidv4 } from 'uuid'

import { util } from 'battlestar-common'

import Dropdown from '@/components/Dropdown'
import DropdownItem from '@/components/DropdownItem'
import DropdownDivider from '@/components/DropdownDivider'
import EditModal from './EditModal'
import Folder from './Folder'
import NewFileModal from './NewFileModal'

export default {
  name: 'FileManager',

  components: {
    Dropdown,
    DropdownItem,
    DropdownDivider,
    EditModal,
    Folder,
    NewFileModal,
  },

  props: {
    filelist: Array,
    fileTypes: Array,
    hideFiles: {
      type: Boolean,
      default: false,
    },
    hideFolders: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      bus: mitt(),

      meta: {
        hideFiles: this.hideFiles,
        hideFolders: this.hideFolders,
        selection: {},
      },

      editModalId: 'file-manager-edit-modal-' + uuidv4(),
      newFileModalId: 'file-manager-new-file-modal-' + uuidv4(),
    }
  },

  provide() {
    return {
      bus: this.bus,
    }
  },

  computed: {
    fileSelected() {
      return (
        this.meta.selection
        && this.meta.selection.file
        && !this.meta.selection.file.path.startsWith('/__trash')
      )
    },

    fileStructure() {
      if (!this.filelist) {
        return null
      }

      const hierarchy = {
        name: 'root',
        path: '/',
        folders: [],
        files: [],
      }

      let node
      for (const file of this.filelist) {
        node = hierarchy

        for (const elem of pathTokens(file.path)) {
          const folder = node.folders.find(f => f.name === elem)
          if (folder) {
            node = folder
            continue
          }
          else {
            const newFolder = {
              name: elem,
              path: node.path === '/' ? node.path + elem : node.path + '/' + elem,
              folders: [],
              files: [],
            }
            node.folders.push(newFolder)
            node = newFolder
            continue
          }
        }

        node.files.push(file)
      }

      return hierarchy
    },

  },

  methods: {
    edit() {
      this.$modal(this.editModalId).show()
    },

    newFile() {
      this.$modal(this.newFileModalId).show()
    },

    setSelection(fileOrFolder) {
      let preventDefault = false

      this.$emit('selection-changing', {
        oldValue: this.meta.selection,
        newValue: fileOrFolder,
        preventDefault: () => preventDefault = true,
      })

      if (preventDefault) {
        return
      }

      const oldValue = this.meta.selection
      this.meta.selection = fileOrFolder

      this.$emit('selection-changed', {
        oldValue: oldValue,
        newValue: this.meta.selection
      })
    },


    ////////////////////////////////////////////////////////////////////////////////
    // File actions

    createFile(event) {
      this.$emit('file-creating', event)
    },

    deleteFile() {
      if (!this.meta.selection || !this.meta.selection.file) {
        return
      }

      this.$emit('file-deleting', {
        file: this.meta.selection.file,
      })
    },

    duplicate() {
      if (!this.meta.selection || !this.meta.selection.file) {
        return
      }

      this.$emit('file-duplicating', {
        file: this.meta.selection.file,
      })
    },

    updateFile(event) {
      if (!this.meta.selection || !this.meta.selection.file) {
        return
      }

      this.$emit('file-updating', {
        file: this.meta.selection.file,
        newName: event.newName,
        newPath: event.newPath,
      })
    },
  },

  mounted() {
    this.bus.on('click', this.setSelection)
  },
}


function pathTokens(path) {
  let tokens = path ? path.split('/') : []
  if (path.length > 0 && path[0].length === 0) {
    tokens = tokens.splice(0, 1)
  }

  return tokens.filter(t => Boolean(t))
}
</script>


<style scoped>
.file-manager {
  height: 100%;
  overflow: scroll;
  position: relative;
}

.menu {
  float: right;
}
</style>
