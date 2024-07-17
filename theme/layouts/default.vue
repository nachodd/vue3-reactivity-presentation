<template>
  <div
    class="slidev-layout"
    :class="{ grid: $attrs.center }"
  >
    <h1 v-if="$attrs.slideTitle">{{ $attrs.slideTitle }}</h1>
    <CornerCurves class="absolute bottom-0 right-0 transform scale-x--100" />
    <div class="my-auto z-10 relative">
      <slot />
    </div>
  </div>
</template>
