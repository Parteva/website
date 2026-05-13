import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ease = {
  default: 'power3.out',
  hero: 'expo.inOut',
  hover: 'power2.out',
  spring: 'back.out(1.4)',
};

export function revealSection(container: Element | string) {
  const el = typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const items = el.querySelectorAll<HTMLElement>('.reveal-item');
  if (!items.length) return;

  gsap.fromTo(
    items,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: ease.default,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
    }
  );
}

export function initRevealAll() {
  const sections = document.querySelectorAll('[data-reveal]');
  sections.forEach(revealSection);
}

export function initSectionBeams() {
  const sections = document.querySelectorAll<HTMLElement>('[data-reveal]');
  sections.forEach((section) => {
    const beam = document.createElement('div');
    beam.className = 'section-beam';
    beam.setAttribute('aria-hidden', 'true');
    section.insertBefore(beam, section.firstChild);

    gsap.to(beam, {
      scaleX: 1,
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        once: true,
      },
    });
  });
}

export function pageEntrance() {
  const tl = gsap.timeline({ defaults: { ease: ease.default } });
  const nav = document.querySelector('[data-nav]');
  const heroText = document.querySelectorAll('[data-hero-text]');

  if (nav) tl.fromTo(nav, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
  if (heroText.length) {
    tl.fromTo(
      heroText,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      '-=0.2'
    );
  }

  return tl;
}
