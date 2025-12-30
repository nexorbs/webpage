import { AuthManager } from '@/helpers/authManager'

const baseNavItems = ['Inicio', 'Servicios', 'Nosotros', 'Tecnologías', 'Contacto', 'Login']
const baseSectionIds = ['home', 'services', 'about', 'tech', 'contact']

const USER = AuthManager.getUser()?.display_name

const adminNavItems = ['Dashboard', `${USER}`]
const adminSectionIds = ['home', 'services', 'about', 'tech', 'contact', '']

export function getCurrentNavItems(): string[] {
  const isLoggedIn = AuthManager.isLoggedIn()
  const user = AuthManager.getUser()

  if (isLoggedIn && user?.role === 'admin') {
    return adminNavItems
  }
  return baseNavItems
}

export function getCurrentSectionIds(): string[] {
  const isLoggedIn = AuthManager.isLoggedIn()
  const user = AuthManager.getUser()

  if (isLoggedIn && user?.role === 'admin') {
    return adminSectionIds
  }
  return baseSectionIds
}

export const navItems = baseNavItems
export const sectionIds = baseSectionIds
