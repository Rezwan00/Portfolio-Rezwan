import { useRef } from 'react'
import { useContactDockMotion } from './useContactDockMotion'
import './ContactDock.css'

const EMAIL = 'ahmadrezwanqaderi@gmail.com'
const PHONE_HREF = '+358414822814'
const LINKEDIN_URL = 'https://www.linkedin.com/in/rezwan-qaderi-356487189/'

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 382 382" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889
        C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056
        H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806
        c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1
        s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73
        c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079
        c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426
        c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472
        L341.91,330.654L341.91,330.654z" />
    </svg>
  )
}

export function ContactDock() {
  const dockRef = useRef<HTMLDivElement>(null)
  useContactDockMotion(dockRef)

  return (
    <div className="contact-dock" ref={dockRef} data-hidden="true" inert>
      <nav className="contact-dock__nav" aria-label="Contact Rezwan Qaderi">
        <a className="contact-dock__link" href={`mailto:${EMAIL}`} aria-label="Email Rezwan Qaderi">
          <span className="contact-dock__tooltip" aria-hidden="true">Email</span>
          <EmailIcon />
        </a>
        <a className="contact-dock__link" href={`tel:${PHONE_HREF}`} aria-label="Call Rezwan Qaderi">
          <span className="contact-dock__tooltip" aria-hidden="true">Phone</span>
          <PhoneIcon />
        </a>
        <a
          className="contact-dock__link"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rezwan Qaderi on LinkedIn"
        >
          <span className="contact-dock__tooltip" aria-hidden="true">LinkedIn</span>
          <LinkedInIcon />
        </a>
      </nav>
    </div>
  )
}
