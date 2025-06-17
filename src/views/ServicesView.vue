<script setup lang="ts">
import ServiceCard from '@/components/ServiceCard.vue'

const services: {
  icon: 'CodeBracketIcon' | 'DevicePhoneMobileIcon' | 'LightBulbIcon' | 'Square3Stack3DIcon'
  title: string
  description: string
  features: string[]
  highlight: string
}[] = [
  {
    icon: 'CodeBracketIcon',
    title: 'Desarrollo Web',
    description: 'Sitios web modernos, responsivos y escalables con las últimas tecnologías.',
    features: ['Vue.js & React.js', 'Backend en Rust/Node.js', 'Optimización Cloudflare'],
    highlight: 'Frontend & Backend',
  },
  {
    icon: 'DevicePhoneMobileIcon',
    title: 'Aplicaciones Móviles',
    description: 'Apps intuitivas y de alto rendimiento para iOS y Android.',
    features: ['Flutter nativo', 'React Native', 'UX/UI optimizado'],
    highlight: 'Multiplataforma',
  },
  {
    icon: 'LightBulbIcon',
    title: 'Consultoría Tech',
    description: 'Diagnóstico y propuestas personalizadas para tus retos tecnológicos.',
    features: [
      'Análisis de requerimientos',
      'Estrategia de desarrollo',
      'Optimización de procesos',
    ],
    highlight: 'Estrategia',
  },
  {
    icon: 'Square3Stack3DIcon',
    title: 'Soluciones Integrales',
    description: 'Desde la idea hasta la implementación y lanzamiento completo.',
    features: ['Desarrollo end-to-end', 'Implementación completa', 'Soporte post-lanzamiento'],
    highlight: 'Completo',
  },
]
</script>
<template>
  <section id="services" className="py-24 bg-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
          SERVICIOS
        </h2>
        <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
          Soluciones tecnológicas personalizadas para llevar tu proyecto al siguiente nivel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ServiceCard
          v-for="(service, index) in services"
          :key="index"
          :icon="service.icon"
          :highlight="service.highlight"
          :title="service.title"
          :description="service.description"
          :features="service.features"
        />
      </div>
    </div>
  </section>
</template>
