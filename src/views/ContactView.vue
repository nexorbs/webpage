<script setup lang="ts">
import WhiteButton from '@/components/WhiteButton.vue'
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

const formData = ref<{
  name: string
  email: string
  project: '' | 'web' | 'mobile' | 'consultoria' | 'integral'
  message: string
}>({
  name: '',
  email: '',
  project: '',
  message: '',
})

const steps = [
  {
    step: '01',
    title: 'ESCUCHAMOS',
    content: 'Comprendemos tus necesidades y el problema a resolver',
  },
  {
    step: '02',
    title: 'PROPONEMOS',
    content: 'Diseñamos soluciones óptimas adaptadas a tu situación',
  },
  {
    step: '03',
    title: 'EJECUTAMOS',
    content: 'Desarrollamos con tecnología de vanguardia y equipo experto',
  },
  {
    step: '04',
    title: 'LANZAMOS',
    content: 'Implementamos y te acompañamos en el proceso post-lanzamiento',
  },
]

const benefits = [
  'Consulta inicial gratuita',
  'Propuesta personalizada en 48h',
  'Tecnologías de vanguardia',
  'Acompañamiento post-implementación',
]

function handleSubmit() {
  // Agregar manejo de correos
}
</script>
<template>
  <section id="contact" class="py-24 max-md:py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-20">
        <h2 class="text-5xl md:text-6xl font-black text-black mb-6 tracking-tight">CONTACTO</h2>
        <div class="w-24 h-1 bg-black mx-auto mb-8"></div>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto font-light">
          ¿Tienes un reto o idea en mente? ¡Hablemos y llevemos tu proyecto al siguiente nivel!
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h3 class="text-2xl font-black text-black mb-8 tracking-wide">NUESTRO PROCESO</h3>

          <div class="space-y-8">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="flex items-start space-x-6 group"
            >
              <div class="flex-shrink-0">
                <div
                  class="size-12 border-2 border-black flex items-center justify-center group-hover:bg-black transition-colors duration-300"
                >
                  <span
                    class="text-black group-hover:text-white font-bold text-sm transition-colors duration-300"
                  >
                    {{ step.step }}
                  </span>
                </div>
              </div>
              <div class="flex-1">
                <h4 class="text-black font-bold text-sm tracking-wide mb-2">
                  {{ step.title }}
                </h4>
                <p class="text-gray-600 font-light text-sm leading-relaxed">
                  {{ step.content }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-16 p-8 bg-black text-white">
            <h4 class="text-white font-bold mb-6 tracking-wide">¿POR QUÉ NEXORBS?</h4>
            <ul class="space-y-6">
              <li
                v-for="(benefit, index) in benefits"
                :key="index"
                class="flex group items-center space-x-4"
              >
                <div
                  class="size-2 group-hover:scale-150 transition-transform duration-300 bg-white"
                ></div>
                <span class="text-gray-300 font-light">{{ benefit }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-black p-8 text-white">
          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" class="block text-sm font-bold text-white mb-3 tracking-wide">
                  NOMBRE *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  v-model="formData.name"
                  required
                  class="w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 focus:border-white hover:border-white text-white placeholder-gray-500 transition-all duration-200 focus:outline-none"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  class="block text-sm font-bold text-white mb-3 tracking-wide"
                >
                  EMAIL *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  v-model="formData.email"
                  required
                  class="w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 focus:border-white hover:border-white text-white placeholder-gray-500 transition-all duration-200 focus:outline-none"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="project"
                class="block text-sm font-bold text-white mb-3 tracking-wide"
              >
                TIPO DE PROYECTO
              </label>
              <select
                id="project"
                name="project"
                v-model="formData.project"
                :class="[
                  'w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 focus:border-white hover:border-white transition-all duration-200 focus:outline-none',
                  formData.project.valueOf() === '' ? 'text-gray-500' : 'text-white',
                ]"
              >
                <option value="" hidden class="bg-black">Selecciona una opción</option>
                <option value="web" class="bg-black">Desarrollo Web</option>
                <option value="mobile" class="bg-black">Aplicación Móvil</option>
                <option value="consultoria" class="bg-black">Consultoría Tech</option>
                <option value="integral" class="bg-black">Solución Integral</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                class="block text-sm font-bold text-white mb-3 tracking-wide"
              >
                CUÉNTANOS TU IDEA *
              </label>
              <textarea
                id="message"
                name="message"
                v-model="formData.message"
                required
                rows="{4}"
                class="w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 focus:border-white hover:border-white text-white placeholder-gray-500 transition-all duration-200 resize-none focus:outline-none"
                placeholder="Describe tu proyecto, reto o idea..."
              />
            </div>
            <WhiteButton
              v-on:click.prevent="handleSubmit"
              class="w-full justify-center"
              label="ENVIAR MENSAJE"
              ><PaperAirplaneIcon class="size-5"
            /></WhiteButton>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
