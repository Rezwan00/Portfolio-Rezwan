export interface ExperienceEntry {
  id: string
  number: string
  company: string
  role: string
  period?: string
  disciplines: readonly string[]
  description: string
}

export const experience: readonly ExperienceEntry[] = [
  {
    id: 'mvtrx', number: '01', company: 'MVTRX / Algostakes',
    role: 'Software Engineer', period: '2026 — Present',
    disciplines: ['Frontend Engineering', 'Product UI / Interactive Web', 'React / TypeScript'],
    description: 'Building frontend and web experiences across the MVTRX / Rayleigh ecosystem, combining responsive interfaces, interactive experiences and product-focused UI.',
  },
  {
    id: 'lightningchart', number: '02', company: 'LightningChart',
    role: 'Software Engineer — Frontend & Website', period: 'Approx. 1.5 years',
    disciplines: ['React / TypeScript', 'Accessibility / Testing', 'WordPress / SEO'],
    description: 'Developed and maintained frontend and web experiences across LightningChart products, working across UI implementation, WCAG AA accessibility and automated testing.',
  },
  {
    id: 'independent', number: '03', company: 'Independent Web Development',
    role: 'Web Developer / Designer',
    disciplines: ['WordPress / Elementor', 'Divi / AgentFire', 'Responsive Design / SEO'],
    description: 'Designing and building responsive websites for businesses and freelance client projects using WordPress-based platforms and custom frontend implementation.',
  },
]
