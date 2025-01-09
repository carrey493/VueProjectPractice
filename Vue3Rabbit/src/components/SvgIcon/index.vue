<template>
  <span class="svg-span">
    <svg
      v-if="props.svgHtml"
      :class="[svgClass, iconClass]"
      aria-hidden="true"
      v-html="svgHtml"
    ></svg>
    <svg v-else :style="iconStyle" :class="svgClass" aria-hidden="true">
      <use :xlink:href="iconName"></use>
    </svg>
  </span>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  iconClass: {
    type: String,
    default: "",
  },
  iconStyle: {
    type: Object,
    default: () => {},
  },
  className: {
    type: String,
    default: "",
  },
  svgHtml: {
    type: String,
    default: "",
  },
});
const iconName = computed(() => `#icon-${props.iconClass}`);
const svgClass = computed(() =>
  props.className ? "svg-icon " + props.className : "svg-icon"
);
</script>
