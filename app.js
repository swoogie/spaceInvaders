const keyRight = 68;
const keyLeft = 65;
const keySpace = 32;

const gameWidth = document.querySelector(".main").clientWidth;
const gameHeight = document.querySelector(".main").clientHeight;

const state = {
  x: 0,
  y: 0,
  moveRight: false,
  moveLeft: false,
  shoot: false,
  alienPewPew: [],
  pewpew: [],
  cooldown: 0,
  spaceshipW: 50,
  aliens: [],
  alienW: 60,
  alienNum: 24,
  gameOver: false,
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

function createalienPew($container, x, y) {
  const $alienPew = document.createElement("img");
  $alienPew.src = "assets/redpew.png";
  $alienPew.className = "pew";
  $container.appendChild($alienPew);
  const alienPew = { x, y, $alienPew };
  state.alienPewPew.push(alienPew);
  setPosition($alienPew, x, y);
}

function deletePew(pewpew, pew, $pew) {
  const index = pewpew.indexOf(pew);
  pewpew.splice(index, 1);
  $container.removeChild($pew);
}

function collision(rect1, rect2) {
  return !(
    rect2.left > rect1.right ||
    rect2.right < rect1.left ||
    rect2.top > rect1.bottom ||
    rect2.bottom < rect1.top
  );
}

function updatePew() {
  const pewpew = state.pewpew;
  for (let i = 0; i < pewpew.length; i++) {
    const pew = pewpew[i];
    pew.y -= 1.5;
    if (pew.y < 0) {
      deletePew(pewpew, pew, pew.$pew);
    }
    setPosition(pew.$pew, pew.x, pew.y);
    const pewRect = pew.$pew.getBoundingClientRect();
    const aliens = state.aliens;
    for (let j = 0; j < aliens.length; j++) {
      const enemy = aliens[j];
      const enemyRect = enemy.$enemy.getBoundingClientRect();
      if (collision(enemyRect, pewRect)) {
        deletePew(pewpew, pew, pew.$pew);
        const index = aliens.indexOf(enemy);
        aliens.splice(index, 1);
        $container.removeChild(enemy.$enemy);
      }
    }
  }
}

function updatealienPew() {
  const alienPewPew = state.alienPewPew;
  for (let i = 0; i < alienPewPew.length; i++) {
    const alienPew = alienPewPew[i];
    alienPew.y += 1.5;
    if (alienPew.y > gameHeight - 30) {
      deletePew(alienPewPew, alienPew, alienPew.$alienPew);
    }
    const alienPewRect = alienPew.$alienPew.getBoundingClientRect();
    const spaceshipRect = document
      .querySelector(".player")
      .getBoundingClientRect();
    if (collision(spaceshipRect, alienPewRect)) {
      state.gameOver = true;
    }

    setPosition(
      alienPew.$alienPew,
      alienPew.x + state.alienW / 2,
      alienPew.y + 15
    );
  }
}

function updatePlayer() {
  if (state.moveLeft) {
    state.x -= 3;
  }
  if (state.moveRight) {
    state.x += 3;
  }
  if (state.shoot && state.cooldown == 0) {
    createPew($container, state.x - state.spaceshipW / 2, state.y);
    state.cooldown = 30;
  }
  const $player = document.querySelector(".player");
  setPosition($player, bound(state.x), state.y);
  if (state.cooldown > 0) {
    state.cooldown -= 0.5;
  }
}

function createAlien($container, x, y) {
  const $enemy = document.createElement("img");
  $enemy.src = "assets/alien.png";
  $enemy.className = "enemy";
  $container.appendChild($enemy);
  const cooldown = Math.floor(Math.random() * 100);
  const enemy = { x, y, $enemy, cooldown };
  state.aliens.push(enemy);
  setSize($enemy, state.alienW);
  setPosition($enemy, x, y);
}

function updateAlien($container) {
  const dx = Math.sin(Date.now() / 900) * 90 + 100;
  const aliens = state.aliens;
  for (let i = 0; i < aliens.length; i++) {
    const enemy = aliens[i];
    let a = enemy.x + dx;
    let b = enemy.y - 50;
    setPosition(enemy.$enemy, a, b);
    if (enemy.cooldown == 0) {
      createalienPew($container, a, b);
      enemy.cooldown = Math.floor(Math.random() * 50) + 100;
    }
    enemy.cooldown -= 0.25;
  }
}

function createaliens($container) {
  for (let i = 0; i <= state.alienNum / 3; i++) {
    createAlien($container, i * 80, 100);
  }
  for (let i = 0; i <= state.alienNum / 3; i++) {
    createAlien($container, i * 80, 180);
  }
  for (let i = 0; i <= state.alienNum / 3; i++) {
    createAlien($container, i * 80, 260);
  }
}

let reqID;

function update() {
  updatePlayer();
  updatePew();
  updateAlien($container);
  updatealienPew();

  window.requestAnimationFrame(update);

  if(state.gameOver) {
      document.querySelector(".lose").style = "Display: block;";
  } else if (state.aliens.length == 0){
    document.querySelector(".win").style = "Display: block;";
  }
}

const $container = document.querySelector(".main");
createPlayer($container);
createaliens($container);

window.addEventListener("keydown", () => {
  if(!state.gameOver){
    if (event.keyCode === keyRight) {
      state.moveRight = true;
    } else if (event.keyCode === keyLeft) {
      state.moveLeft = true;
    } else if (event.keyCode === keySpace) {
      state.shoot = true;
    }
  } else {
    state.moveRight = false;
    state.moveLeft = false;
    state.shoot = false;
  }
    
});

window.addEventListener("keyup", () => {
    if (event.keyCode === keyRight) {
      state.moveRight = false;
    } else if (event.keyCode === keyLeft) {
      state.moveLeft = false;
    } else if (event.keyCode === keySpace) {
      state.shoot = false;
    }
});

update();


