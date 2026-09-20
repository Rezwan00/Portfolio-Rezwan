import { workImages } from '../assets/work/images'

export type ProjectImage = {
  type: 'image'
  src: string
  srcSet: string
  width: number
  height: number
  alt: string
}

// Media remains ready for an approved recording; screenshots are the only
// media used in Phase 6.5. No project URLs or ownership claims are inferred.
export type ProjectMedia = ProjectImage | {
  type: 'video'; src: string; poster?: string; label: string
  captions?: { src: string; language: string; label: string }
}

export interface ShowcaseIdentity {
  id: string
  number: string
  category: string
  title: string
  titleLines: readonly string[]
  subtitle: string
}

export const rayleighProject = {
  id: 'rayleigh-mvtrx', number: '01', category: 'Featured work',
  title: 'Rayleigh × MVTRX', titleLines: ['Rayleigh', '× MVTRX'],
  subtitle: 'Digital Product Ecosystem', role: 'Software Engineer',
  disciplines: ['Frontend Engineering', 'Interactive Web', 'Product UI', 'Responsive Experience'],
  website: { type: 'image', ...workImages['mvtrx-site'], alt: 'MVTRX interactive website with a central 3D cube' },
  exchange: { type: 'image', ...workImages['mvtrx-exchange'], alt: 'MVTRX exchange market interface with market tables and charts' },
  origin: { type: 'image', ...workImages.rayleigh, alt: 'Rayleigh Research website with its black and yellow visual identity' },
} as const

export const lightningProject = {
  id: 'lightningchart-dashtera', number: '02', category: 'Professional work',
  title: 'LightningChart × Dashtera', titleLines: ['LightningChart', '× Dashtera'],
  subtitle: 'Data Visualization Products', role: 'Software Engineer — Frontend & Website',
  disciplines: ['Frontend', 'Product Web', 'WordPress', 'SEO', 'Digital Experience'],
  website: { type: 'image', ...workImages.lightningchart, alt: 'LightningChart data visualization website showing charting products' },
  platform: { type: 'image', ...workImages.dashtera, alt: 'Dashtera dashboard platform website with visualization examples' },
} as const

export const selectedWebIdentity: ShowcaseIdentity = {
  id: 'selected-web', number: '03', category: 'Selected web',
  title: 'Digital experiences across industries', titleLines: ['Digital experiences', 'across industries'],
  subtitle: 'Selected website work across hospitality, real estate and technology.',
}

export const selectedWebProjects = [
  {
    id: 'sorrento', title: 'Sorrento', industry: 'Restaurant & Hospitality',
    contribution: 'Full Website Build', technology: 'WordPress / Elementor',
    image: { type: 'image', ...workImages.sorrento, alt: 'Sorrento restaurant website with Italian coastal photography' },
  },
  {
    id: 'alexis', title: 'Alexis Dindal', industry: 'Real Estate',
    contribution: 'WordPress Implementation', technology: 'WordPress / AgentFire',
    image: { type: 'image', ...workImages['alexis-dindal'], alt: 'Alexis Dindal real estate website with an editorial property presentation' },
  },
  {
    id: 'xorbix', title: 'Xorbix Technologies', industry: 'Software & Technology',
    contribution: 'WordPress Implementation', technology: 'WordPress / Divi',
    image: { type: 'image', ...workImages.xorbix, alt: 'Xorbix Technologies software and technology company website' },
  },
] as const
