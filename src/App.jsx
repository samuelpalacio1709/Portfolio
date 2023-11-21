import './styles/App.css';
import { Header } from './components/Header';
import { Card } from './components/Card';
import { info } from './information';
import { VideoPlayer } from './components/VideoPlayer';
import { Home } from './components/Home';
import { useEffect, useRef, useState } from 'react';
import { AnimateNextSection } from './utility';
import { Experience } from './components/Experience';
import { Work } from './components/Work';
function App() {
  const [section, setSection] = useState(0);

  const mainRef = useRef(null);
  const homeRef = useRef(null);
  const workRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  function showWheel(event) {
    event.preventDefault();
    NextSection(event, true);
  }
  window.addEventListener('resize', (event) => {
    NextSection(event, false);
  });

  function NextSection(event, isAnimated, customSection = null) {
    const nextSection = AnimateNextSection(
      event,
      mainRef.current,
      [homeRef.current, workRef.current],
      isAnimated,
      customSection
    );
    setSection(nextSection);
  }

  function OptionChanged(option) {
    NextSection(null, true, option);
  }

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    const mainElement = mainRef.current;
    mainElement.addEventListener('wheel', showWheel, { passive: false });
    return () => {
      mainElement.removeEventListener('wheel', showWheel);
    };
  }, []);

  return (
    <>
      <Header currentSection={section} OnOptionChanged={OptionChanged} />

      <main ref={mainRef}>
        <Experience />
        <Home sectionRef={homeRef} />
        <Work sectionRef={workRef} />
      </main>
    </>
  );
}

export default App;
