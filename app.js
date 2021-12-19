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
  enemyPewPew: [],
  pewpew: [],
  cooldown: 0,
  spaceshipW: 50,
  enemies: [],
  enemyW: 60,
  enemyNum: 18,
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

function createEnemyPew($container, x, y) {
    const $enemyPew = document.createElement("img");
    $enemyPew.src = "assets/redpew.png";
    $enemyPew.className = "pew";
    $container.appendChild($enemyPew);
    const enemyPew = { x, y, $enemyPew };
    state.enemyPewPew.push(enemyPew);
    setPosition($enemyPew, x, y);
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
    pew.y -= 2;
    if (pew.y < 0) {
      deletePew(pewpew, pew, pew.$pew);
    }
    setPosition(pew.$pew, pew.x, pew.y);
    const pewRect = pew.$pew.getBoundingClientRect();
    const enemies = state.enemies;
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
      const enemyRect = enemy.$enemy.getBoundingClientRect();
      if (collision(enemyRect, pewRect)) {
        deletePew(pewpew, pew, pew.$pew);
        const index = enemies.indexOf(enemy);
        enemies.splice(index, 1);
        $container.removeChild(enemy.$enemy);
      }
    }
  }
}

function updateEnemyPew() {
    const enemyPewPew = state.enemyPewPew;
    for(let i = 0; i < enemyPewPew.length; i++) {
        const enemyPew = enemyPewPew[i];
        enemyPew.y += 2;
        if(enemyPew.y > gameHeight-30){
            deletePew(enemyPewPew, enemyPew, enemyPew.$enemyPew);
        }
        const enemyPewRect = enemyPew.$enemyPew.getBoundingClientRect()
        const spaceshipRect = document.querySelector(".player").getBoundingClientRect();
        if(collision(spaceshipRect, enemyPewRect)){
            console.log("Game over");
        }
        setPosition(enemyPew.$enemyPew, enemyPew.x + state.enemyW/2, enemyPew.y+15);
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

function createEnemy($container, x, y) {
  const $enemy = document.createElement("img");
  $enemy.src = "assets/alien.png";
  $enemy.className = "enemy";
  $container.appendChild($enemy);
  const cooldown = Math.floor(Math.random()*100);
  const enemy = { x, y, $enemy, cooldown };
  state.enemies.push(enemy);
  setSize($enemy, state.enemyW);
  setPosition($enemy, x, y);
}

function updateEnemy($container) {
  const dx = Math.sin(Date.now() / 1000) * 90 + 80;
  const enemies = state.enemies;
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    var a = enemy.x + dx;
    var b = enemy.y - 50;
    setPosition(enemy.$enemy, a, b);
    if(enemy.cooldown == 0) {
        createEnemyPew($container, a, b);
        enemy.cooldown = Math.floor(Math.random()*50)+100;
    }
    enemy.cooldown -= 0.25;
  }
}

function createEnemies($container) {
  for (let i = 0; i <= state.enemyNum / 3; i++) {
    createEnemy($container, i * 80, 100);
  }
  for (let i = 0; i <= state.enemyNum / 3; i++) {
    createEnemy($container, i * 80, 180);
  }
  for (let i = 0; i <= state.enemyNum / 3; i++) {
    createEnemy($container, i * 80, 260);
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
  updateEnemy($container);
  updateEnemyPew();

  window.requestAnimationFrame(update);
}

const $container = document.querySelector(".main");
createPlayer($container);
createEnemies($container);


window.addEventListener("keydown", keyPress);
window.addEventListener("keyup", keyRelease);

update();
