import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CandidatureCard from '../CandidatureCard.vue'
import type { Candidature } from '@/types'

describe('CandidatureCard.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockCandidature: Candidature = {
    id: 1,
    nom: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    telephone: '0123456789',
    poste: 'Développeur Frontend',
    localisation: 'Paris',
    dateCandidature: '2024-03-15',
    statut: 'Nouveau',
    experience: '3 ans',
    competences: ['Vue.js', 'TypeScript', 'Tailwind CSS'],
    cv: 'https://example.com/cv.pdf',
    lettreMotivation: 'Je suis très motivé.',
    salaireSouhaite: 45000,
    disponibilite: 'Immédiate',
    commentaires: [],
  }

  it('affiche correctement les informations du candidat', () => {
    const wrapper = mount(CandidatureCard, {
      props: {
        candidature: mockCandidature,
      },
    })

    expect(wrapper.text()).toContain('Jean Dupont')
    expect(wrapper.text()).toContain('Développeur Frontend')
    expect(wrapper.text()).toContain('Paris')
    expect(wrapper.text()).toContain('Nouveau')
  })

  it('affiche les compétences (limitées à 3)', () => {
    const wrapper = mount(CandidatureCard, {
      props: {
        candidature: mockCandidature,
      },
    })

    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('TypeScript')
    expect(wrapper.text()).toContain('Tailwind CSS')
  })

  it("émet l'événement view-details lors du clic sur le bouton", async () => {
    const wrapper = mount(CandidatureCard, {
      props: {
        candidature: mockCandidature,
      },
    })

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted('view-details')).toBeTruthy()
    expect(wrapper.emitted('view-details')?.[0]).toEqual([1])
  })
})
