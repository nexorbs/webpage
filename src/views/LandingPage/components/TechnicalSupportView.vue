<script setup lang="ts">
import Chip from '@/components/Chip.vue'
import SupportCard from '@/components/SupportCard.vue'
import { SparklesIcon, BugAntIcon, QuestionMarkCircleIcon, LightBulbIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'

interface SupportCard {
  id: string
  title: string
  description: string
  icon: 'BugAntIcon' | 'SparklesIcon' | 'QuestionMarkCircleIcon' | 'LightBulbIcon' | 'ExclamationTriangleIcon' | 'ArrowPathIcon'
  priority: 'ALTA' | 'MEDIA' | 'PROGRAMADA'
  hours: string
}

const icons = {
  BugAntIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
}

const supportCards: SupportCard[] = [
  {
    id: 'bug-report',
    title: 'REPORTES DE ERRORES',
    description: 'Reporta bugs y problemas técnicos del sistema',
    icon: 'BugAntIcon',
    priority: 'ALTA',
    hours: '< 4 Horas',
  },
  {
    id: 'feature-request',
    title: 'NUEVAS FUNCIONALIDADES',
    description: 'Solicita mejoras y características adicionales',
    icon: 'SparklesIcon',
    priority: 'MEDIA',
    hours: '< 24 Horas',
  },
  {
    id: 'general-support',
    title: 'SOPORTE GENERAL',
    description: 'Ayuda con el uso de la plataforma y dudas generales',
    icon: 'QuestionMarkCircleIcon',
    priority: 'MEDIA',
    hours: '< 8 Horas',
  },
  {
    id: 'consultation',
    title: 'CONSULTORÍA TÉCNICA',
    description: 'Asesoramiento especializado para tu proyecto',
    icon: 'LightBulbIcon',
    priority: 'PROGRAMADA',
    hours: '1-3 Días',
  },
  {
    id: 'technical-issues',
    title: 'PROBLEMAS TÉCNICOS',
    description: 'Incidencias críticas de infraestructura',
    icon: 'ExclamationTriangleIcon',
    priority: 'ALTA',
    hours: '< 2 Horas',
  },
  {
    id: 'change-requests',
    title: 'CAMBIOS EN PROYECTOS',
    description: 'Modificaciones en desarrollos existentes',
    icon: 'ArrowPathIcon',
    priority: 'MEDIA',
    hours: '< 12 Horas',
  },
]
</script>

<template>
  <section id="technical-support" style="min-height: calc(100svh - 61px)" className="py-24 max-md:py-16 bg-nexBlack">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-black text-nexWhite mb-6 tracking-tight">
          SOPORTE TÉCNICO
        </h2>
        <div className="w-24 h-1 bg-nexWhite mx-auto mb-8"></div>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
          Sistema de tickets integrado con gestión de usuarios, proyectos y seguimiento completo
        </p>
      </div>

      <!-- Support Cards Grid -->
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr mb-20">
        <SupportCard v-for="card in supportCards" :key="card.id" :card="card" :icons="icons" />
      </div>

      <!-- Response Times Guarantee -->
      <div
        className="bg-nexBlack border border-nexWhite/20 p-8 mb-16 hover:border-nexWhite/40 transition-all duration-300">
        <h3 className="text-2xl font-bold text-nexWhite mb-8 text-center tracking-wide">
          TIEMPOS DE RESPUESTA GARANTIZADOS
        </h3>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-nexWhite mb-2">
              &lt; 4h
            </div>
            <div className="text-gray-400 font-light">Problemas críticos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-nexWhite mb-2">
              &lt; 24h
            </div>
            <div className="text-gray-400 font-light">Soporte general</div>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-6 text-center">
      <Chip>
        <SparklesIcon class="w-4 h-4 text-nexWhite" />
        <span class="text-sm text-gray-300">Plataforma de gestión incluida en todos los proyectos</span>
        <SparklesIcon class="w-4 h-4 text-nexWhite" />
      </Chip>
    </div>
  </section>
</template>
