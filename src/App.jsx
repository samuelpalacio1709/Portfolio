import './styles/App.css';
import { Header } from './components/Header';
import { Card } from './components/Card';
import { info } from './information';
import { VideoPlayer } from './components/VideoPlayer';
import { Home } from './components/Home';
import { useEffect, useRef } from 'react';
import { AnimateNextSection } from './utility';
function App() {
  const mainRef = useRef(null);
  const homeRef = useRef(null);
  const workRef = useRef(null);
  const aboutRef = useRef(null);
  function showWheel(event) {
    NextSection(event, true);
  }
  window.addEventListener('resize', (event) => {
    NextSection(event, false);
  });

  function NextSection(event, isAnimated) {
    const nextSection = AnimateNextSection(
      event,
      mainRef.current,
      [homeRef.current, workRef.current, aboutRef.current],
      isAnimated
    );
    console.log(nextSection);
  }

  return (
    <>
      <Header />
      <main ref={mainRef} onWheel={showWheel}>
        <Home homeRef={homeRef} />
        <Home homeRef={workRef} />
        <Home homeRef={aboutRef} />
      </main>

      {/* {info.map((item, index) => {
        return <Card key={index} project={item} />;
      })} */}
    </>
  );
}

export default App;
