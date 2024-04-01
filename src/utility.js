import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/all';
import * as THREE from 'three';
gsap.registerPlugin(ScrollToPlugin);

//Animate text from lefto to rigth!
export function AnimateLeftToRigth(element, duration, delay) {
  gsap.from(element, {
    x: -150,
    opacity: 0,
    duration,
    ease: 'power4.out',
    delay
  });
}

//Scroll Animation
let currentAnimation = null;
let currentSectionIndex = 0;

export function AnimateNextSection(event, main, sections, isAnimated = true, customSection = null) {
  const containerRect = main.getBoundingClientRect();
  const rectContents = sections.map((section) => {
    return section.getBoundingClientRect();
  });

  if (!isAnimated) {
    currentAnimation?.kill();
    currentAnimation = null;
    const scrollY = rectContents[currentSectionIndex].top - containerRect.top + main.scrollTop;
    window.scrollTo(0, scrollY);
    return currentSectionIndex;
  }

  if (currentAnimation != null) return currentSectionIndex;

  if (isAnimated && event !== null) {
    console.log(event);
    if (event.deltaY > 0) {
      currentSectionIndex++;
      if (currentSectionIndex >= sections.length) {
        currentSectionIndex = sections.length - 1;
      }
    } else {
      currentSectionIndex--;
      if (currentSectionIndex < 0) {
        currentSectionIndex = 0;
      }
    }
  }
  if (customSection !== null) {
    currentSectionIndex = customSection;
  }

  const scrollY = rectContents[currentSectionIndex].top - containerRect.top + main.scrollTop;
  if (scrollY == window.scrollY) return currentSectionIndex;

  currentAnimation = gsap.to(window, 1.5, {
    scrollTo: {
      y: scrollY,
      autoKill: true
    },
    ease: 'sine.inOut',
    onComplete: () => {
      currentAnimation = null;
    }
  });

  return currentSectionIndex;
}
