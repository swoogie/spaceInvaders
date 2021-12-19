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
  cooldown: 0,
  spaceshipW: 50,
  enemies: [],
  enemyW: 60,
  enemyNum: 12
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

function deletePew(pewpew, pew, $pew){
    const index = pewpew.indexOf(pew);
    pewpew.splice(index, 1);
    $container.removeChild($pew);
}

function updatePew() {
  const pewpew = state.pewpew;
  for (let i = 0; i < pewpew.length; i++) {
    const pew = pewpew[i];
    pew.y -= 2;
    if(pew.y < 0) {
        deletePew(pewpew, pew, pew.$pew);
    }
    setPosition(pew.$pew, pew.x, pew.y);
  }
}

function updatePlayer() {
  if (state.moveLeft) {
    state.x -= 3;
  } if (state.moveRight) {
    state.x += 3;
  } if (state.shoot && state.cooldown == 0) {
    createPew($container, state.x - state.spaceshipW / 2, state.y);
    state.cooldown = 30;
  }
  const $player = document.querySelector(".player");
  setPosition($player, bound(state.x), state.y);
  if(state.cooldown > 0){
      state.cooldown -= 0.5;
  }
}

function createEnemy($container, x, y) {
    const $enemy = document.createElement("img");
    $enemy.src = "assets/alien.png";
    $enemy.className = "enemy";
    $container.appendChild($enemy);
    const enemy = {x, y, $enemy};
    state.enemies.push(enemy);
    setSize($enemy, state.enemyW);
    setPosition($enemy, x, y);
}

function updateEnemy() {
    const dx = Math.sin(Date.now()/1000)*50+80;
    const enemies = state.enemies;
    for(let i = 0; i<enemies.length; i++) {
        const enemy = enemies[i];
        var a = enemy.x + dx;
        var b = enemy.y-50;
        setPosition(enemy.$enemy, a, b);
    }
}

function createEnemies($container){
    for(let i = 0; i <= state.enemyNum/2; i++) {
        createEnemy($container, i*80, 100);
    }
    for(let i = 0; i <= state.enemyNum/2; i++) {
        createEnemy($container, i*80, 180);
    }
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
  updatePew();
  updateEnemy();

  window.requestAnimationFrame(update);
}

const $container = document.querySelector(".main");
createPlayer($container);
createEnemies($container);

window.addEventListener("keydown", keyPress);
window.addEventListener("keyup", keyRelease);

update();
