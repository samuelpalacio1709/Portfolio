import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';

export function Header({ currentSection, OnOptionChanged, onChangingSection }) {
  const [isMenuOpened, setMenuOpened] = useState(false);
  const options = useRef(null);
  const openMenu = (state) => {
    setMenuOpened(state);
  };

  useEffect(() => {
    if (isMenuOpened) {
      gsap.to(options.current, { right: 0, opacity: 1, duration: 0.3, delay: 0.3 });
    }
  }, [isMenuOpened]);

  return (
    <header className="header" style={{ pointerEvents: onChangingSection ? 'none' : 'auto' }}>
      <div className="logo">
        <h3>
          <img src="assets/imgs/logo.png" alt="logo" />
        </h3>
      </div>
      <BarButton onMenuOpened={openMenu}></BarButton>
      <div ref={options} className="options">
        <Option
          title={'Home'}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={0}
        />
        <Option
          title={'Work'}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={1}
        />
        <Option
          title={'About'}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={2}
        />
        <Option
          title={"Let's talk"}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={3}
        />
      </div>
    </header>
  );
}

function BarButton({ onMenuOpened }) {
  const lineUp = useRef(null);
  const lineMiddle = useRef(null);
  const lineDown = useRef(null);
  const blur = useRef(null);

  const handleClick = () => {
    gsap.to(lineUp.current, { x: '+=100', opacity: 0, duration: 0.3 });
    gsap.to(lineMiddle.current, { x: '-=100', opacity: 0, duration: 0.3 });
    gsap.to(lineDown.current, { x: '+=240', opacity: 0, duration: 0.3 });
    gsap.to(blur.current, { opacity: 1, duration: 0.3 });

    onMenuOpened(true);
  };

  return (
    <>
      <div ref={blur} className="bg-blur"></div>
      <div onClick={handleClick} className="bar-menu">
        <div ref={lineUp} className="line-bar"></div>
        <div ref={lineMiddle} className="line-bar"></div>
        <div ref={lineDown} className="line-bar"></div>
      </div>
    </>
  );
}

function Option({ title, selected, OnOptionChanged, option }) {
  return (
    <div
      onClick={() => {
        OnOptionChanged(option);
      }}
      className={`option ${selected === option && 'option-selected'}`}
    >
      <h3>{title}</h3>
    </div>
  );
}
