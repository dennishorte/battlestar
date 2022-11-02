<template>
  <div class="offcanvas offcanvas-start" :id="id" :class="class">
    <div class="offcanvas-header">
      <h5>
        <slot name="header"></slot>
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>

    <div class="offcanvas-body">
      <slot></slot>
    </div>
  </div>
</template>


<script>
export default {
  name: 'OffCanvas',

  props: {
    id: String,
    class: [String, Array],
  }
}
</script>
