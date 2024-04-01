import './styles/App.css';
import { Header } from './components/Header';
import { Card } from './components/Card';
import { VideoPlayer } from './components/VideoPlayer';
import { Home } from './components/Home';
import { About } from './components/About';
import { Suspense, useEffect, useRef, useState } from 'react';
import { AnimateNextSection } from './utility';
import { Experience } from './components/Experience';
import { Work } from './components/Work';
import { Loading } from './components/Loading.JSX';
function App() {
  const [section, setSection] = useState(0);
  const mainRef = useRef(null);
  const homeRef = useRef(null);
  const workRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const timerRef = useRef(null);

  const [sceneLoaded, setLoadScene] = useState(false);
  const [srcVideo, setVideo] = useState('');
  const [isChangingSection, setChangingSection] = useState(false);

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
      [homeRef.current, workRef.current, aboutRef.current],
      isAnimated,
      customSection
    );
    setSection(nextSection);
    setChangingSection(true);
    let duration = 1800;

    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        setChangingSection(false);
        timerRef.current = null;
      }, duration);
    }
  }

  function OptionChanged(option) {
    NextSection(null, true, option);
  }
  function SceneLoaded() {
    setTimeout(() => {
      setLoadScene(true);
    }, 1000);
  }
  function ShowVideo(url) {
    setVideo(url);
  }

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    const mainElement = mainRef.current;
    mainElement.addEventListener('wheel', showWheel, { passive: false });
    // mainElement.addEventListener('touchmove', showWheel, { passive: false });
    return () => {
      mainElement.removeEventListener('wheel', showWheel);
      // mainElement.removeEventListener('touchmove', showWheel);
    };
  }, []);

  return (
    <>
      {!sceneLoaded && <Loading></Loading>}

      <>
        <Header
          currentSection={section}
          OnOptionChanged={OptionChanged}
          onChangingSection={isChangingSection}
        />
        <VideoPlayer src={srcVideo} OnVideoShown={ShowVideo} />
        <main ref={mainRef}>
          <Experience section={section} OnSceneLoaded={SceneLoaded} />
          {sceneLoaded && (
            <>
              <Home sectionRef={homeRef} />
              <Work sectionRef={workRef} OnVideoShown={ShowVideo} />
              <About sectionRef={aboutRef} />
            </>
          )}
        </main>
      </>
    </>
  );
}

export default App;
