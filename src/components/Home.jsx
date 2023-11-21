import '../styles/Home.css';
import { useRef, useLayoutEffect } from 'react';
import { AnimateLeftToRigth } from '../utility';

import Typed from 'typed.js';

export function Home({ sectionRef }) {
  const text = useRef(null);
  const headingRef = useRef(null);

  useLayoutEffect(() => {
    const headingElement = headingRef.current;
    AnimateLeftToRigth(headingElement, 1, 0);

    const typed = new Typed(text.current, {
      strings: [
        'I am a Software Developer who loves creating <strong>cool stuff.<strong>',
        'I am a Software Developer who loves creating <strong>videogames.<strong>',
        'I am a Software Developer who loves creating <strong>web pages.<strong>',
        'I am a Software Developer who loves creating <strong>WebGL experiences.<strong>',
        'I am a Software Developer who loves creating <strong>VR and AR apps.<strong> ',
        'I am a Software Developer who loves creating <strong>3D Models.<strong> '
      ],
      typeSpeed: 25,
      smartBackspace: true,
      startDelay: 500,
      backDelay: 2000,
      loop: true,
      loopCount: Infinity
    });

    return () => {
      typed.destroy();
    };
  }, []);
  return (
    <section className="home section" ref={sectionRef}>
      <div className="intro">
        <h1 ref={headingRef}>
          Hello there! <br />
          This is <span className="strong">Samuel</span>{' '}
        </h1>
        <p className="intro-dsc">
          <span ref={text} />
        </p>
      </div>
    </section>
  );
}
