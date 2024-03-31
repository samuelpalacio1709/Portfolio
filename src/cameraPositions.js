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
    x: -2,
    y: -4,
    z: 5
  }
};
const setPositions = () => {
  if (window.innerWidth <= 1000) {
    cameraPositions.home = {
      x: 0.3,
      y: 2,
      z: 4
    };
  }

  if (window.innerWidth <= 650) {
    cameraPositions.home = {
      x: 0,
      y: 1,
      z: 5
    };

    cameraPositions.work = {
      x: -1,
      y: -7.5,
      z: 8
    };
  }
};

window.addEventListener('resize', () => {
  setPositions();
});

setPositions();
