<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
    <PartnershipCard
      v-for="item in items"
      :key="item.title"
      :image-src="item.imageSrc"
      :title="item.title"
      :is-dark-mode="isDarkMode"
    />
  </div>
</template>

<script setup lang="ts">
import PartnershipCard from './PartnershipCard.vue';

interface PartnershipItem {
  imageSrc: string;
  title: string;
}

interface Props {
  items: PartnershipItem[];
  isDarkMode: boolean;
}

defineProps<Props>();
</script>
