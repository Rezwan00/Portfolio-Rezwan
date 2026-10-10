import { gsap, ScrollTrigger } from '../../lib/gsap'

// Each pairing follows the existing editorial layout, not a generic card stack.
// The middle selector is the incoming chapter edge; the last is its image.
const handoffs = [
  ['.ecosystem__website', '.ecosystem__exchange', '.ecosystem__exchange'],
  ['.ecosystem__origin', '.showcase--lightning', '.technical__website'],
  ['.technical__website', '.technical__platform', '.technical__platform'],
  ['.technical__platform', '.showcase--web', '.web-entry--sorrento .project-visual'],
  ['.web-entry--sorrento', '.web-entry--alexis', '.web-entry--alexis .project-visual'],
  ['.web-entry--alexis', '.web-entry--xorbix', '.web-entry--xorbix .project-visual'],
] as const

export function createWorkExhibition(section: HTMLElement) {
  const interactive = 'a, button, video, input, [tabindex]'
  const viewport = window.innerHeight
  // Capture flow geometry before adding any pins. Coordinates must never depend
  // on the current scrubbed transform, including when resizing halfway through.
  const measured = handoffs.flatMap(([outgoing, boundary, incoming]) => {
    const visual = section.querySelector<HTMLElement>(outgoing)
    const edge = section.querySelector<HTMLElement>(boundary)
    const next = section.querySelector<HTMLElement>(incoming)
    if (!visual || !edge || !next || visual.querySelector(interactive) || next.querySelector(interactive)) return []
    const rect = visual.getBoundingClientRect()
    const nextRect = next.getBoundingClientRect()
    const caption = visual.querySelector('figcaption')
    const captionRange = document.createRange()
    if (caption) captionRange.selectNodeContents(caption)
    const captionRect = caption ? captionRange.getBoundingClientRect() : null
    return [{
      visual, next, outgoing,
      start: rect.bottom + scrollY - viewport + 40,
      settled: visual.querySelector('.project__arrival')!.getBoundingClientRect().top + scrollY - viewport * 0.35,
      arrivalStart: nextRect.top + scrollY - viewport * 0.98,
      end: nextRect.top + scrollY - viewport * 0.35,
      gap: edge.getBoundingClientRect().top - rect.bottom,
      fits: rect.height <= viewport * 0.78,
      captionInPath: captionRect && (edge !== next ||
        (captionRect.right > nextRect.left && captionRect.left < nextRect.right)),
      direction: Math.sign(nextRect.left + nextRect.width / 2 - rect.left - rect.width / 2),
    }]
  })

  const paired = new Set<HTMLElement>()
  const arrivalEnds = new Map<HTMLElement, number>()
  for (const { visual, next, outgoing, start, settled, arrivalStart, end, gap, fits, direction, captionInPath } of measured) {
    const departing = visual.querySelector<HTMLElement>('.project__catalog-depth')!
    const currentArrival = visual.querySelector<HTMLElement>('.project__arrival')!
    const arriving = next.querySelector<HTMLElement>('.project__arrival')!
    paired.add(next)
    // Let a frame finish arriving before asking it to recede. Otherwise the
    // nested arrival/departure scales fight, especially on shorter screenshots.
    // This pause uses existing scroll space; it adds no pin time or page height.
    const departureStart = Math.max(start, (arrivalEnds.get(currentArrival) ?? settled) + viewport * 0.06)
    const beginning = Math.min(departureStart, arrivalStart)
    const finish = Math.max(departureStart + 200, end)
    const span = finish - beginning
    const departurePhase = (departureStart - beginning) / span
    const arrivalPhase = Math.max(0, (arrivalStart - beginning) / span)
    arrivalEnds.set(arriving, finish)
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: visual, start: beginning, end: finish, scrub: 0.4,
        id: `exhibition-${outgoing.replace(/[^a-z0-9-]/gi, '')}`,
      },
    })
    // Different wrappers own arrival and departure. Reversing scroll restores
    // the same composition; no once-only curtain hides the next desktop image.
    timeline.to(departing, {
      scale: 0.91, y: -24, x: direction * 18, opacity: 0.84,
      transformOrigin: '50% 80%', duration: (1 - departurePhase) * 0.85,
      ease: 'power1.inOut',
    }, departurePhase).fromTo(arriving, {
      scale: 0.93, y: 48, x: -direction * 20, transformOrigin: '50% 0%',
    }, { scale: 1, y: 0, x: 0, duration: 1 - arrivalPhase, ease: 'power2.out' }, arrivalPhase)

    if (!fits) continue
    // Brief holds use existing scroll distance. Whole showcases never pin.
    const desiredHold = gsap.utils.clamp(120, 280, gap + viewport * 0.18)
    // A screenshot can overlap another screenshot, but never a caption. If
    // the incoming frame crosses the caption's actual text bounds, release
    // before that edge arrives; the shared depth timeline continues unpinned.
    const hold = captionInPath ? Math.min(desiredHold, Math.max(0, gap)) : desiredHold
    if (hold < 60) continue
    const pin = ScrollTrigger.create({
      trigger: visual, start, end: start + hold,
      pin: visual, pinSpacing: false, anticipatePin: 0,
      id: `catalog-${outgoing.replace(/[^a-z0-9-]/gi, '')}`,
    })
    if (visual.matches('.web-entry')) {
      // Gallery copy follows its image above the next entry's edge. This keeps
      // metadata readable while the frames visually exchange prominence.
      gsap.to(visual, {
        '--catalog-lift': `${-Math.max(0, hold - gap + 32)}px`, ease: 'none',
        // Clearance is positional, not decorative: it must track the native
        // pin immediately during fast/reverse scroll rather than ease behind it.
        scrollTrigger: { trigger: visual, start: pin.start, end: pin.end, scrub: true },
      })
    }
  }

  // Establish the opening frame and the small Rayleigh context visual with the
  // same scroll language. Everything remains visible even before it settles.
  for (const visual of section.querySelectorAll<HTMLElement>('[data-work-visual]')) {
    if (paired.has(visual) || visual.querySelector(interactive)) continue
    gsap.fromTo(visual.querySelector('.project__arrival'), { scale: 0.95, y: 36 }, {
      scale: 1, y: 0, ease: 'power2.out',
      scrollTrigger: { trigger: visual, start: 'top 98%', end: 'top 35%', scrub: 0.4 },
    })
  }
}
