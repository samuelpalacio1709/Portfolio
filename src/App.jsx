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
  const [touchDown, setTouchDown] = useState(false);
  const lastY = useRef(null);

  const handleTouchStart = (event) => {
    const touch = event.changedTouches[0];
    const clientY = touch.clientY;
    console.log('clientY at touch end:', clientY);
    lastY.current = clientY;
  };

  const handleTouchEnd = (event) => {
    // const touch = event.changedTouches[0];
    // const clientY = touch.clientY;
    // console.log('clientY at touch end:', clientY);
    // lastY.current = clientY;
  };

  const handleTouchMove = (event) => {
    console.log('move');

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - lastY.current;
    const e = { deltaY: -deltaY, preventDefault: () => {} };
    showWheel(e);
    console.log(lastY.current);
  };
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
    mainElement.addEventListener('touchend', handleTouchEnd);
    mainElement.addEventListener('touchstart', handleTouchStart);
    mainElement.addEventListener('touchmove', handleTouchMove);
    return () => {
      mainElement.removeEventListener('wheel', showWheel);
      mainElement.removeEventListener('touchstart', handleTouchStart);
      mainElement.removeEventListener('touchend', handleTouchEnd);
      mainElement.removeEventListener('touchmove', handleTouchMove);
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
          <MouseScroll section={section}></MouseScroll>
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

function MouseScroll({ section }) {
  function checkDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  // Rendering the <div> only if show is true and checkDevice returns true
  if (section == 0) {
    return (
      <div className="field">
        <div className="mouse"></div>
      </div>
    );
  }

  // If show is false or checkDevice returns false, return null
  return null;
}
