export let cameraPositions = {
  home: {
    x: -2.4,
    y: 0.8,
    z: 3.7
  },

  work: {
    x: 2,
    y: -7,
    z: 6
  },

  about: {
    x: -3,
    y: -4,
    z: 3
  }
};
const setPositions = () => {
  //Camera positions for desktop
  if (window.innerWidth > 1023) {
    cameraPositions.home = {
      x: -2.4,
      y: 0.8,
      z: 3.7
    };
    cameraPositions.work = {
      x: 2,
      y: -7,
      z: 6
    };
  }
  //Camera positions for tablets
  if (window.innerWidth <= 1023 && window.innerWidth > 750) {
    cameraPositions.home = {
      x: 0.3,
      y: 2,
      z: 4
    };
    cameraPositions.work = {
      x: 0,
      y: -7,
      z: 6
    };
  }
  //Camera positions for cellphones
  if (window.innerWidth <= 750) {
    cameraPositions.home = {
      x: 0,
      y: 1.5,
      z: 5
    };
    cameraPositions.work = {
      x: -1,
      y: -7,
      z: 6
    };
  }
};

window.addEventListener('resize', () => {
  setPositions();
});

setPositions();
