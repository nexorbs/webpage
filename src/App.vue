<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="bg-nexBlack text-nexWhite min-h-screen flex items-center justify-center">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-center items-center mb-8 text-center sm:text-left">
        <img src="/logo.svg" alt="NexOrbs Logo" class="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-0 sm:mr-4" />
        <h1 class="text-4xl sm:text-7xl font-bold">NEXORBS</h1>
      </div>

      <!-- Main Content -->
      <div class="text-center max-w-4xl mx-auto">
        <p class="text-nexSoftGray text-lg mb-12 leading-relaxed">
          Tu aliado en soluciones tecnológicas. Llevamos tu idea o negocio al siguiente nivel con
          desarrollo web, apps móviles y consultoría especializada.
        </p>
      </div>
    </div>

    <RouterView />
  </main>
</template>
