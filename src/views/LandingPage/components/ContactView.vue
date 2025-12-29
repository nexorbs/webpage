<script setup lang="ts">
import WhiteButton from '@/components/WhiteButton.vue'
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'
import { nextTick, onMounted, ref, watch } from 'vue'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetAlerts'

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

const isSubmitting = ref(false)

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

const resizeTextarea = (event: any) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  nextTick(() => {
    textarea.style.height = `${textarea.scrollHeight + 1}px`
  })
}

watch(
  () => formData.value.message,
  () => {
    nextTick(() => {
      const textarea = document.getElementById('message')
      if (textarea) {
        resizeTextarea({ target: textarea })
      }
    })
  },
  { immediate: true },
)

onMounted(() => {
  const textarea = document.getElementById('message')
  if (textarea) {
    resizeTextarea({ target: textarea })
  }
})

const handleSubmit = async (event: Event) => {
  event.preventDefault()

  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const form = event.target as HTMLFormElement
    const formDataToSend = new FormData(form)

    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formDataToSend,
    })

    const result = await response.json()

    if (response.ok && result.success) {
      await showSuccessToast('¡Mensaje enviado correctamente! Te contactaremos pronto.')

      formData.value = {
        name: '',
        email: '',
        project: '',
        message: '',
      }

      nextTick(() => {
        const textarea = document.getElementById('message')
        if (textarea) {
          textarea.style.height = 'auto'
        }
      })
    } else {
      await showErrorToast(result.error || 'Error al enviar el mensaje. Inténtalo de nuevo.')
    }
  } catch (error) {
    console.error('Error:', error)
    await showErrorToast('Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
<template>
  <section id="contact" style="min-height: calc(100svh - 61px)" class="py-24 max-md:py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-20">
        <h2 class="text-5xl md:text-6xl font-black text-nexBlack mb-6 tracking-tight">CONTACTO</h2>
        <div class="w-24 h-1 bg-nexBlack mx-auto mb-8"></div>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto font-light">
          ¿Tienes un reto o idea en mente? ¡Hablemos y llevemos tu proyecto al siguiente nivel!
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h3 class="text-2xl font-black text-nexBlack mb-8 tracking-wide">NUESTRO PROCESO</h3>

          <div class="space-y-8">
            <div v-for="(step, index) in steps" :key="index" class="flex items-start space-x-6 group">
              <div class="flex-shrink-0">
                <div
                  class="size-12 border-2 border-nexBlack flex items-center justify-center group-hover:bg-nexBlack transition-colors duration-300">
                  <span
                    class="text-nexBlack group-hover:text-nexWhite font-bold text-sm transition-colors duration-300 select-none">
                    {{ step.step }}
                  </span>
                </div>
              </div>
              <div class="flex-1">
                <h4 class="text-nexBlack font-bold text-sm tracking-wide mb-2">
                  {{ step.title }}
                </h4>
                <p class="text-gray-600 font-light text-sm leading-relaxed">
                  {{ step.content }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-16 p-8 bg-nexBlack text-nexWhite">
            <h4 class="text-nexWhite font-bold mb-6 tracking-wide">¿POR QUÉ NEXORBS?</h4>
            <ul class="space-y-6">
              <li v-for="(benefit, index) in benefits" :key="index" class="flex group items-center space-x-4">
                <div class="size-2 group-hover:scale-150 transition-transform duration-300 bg-nexWhite"></div>
                <span class="text-gray-300 font-light">{{ benefit }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-nexBlack p-8 text-nexWhite">
          <form @submit="handleSubmit" class="space-y-6 flex flex-col h-full">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" class="block text-sm font-bold text-nexWhite mb-3 tracking-wide">
                  NOMBRE *
                </label>
                <input type="text" id="name" name="name" v-model="formData.name" required
                  class="w-full px-0 py-3 bg-transparent border-0 border-b border-nexWhite/20 focus:border-nexWhite hover:border-nexWhite text-nexWhite placeholder-gray-500 transition-all duration-200 focus:outline-none"
                  placeholder="Tu nombre completo" />
              </div>

              <div>
                <label htmlFor="email" class="block text-sm font-bold text-nexWhite mb-3 tracking-wide">
                  EMAIL *
                </label>
                <input type="email" id="email" name="email" v-model="formData.email" required
                  class="w-full px-0 py-3 bg-transparent border-0 border-b border-nexWhite/20 focus:border-nexWhite hover:border-nexWhite text-nexWhite placeholder-gray-500 transition-all duration-200 focus:outline-none"
                  placeholder="tu@email.com" />
              </div>
            </div>

            <div class="relative">
              <label htmlFor="project" class="block text-sm font-bold text-nexWhite mb-3 tracking-wide">
                TIPO DE PROYECTO
              </label>
              <select id="project" name="project" v-model="formData.project"
                class="w-full px-0 py-3 bg-transparent border-0 border-b border-nexWhite/20 text-nexWhite focus:border-nexWhite hover:border-nexWhite transition-all duration-200 focus:outline-none">
                <option value="web" class="bg-nexBlack text-nexWhite">Desarrollo Web</option>
                <option value="mobile" class="bg-nexBlack text-nexWhite">Aplicación Móvil</option>
                <option value="consultoria" class="bg-nexBlack text-nexWhite">
                  Consultoría Tech
                </option>
                <option value="integral" class="bg-nexBlack text-nexWhite">
                  Solución Integral
                </option>
              </select>
              <input v-if="!formData.project" disabled
                class="absolute placeholder-gray-500 bottom-0 left-0 mb-2.5 border-b border-transparent pointer-events-none"
                type="text" placeholder="Selecciona una opción" />
            </div>

            <div class="flex flex-col flex-grow">
              <label htmlFor="message" class="block text-sm font-bold text-nexWhite mb-3 tracking-wide">
                CUÉNTANOS TU IDEA *
              </label>
              <textarea id="message" name="message" v-model="formData.message" @input="resizeTextarea" required rows="1"
                class="w-full px-0 pr-1 py-3 bg-transparent border-0 border-b border-nexWhite/20 focus:border-nexWhite hover:border-nexWhite text-nexWhite placeholder-gray-500 transition-all duration-200 resize-none focus:outline-none max-h-[200px] overflow-auto"
                placeholder="Describe tu proyecto, reto o idea..." />
            </div>

            <WhiteButton type="submit" class="w-full justify-center"
              :label="isSubmitting ? 'ENVIANDO...' : 'ENVIAR MENSAJE'" :disabled="isSubmitting">
              <PaperAirplaneIcon class="size-5" :class="{ 'animate-pulse': isSubmitting }" />
            </WhiteButton>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
