<script setup lang="ts">
import { ArrowRightIcon, BoltIcon } from '@heroicons/vue/24/outline'
import BlackButton from '@/components/BlackButton.vue'
import WhiteButton from '@/components/WhiteButton.vue'

const steps = [
  { label: 'ESCUCHAMOS', desc: 'Tus necesidades' },
  { label: 'PROPONEMOS', desc: 'Soluciones óptimas' },
  { label: 'EJECUTAMOS', desc: 'Con vanguardia' },
  { label: 'LANZAMOS', desc: 'Y acompañamos' },
]
</script>

<template>
  <section
    id="hero"
    class="min-h-screen flex items-center justify-center relative overflow-hidden bg-black"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <!-- TODO: Arreglar que cuando es mobile, se va muy para arriba este Chip -->
      <div
        class="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8"
      >
        <BoltIcon class="w-4 h-4 text-white" />
        <span class="text-sm text-gray-300">Tech Solutions &amp; Beyond</span>
      </div>

      <div class="flex items-center justify-center space-x-4 mb-6">
        <img src="@/assets/logo.svg" alt="NEXORBS Logo" class="w-12 h-12" draggable="false" />
        <h1 className="text-6xl md:text-8xl font-black tracking-tight">
          <span className="text-white"> NEX </span>
          <span className="text-white relative">
            ORBS
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-white"></div>
          </span>
        </h1>
      </div>

      <p
        class="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
      >
        Tu aliado en soluciones tecnológicas. Llevamos tu idea o negocio al siguiente nivel con
        desarrollo web, apps móviles y consultoría especializada.
      </p>

      <div
        class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20"
      >
        <WhiteButton
          label="Comenzar Proyecto"
          icon="ArrowRightIcon"
          @click="$emit('start-project')"
          class="w-full sm:w-auto"
        >
          <ArrowRightIcon
            class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 relative z-10w-5"
          />
        </WhiteButton>

        <!-- TODO: Arreglar esto y convertilo a un componente con props -->
        <BlackButton>Ver nuestro enfoque</BlackButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        <div v-for="(step, index) in steps" :key="index" class="text-center group">
          <div
            class="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:border-white transition-colors duration-300"
          >
            <span class="text-white text-sm font-bold">{{ index + 1 }}</span>
          </div>
          <div class="text-white font-bold text-sm tracking-widest mb-2">
            {{ step.label }}
          </div>
          <div class="text-gray-500 text-xs">
            {{ step.desc }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
