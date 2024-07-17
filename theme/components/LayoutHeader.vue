<template>
  <header
    v-if="
      $slidev.themeConfigs.logoHeader && $slidev.nav.currentLayout === 'intro'
    "
    class="absolute w-full px-16 py-8 top-0 h-10 z-10"
  >
    <img
      :src="$slidev.themeConfigs.logoHeader"
      class="w-16 h-16 object-contain border-1 p-1 border-white round"
    />
  </header>
</template>
<style scoped>
.round {
  @apply rounded-full !important;
}
.pixel-corners {
  clip-path: polygon(
    0px calc(100% - 16px),
    4px calc(100% - 16px),
    4px calc(100% - 8px),
    8px calc(100% - 8px),
    8px calc(100% - 4px),
    16px calc(100% - 4px),
    16px 100%,
    calc(100% - 16px) 100%,
    calc(100% - 16px) calc(100% - 4px),
    calc(100% - 8px) calc(100% - 4px),
    calc(100% - 8px) calc(100% - 8px),
    calc(100% - 4px) calc(100% - 8px),
    calc(100% - 4px) calc(100% - 16px),
    100% calc(100% - 16px),
    100% 16px,
    calc(100% - 4px) 16px,
    calc(100% - 4px) 8px,
    calc(100% - 8px) 8px,
    calc(100% - 8px) 4px,
    calc(100% - 16px) 4px,
    calc(100% - 16px) 0px,
    16px 0px,
    16px 4px,
    8px 4px,
    8px 8px,
    4px 8px,
    4px 16px,
    0px 16px
  );
}
</style>
