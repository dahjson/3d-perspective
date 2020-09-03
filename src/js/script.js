!function() {
  'use_strict';

  // setup perspective
  const focalLength = 100;
  const zSpacing = 50;
  const beyond = 1.5; // maximum scale visibility

  // frames per second
  const frames = 24;
  const orbSpeed = 10;

  // center points
  let centerX = window.innerWidth * 0.5;
  let centerY = window.innerHeight * 0.5;
  let centerZ = 0;

  // change in position
  let deltaX = centerX;
  let deltaY = centerY;
  let deltaZ = centerZ;

  // target position
  let targetX, targetY, targetZ;

  // setup orbs
  const orbTotal = 100;
  const orbWidth = 300;
  const orbHeight = 300;
  const container = document.querySelector('.orbs');
  const orbs = [];
  let id = 0; // start on first orb

  for (let i = 0; i < orbTotal; i++) {
    // create orb object
    orbs[i] = {};
    orbs[i].id = i;

    // create orb element
    orbs[i].el = document.createElement('div');
    orbs[i].el.setAttribute('class', 'orb');
    orbs[i].el.dataset.id = i;
    orbs[i].el.textContent = i + 1;

    // scale and position
    orbs[i].x = 0;
    orbs[i].y = 0;
    orbs[i].z = i * zSpacing;
    const scale = focalLength / (focalLength + orbs[i].z); // perspective formula
    orbs[i].el.style.zIndex = orbTotal - i;

    // position off screen
    orbs[i].el.style.left = -orbWidth + 'px';
    orbs[i].el.style.top = -orbHeight + 'px';

    // save initial position
    orbs[i].iz = orbs[i].z;
    orbs[i].ix = orbs[i].x;
    orbs[i].iy = orbs[i].y;

    // set width and height
    orbs[i].el.style.width = orbWidth + 'px';
    orbs[i].el.style.height = orbHeight + 'px';
    orbs[i].el.style.transform = `scale(${scale}, ${scale}) translate(-50%, -50%)`; // translate to adjust center

    // set random colors
    orbs[i].el.style.color = '#fff';
    orbs[i].el.style.background = getRandomHexColor();

    // set opacity
    orbs[i].el.style.opacity = scale;

    // click event
    orbs[i].el.addEventListener('click', clickedOrb);

    // append orb to container
    container.appendChild(orbs[i].el);
  }

  // set inital pattern
  circularPattern();

  // shift perspective
  function updateOrbs() {
    // change in position (easing formula)
    deltaX += (targetX - deltaX) / orbSpeed;
    deltaY += (targetY - deltaY) / orbSpeed;
    deltaZ += (targetZ - deltaZ) / orbSpeed;

    for (let i = 0; i < orbTotal; i++) {
      // scale and reposition
      orbs[i].z = orbs[i].iz - deltaZ;
      const scale = focalLength / (focalLength + orbs[i].z); // perspective formula
      orbs[i].x = (orbs[i].ix - deltaX) * scale + centerX;
      orbs[i].y = (orbs[i].iy - deltaY) * scale + centerY;
      orbs[i].el.style.transform = `scale(${scale}, ${scale}) translate(-50%, -50%)`; // translate to adjust center
      orbs[i].el.style.left = orbs[i].x + 'px';
      orbs[i].el.style.top = orbs[i].y + 'px';

      // reset opacity
      orbs[i].el.style.opacity = scale;

      // hide if beyond visibility
      if (scale > beyond || scale < 0) {
        orbs[i].el.style.visibility = 'hidden';
      } else {
        orbs[i].el.style.visibility = 'visible';
      }
    }
  }

  // set repeating interval
  setInterval(updateOrbs, 1000 / frames); // 24 frames per second

  // reposition to target orb
  function targetOrb(_id) {
    _id = _id === undefined ? id : _id;
    targetX = orbs[_id].ix;
    targetY = orbs[_id].iy;
    targetZ = orbs[_id].iz;
    id = _id;
  }

  // set initial orb
  targetOrb();

  // window resize events
  ['resize', 'onorientationchange'].forEach(item => {
    window.addEventListener(item, event => {
      centerX = window.innerWidth * 0.5;
      centerY = window.innerHeight * 0.5;
    });
  });

  // move to clicked orb
  function clickedOrb(event) {
    const targetId = event.target.dataset.id;
    if (id !== targetId) {
      id = targetId;
      targetOrb();
    }
  }

  // mouse wheel support
  window.addEventListener('wheel', event => {
    const delta = 1 * Math.sign(event.deltaY);
    if (id > 0 && delta === -1) {
      targetOrb(--id); // previous orb
    } else if (id < (orbTotal - 1) && delta === 1) {
      targetOrb(++id); // next orb
    }
  });

  // keyboard shortcuts
  window.addEventListener('keydown', event => {
    let keys = {
      up: 38,
      down: 40,
      left: 37,
      right: 39,
      space: 32
    };
    switch (event.which) {
      case keys.up:
      case keys.space:
        return id < (orbTotal - 1) && targetOrb(++id); // next orb
      case keys.down:
        return id > 0 && targetOrb(--id); // previous orb
      case keys.left:
        return targetOrb(0); // first orb
      case keys.right:
        return targetOrb(orbTotal - 1); // last orb
    }

  });

  // random pattern
  document.querySelector('.patterns__random').addEventListener('click', event => {
    event.preventDefault();
    randomPattern();
    targetOrb();
  });

  function randomPattern() {
    for (let i = 0; i < orbTotal; i++) {
      orbs[i].ix = getRandomRange(0, window.innerWidth - orbWidth);
      orbs[i].iy = getRandomRange(0, window.innerHeight - orbHeight);
    }
  }

  // rows pattern
  document.querySelector('.patterns__rows').addEventListener('click', event => {
    event.preventDefault();
    rowsPattern();
    targetOrb();
  });

  function rowsPattern(rows = 10) {
    const xSpacing = orbWidth * 0.75;
    const ySpacing = orbHeight * 1.75;
    for (let i = 0; i < orbTotal; i++) {
      orbs[i].ix = xSpacing * (i % rows);
      orbs[i].iy = ySpacing * Math.floor(i / rows);
    }
  }

  // zigzag pattern
  document.querySelector('.patterns__zigzag').addEventListener('click', event => {
    event.preventDefault();
    zigzagPattern();
    targetOrb();
  });

  function zigzagPattern(rows = 5) {
    const xSpacing = orbWidth * 0.5;
    const ySpacing = orbHeight * 0.2;
    let zigzag = 1;
    for (let i = 0; i < orbTotal; i++) {
      const remainder = i % rows;
      zigzag = remainder === 0 ? -zigzag : zigzag;
      const xOffset = zigzag === 1 ? rows * xSpacing : 0;
      orbs[i].ix = (xSpacing * remainder * zigzag) - xOffset;
      orbs[i].iy = ySpacing * i;
    }
  }

  // wave and spiral patterns
  document.querySelector('.patterns__wave').addEventListener('click', event => {
    event.preventDefault();
    circularPattern(undefined, undefined, 'wave');
    targetOrb();
  });

  document.querySelector('.patterns__spiral').addEventListener('click', event => {
    event.preventDefault();
    circularPattern();
    targetOrb();
  });

  function circularPattern(radius = 1200, spacing = 60, type = 'spiral') {
    const degrees = 360;
    for (let i = 0; i < orbTotal; i++) {
      const degree = i * spacing;
      const angle = degree / degrees;
      if (type === 'spiral') {
        orbs[i].ix = Math.sin(angle) * radius;
        orbs[i].iy = Math.cos(angle) * radius;
      } else if (type == 'wave') {
        orbs[i].ix = Math.sin(angle) * radius;
        orbs[i].iy = Math.sin(angle) * radius;
      }
    }
  }

  // helper functions
  function getRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomHexColor() {
    return '#' + (Math.random().toString(16) + '0000000').slice(2,8);
  }

}();
