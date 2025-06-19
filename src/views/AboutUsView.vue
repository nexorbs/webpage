<script setup lang="ts">
import AboutUsCard from '@/components/AboutUsCard.vue'

const aboutUs: {
  icon: 'UsersIcon' | 'AdjustmentsVerticalIcon' | 'BoltIcon' | 'TrophyIcon'
  title: string
  description: string
}[] = [
  { icon: 'UsersIcon', title: 'EQUIPO EXPERTO', description: 'Profesionales especializados' },
  {
    icon: 'AdjustmentsVerticalIcon',
    title: 'ENFOQUE PERSONALIZADO',
    description: 'Cada proyecto es único',
  },
  { icon: 'BoltIcon', title: 'TECNOLOGÍA VANGUARDIA', description: 'Herramientas modernas' },
  { icon: 'TrophyIcon', title: 'CALIDAD GARANTIZADA', description: 'Resultados excepcionales' },
]

const list = [
  'Soluciones adaptadas a tu situación específica',
  'Tecnologías de vanguardia: Rust, Vue.js, React, Flutter',
  'Proceso completo: desde idea hasta lanzamiento',
  'Acompañamiento continuo post-implementación',
]
</script>
<template>
  <section
    id="about"
    style="min-height: calc(100svh - 61px)"
    class="py-24 max-md:py-16 flex items-center bg-white"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 class="text-5xl md:text-6xl font-black text-black mb-8 tracking-tight">
            ¿QUIÉNES
            <br />
            SOMOS?
          </h2>
          <div class="w-24 h-1 bg-black mb-8"></div>

          <p class="text-xl text-gray-600 mb-8 leading-relaxed font-light">
            En <strong>NexOrbs</strong> entendemos que cada proyecto es único. Nos dedicamos a
            brindar soluciones personalizadas que transforman ideas en realidades tecnológicas.
          </p>

          <p class="text-gray-500 mb-10 leading-relaxed font-light">
            Trabajamos con las últimas tecnologías para garantizar calidad y eficiencia en cada
            desarrollo, desde páginas web responsivas hasta aplicaciones móviles de alto
            rendimiento.
          </p>

          <div class="space-y-6">
            <div
              v-for="(item, index) in list"
              :key="index"
              class="flex items-center space-x-4 group"
            >
              <div
                class="w-2 h-2 bg-black group-hover:scale-150 transition-transform duration-300"
              ></div>
              <span class="text-gray-700 font-medium">{{ item }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <AboutUsCard v-for="(item, index) in aboutUs" :key="index" :feature="item" />
        </div>
      </div>
    </div>
  </section>
</template>
