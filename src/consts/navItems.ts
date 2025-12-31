import { AuthManager } from '@/helpers/authManager'

const baseNavItems = ['Inicio', 'Servicios', 'Nosotros', 'Tecnologías', 'Contacto', 'Login']
const baseSectionIds = ['home', 'services', 'about', 'tech', 'contact']

export function getCurrentNavItems(currentRoute: string): string[] {
  const isLoggedIn = AuthManager.isLoggedIn()
  const user = AuthManager.getUser()

  if (isLoggedIn && user?.display_name) {
    const items = [...baseNavItems]
    const loginIndex = items.indexOf('Login')
    if (loginIndex !== -1) {
      const truncatedName = ''
      items[loginIndex] = `${truncatedName}`
    }
    return items
  }

  return baseNavItems
}

export function getCurrentSectionIds(currentRoute: string): string[] {
  return baseSectionIds
}

export const navItems = baseNavItems
export const sectionIds = baseSectionIds
