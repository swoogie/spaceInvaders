const keyRight = 68;
const keyLeft = 65;
const keySpace = 32;

const gameWidth = 800;
const gameHeight = 600;

const state = {
  x: 0,
  y: 0,
  moveRight: false,
  moveLeft: false,
  shoot: false,
  pewpew: [],
  spaceshipW: 50,
};

function setPosition($element, x, y) {
  $element.style.transform = `translate(${x}px, ${y}px)`;
}

function setSize($element, width) {
  $element.style.width = `${width}px`;
  $element.style.height = `auto`;
}

function bound(x) {
  if (x >= gameWidth - state.spaceshipW) {
    state.x = gameWidth - state.spaceshipW;
    return state.x;
  } else if (x <= 0) {
    state.x = 0;
    return state.x;
  } else {
    return state.x;
  }
}

function createPlayer($container) {
  state.x = gameWidth / 2;
  state.y = gameHeight - 50;
  const $player = document.createElement("img");
  $player.src = "assets/spaceship.png";
  $player.className = "player";
  $container.appendChild($player);
  setPosition($player, state.x, state.y);
  setSize($player, state.spaceshipW);
}

function createPew($container, x, y) {
  const $pew = document.createElement("img");
  $pew.src = "assets/bluepew.png";
  $pew.className = "pew";
  $container.appendChild($pew);
  const pew = { x, y, $pew };
  state.pewpew.push(pew);
  setPosition($pew, x, y);
}

function updatePew($container) {
  const pewpew = state.pewpew;
  for (let i = 0; i < pewpew.length; i++) {
    const pew = pewpew[i];
    pew.y -= 2;
    setPosition(pew.$pew, pew.x, pew.y);
  }
}

function updatePlayer() {
  if (state.moveLeft) {
    state.x -= 3;
  } if (state.moveRight) {
    state.x += 3;
  } if (state.shoot) {
    createPew($container, state.x - state.spaceshipW / 2, state.y);
  }
  const $player = document.querySelector(".player");
  setPosition($player, bound(state.x), state.y);
}

function keyPress(event) {
  if (event.keyCode === keyRight) {
    state.moveRight = true;
  } else if (event.keyCode === keyLeft) {
    state.moveLeft = true;
  } else if (event.keyCode === keySpace) {
    state.shoot = true;
  }
}

function keyRelease(event) {
  if (event.keyCode === keyRight) {
    state.moveRight = false;
  } else if (event.keyCode === keyLeft) {
    state.moveLeft = false;
  } else if (event.keyCode === keySpace) {
    state.shoot = false;
  }
}

function update() {
  updatePlayer();
  updatePew($container);
  window.requestAnimationFrame(update);
}

const $container = document.querySelector(".main");
createPlayer($container);

window.addEventListener("keydown", keyPress);
window.addEventListener("keyup", keyRelease);

update();
