const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Constants borrowed from Stonk-runner's Trex and Horizon configs.
const GRAVITY = 0.6; // Trex.config.GRAVITY
const JUMP_VELOCITY = -10; // Trex.config.INIITAL_JUMP_VELOCITY
const FRICTION = 0.8;
const GROUND_Y = 127; // HorizonLine.dimensions.YPOS

// Sprite sheet positions (Runner.spriteDefinition.LDPI)
const SPRITES = {
  TREX: { x: 848, y: 2, w: 44, h: 47 },
  HORIZON: { x: 2, y: 54, w: 600, h: 12 },
  STAR: { x: 645, y: 2, w: 9, h: 9 }
};

const spriteSheet = new Image();
spriteSheet.src = 'assets/offline-sprite-1x.png';

const keys = { left: false, right: false, jump: false };

const player = {
  x: 50,
  y: GROUND_Y - SPRITES.TREX.h,
  w: SPRITES.TREX.w,
  h: SPRITES.TREX.h,
  xVel: 0,
  yVel: 0
};

const goal = {
  x: 550,
  y: GROUND_Y - SPRITES.STAR.h,
  w: SPRITES.STAR.w,
  h: SPRITES.STAR.h
};

document.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft') keys.left = true;
  if (e.code === 'ArrowRight') keys.right = true;
  if (e.code === 'Space') keys.jump = true;
});

document.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft') keys.left = false;
  if (e.code === 'ArrowRight') keys.right = false;
  if (e.code === 'Space') keys.jump = false;
});

function update() {
  if (keys.left) player.xVel = -3;
  if (keys.right) player.xVel = 3;
  player.x += player.xVel;
  player.xVel *= FRICTION;

  player.yVel += GRAVITY;
  player.y += player.yVel;

  if (player.y + player.h >= GROUND_Y) {
    player.y = GROUND_Y - player.h;
    player.yVel = 0;
    if (keys.jump) player.yVel = JUMP_VELOCITY;
  }

  if (player.x < goal.x + goal.w &&
      player.x + player.w > goal.x &&
      player.y < goal.y + goal.h &&
      player.y + player.h > goal.y) {
    alert('You win!');
    reset();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Ground
  ctx.drawImage(spriteSheet,
    SPRITES.HORIZON.x, SPRITES.HORIZON.y, SPRITES.HORIZON.w, SPRITES.HORIZON.h,
    0, GROUND_Y, SPRITES.HORIZON.w, SPRITES.HORIZON.h);
  // Goal
  ctx.drawImage(spriteSheet,
    SPRITES.STAR.x, SPRITES.STAR.y, SPRITES.STAR.w, SPRITES.STAR.h,
    goal.x, goal.y, goal.w, goal.h);
  // Player
  ctx.drawImage(spriteSheet,
    SPRITES.TREX.x, SPRITES.TREX.y, SPRITES.TREX.w, SPRITES.TREX.h,
    player.x, player.y, player.w, player.h);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function reset() {
  player.x = 50;
  player.y = GROUND_Y - SPRITES.TREX.h;
  player.xVel = 0;
  player.yVel = 0;
}

spriteSheet.onload = loop;
