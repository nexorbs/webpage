<script setup lang="ts">
import CategorizeTechnologies from '@/components/CategorizeTechnologies.vue'

const technologies = [
  {
    category: 'Frontend',
    techs: [
      {
        name: 'Vue.js',
        icon: './src/assets/Vue.js.svg',
        description: 'Framework progresivo para interfaces',
      },
      {
        name: 'React.js',
        icon: './src/assets/React.svg',
        description: 'Biblioteca para interfaces de usuario',
      },
      {
        name: 'TypeScript',
        icon: './src/assets/TypeScript.svg',
        description: 'JavaScript con tipado estático',
      },
    ],
  },
  {
    category: 'Backend',
    techs: [
      {
        name: 'Rust',
        icon: './src/assets/cuddlyferris.svg',
        description: 'Rendimiento y seguridad extremos',
      },
      {
        name: 'Node.js',
        icon: './src/assets/Node.js.svg',
        description: 'Runtime de JavaScript del lado servidor',
      },
    ],
  },
  {
    category: 'Mobile',
    techs: [
      {
        name: 'Flutter',
        icon: './src/assets/Flutter.svg',
        description: 'Framework multiplataforma de Google',
      },
      {
        name: 'React Native',
        icon: './src/assets/React.svg',
        description: 'Apps nativas con React',
      },
    ],
  },
  {
    category: 'Infrastructure',
    techs: [
      {
        name: 'Cloudflare',
        icon: './src/assets/Cloudflare.svg',
        description: 'Optimización y seguridad web',
      },
    ],
  },
]
</script>
<template>
  <section id="tech" class="py-24 max-md:py-16 bg-black border-t border-white/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-20">
        <h2 class="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">TECNOLOGÍAS</h2>
        <div class="w-24 h-1 bg-white mx-auto mb-8"></div>
        <p class="text-xl text-gray-400 max-w-3xl mx-auto font-light">
          Trabajamos con las herramientas más avanzadas para garantizar calidad y eficiencia
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-16">
        <CategorizeTechnologies
          v-for="(category, categoryIndex) in technologies"
          :key="categoryIndex"
          :category="category"
        />
      </div>

      <div class="mt-16 text-center">
        <div
          class="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3"
        >
          <span class="text-sm text-gray-300"
            >✨ Innovamos para transformar, construimos para inspirar ✨</span
          >
        </div>
      </div>
    </div>
  </section>
</template>
