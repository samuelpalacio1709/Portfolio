import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';

export function Header({ currentSection, OnOptionChanged, onChangingSection }) {
  const [isMenuOpened, setMenuOpened] = useState(false);
  const options = useRef(null);
  const openMenu = (state) => {
    if (state) {
      gsap.to(options.current, { right: 0, opacity: 1, duration: 0.3, delay: 0.3 });
    } else {
      gsap.to(options.current, { right: '-590px', opacity: 0, duration: 0.3, delay: 0.3 });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 750 && window.innerWidth < 1023) {
        options.current.style.right = '20px';
        options.current.style.opacity = '1';
      } else if (window.innerWidth >= 1023) {
        options.current.style.right = '150px';
        options.current.style.opacity = '1';
      } else {
        options.current.style.right = '-590px';
        options.current.style.opacity = '0';
      }

      setMenuOpened(false);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {}, [isMenuOpened]);

  return (
    <header
      className="header show-enable"
      style={{ pointerEvents: onChangingSection ? 'none' : 'auto' }}
    >
      <div className="logo">
        <h3>
          <img src="assets/imgs/logo.png" alt="logo" />
        </h3>
      </div>
      <BarButton onMenuOpened={openMenu} section={currentSection}></BarButton>
      <div ref={options} className="options">
        <Option
          title={'Home'}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={0}
          onMenuOpened={openMenu}
        />
        <Option
          title={'Work'}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={1}
          onMenuOpened={openMenu}
        />
        <Option
          title={'About'}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={2}
          onMenuOpened={openMenu}
        />
        {/* <Option
          title={"Let's talk"}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={3}
        /> */}
      </div>
    </header>
  );
}

function BarButton({ onMenuOpened, section }) {
  const lineUp = useRef(null);
  const lineMiddle = useRef(null);
  const lineDown = useRef(null);
  const blur = useRef(null);
  const resetMenu = () => {
    gsap.to(lineUp.current, { x: '0', opacity: 1, duration: 0.3 });
    gsap.to(lineMiddle.current, { x: '0', opacity: 1, duration: 0.3 });
    gsap.to(lineDown.current, { x: '0', opacity: 1, duration: 0.3 });
    gsap.to(blur.current, { opacity: 0, duration: 0.3 });
    blur.current.style.pointerEvents = 'none';
  };
  const handleClick = () => {
    gsap.to(lineUp.current, { x: '+=100', opacity: 0, duration: 0.3 });
    gsap.to(lineMiddle.current, { x: '-=100', opacity: 0, duration: 0.3 });
    gsap.to(lineDown.current, { x: '+=240', opacity: 0, duration: 0.3 });
    gsap.to(blur.current, { opacity: 1, duration: 0.3 });
    blur.current.style.pointerEvents = 'all';
    onMenuOpened(true);
  };
  useEffect(() => {
    resetMenu();
    if (!onMenuOpened) {
      resetMenu();
    }
  }, [section, onMenuOpened]);

  return (
    <>
      <div
        onClick={() => {
          resetMenu();
          onMenuOpened(false);
        }}
        ref={blur}
        className="bg-blur"
      ></div>
      <div onClick={handleClick} className="bar-menu">
        <div ref={lineUp} className="line-bar"></div>
        <div ref={lineMiddle} className="line-bar"></div>
        <div ref={lineDown} className="line-bar"></div>
      </div>
    </>
  );
}

function Option({ title, selected, OnOptionChanged, option, onMenuOpened }) {
  return (
    <div
      onClick={() => {
        OnOptionChanged(option);
        if (window.innerWidth <= 750) {
          onMenuOpened(false);
        }
      }}
      className={`option ${selected === option && 'option-selected'}`}
    >
      <h3>{title}</h3>
    </div>
  );
}
