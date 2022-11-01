<template>
  <div class="offcanvas offcanvas-start bg-dark text-light" id="toolbar">
    <div class="offcanvas-header">
      <slot name="header"></slot>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
    </div>

    <div class="offcanvas-body">
      <slot></slot>
    </div>
  </div>
</template>


<script>
export default {
  name: 'OffCanvas',
}
</script>
