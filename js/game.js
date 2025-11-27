/**
 * @author Victor Zegarra
 * @date 18/11/2025
 */

game_scene = new MiScene();

game_scene.preload = function () {
    this.loadImage('bg', 'assets/images/game/bg.png');
    this.loadImage('player', 'assets/images/game/player.png');
    this.loadImage('plat3', 'assets/images/game/platform.png');
    this.loadImage('snail', 'assets/images/game/snail.png');
}

game_scene.create = function () {
    this.screen = 0;
    this.img_bg = new MiImage(this.getImage('bg'));
    this.add(this.img_bg);

    this.platforms = [
        { x: 80, y: 208, width: 64, height: 48 },
        { x: 176, y: 240, width: 48, height: 16 },
        { x: 144, y: 288, width: 64, height: 16 },
        { x: 80, y: 336, width: 192, height: 16 },
        { x: -16, y: 384, width: 256, height: 16 }
    ];

    for (let p of this.platforms) {
        let spr = new MiSprite(this.getImage('plat3'), p.width, p.height);
        spr.position(p.x, p.y);
        this.add(spr);
    }

    this.player = new MiSprite(this.getImage('player'), 24, 24);
    this.player.GRAVITY = 2;
    this.player.JUMP_FORCE = -16;
    this.player.SPEED_X = 3;
    this.player.update = this.player_update;

    this.player.anims = {};
    this.player.anims[STATE_IDLE | DIR_LEFT] = { frames: [0, 1], delay: 8, loop: true };
    this.player.anims[STATE_IDLE | DIR_RIGHT] = { frames: [2, 3], delay: 8, loop: true };
    this.player.anims[STATE_RUNNING | DIR_LEFT] = { frames: [4, 5], delay: 1, loop: true };
    this.player.anims[STATE_RUNNING | DIR_RIGHT] = { frames: [6, 7], delay: 1, loop: true };
    this.player.anims[STATE_JUMPING | DIR_LEFT] = { frames: [4], delay: 0, loop: false };
    this.player.anims[STATE_JUMPING | DIR_RIGHT] = { frames: [6], delay: 0, loop: false };

    this.player.setAnim = function (id) {
        this.setAnimation(this.anims[id]);
    }

    this.add(this.player);

    // this.enemies = [];

    this.SNAIL_WDT = 34;
    this.SNAIL_HGT = 21;
    this.SNAIL_SPEED_X = 1;
    this.SNAIL_ANIM_LEFT = { frames: [0, 1], delay: 2, loop: true };
    this.SNAIL_ANIM_RIGHT = { frames: [2, 3], delay: 2, loop: true };
}

game_scene.player_update = function () {
    this.animate();

    if (this.jumping) {
        this.vy += this.GRAVITY;
        if (this.vy > 9) this.vy = 9;
    }
    this.move(this.vx, this.vy);

    let onPlatform = false;

    for (let p of game_scene.platforms) {

        // ¿Está el personaje sobre esta plataforma?
        let isAbovePlatform =
            this.x + this.width > p.x &&
            this.x < p.x + p.width &&
            this.y + this.height <= p.y &&
            this.y + this.height + this.vy >= p.y;

        if (isAbovePlatform) {
            // Detener la caída
            this.jumping = false;
            onPlatform = true;
            this.vy = 0;
            this.y = p.y - this.height;
            this.position(this.x, this.y);
            if (this.state === STATE_JUMPING) {
                this.state = STATE_RUNNING;
                this.setAnim(this.state | this.dir);
            }
            break;
        }
    }

    // Si no está sobre ninguna plataforma, sigue cayendo
    if (!onPlatform) {
        this.jumping = true;
        if (this.state !== STATE_JUMPING) {
            this.state = STATE_JUMPING;
            this.setAnim(this.state | this.dir);
        }
    }

    if (this.x < -this.width) {
        this.position(GAME_WIDTH, this.y);
    }
    if (this.x > GAME_WIDTH) {
        this.position(-this.width, this.y);
    }
}

game_scene.spawn_snail = function (x, y, dir, x1, x2) {
    let snail = new MiSprite(this.getImage('snail'), this.SNAIL_WDT, this.SNAIL_HGT);

    snail.position(x, y);
    snail.bounds = { x1: x1, x2: x2, y1: 0, y2: 0 };
    snail.update = game_scene.snail_update;

    if (dir === DIR_LEFT) {
        snail.vx = -this.SNAIL_SPEED_X;
        snail.setAnimation(this.SNAIL_ANIM_LEFT);
        snail.direction = DIR_LEFT;
    } else {
        snail.vx = this.SNAIL_SPEED_X;
        snail.setAnimation(this.SNAIL_ANIM_RIGHT);
        snail.direction = DIR_RIGHT;
    }
    return snail;
}

game_scene.snail_update = function () {
    this.animate();
    this.move(this.vx, 0);

    if (this.x < this.bounds.x1) {
        this.vx = game_scene.SNAIL_SPEED_X;
        this.direction = DIR_RIGHT;
        this.setAnimation(game_scene.SNAIL_ANIM_RIGHT);
    } else if (this.x > this.bounds.x2) {
        this.vx = -game_scene.SNAIL_SPEED_X;
        this.direction = DIR_LEFT;
        this.setAnimation(game_scene.SNAIL_ANIM_LEFT);
    }
}

game_scene.start = function () {
    game_scene.state = GAME_IDLE;
    this.player.dir = DIR_RIGHT;
    this.player.state = STATE_IDLE;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.jumping = false;
    this.player.position(GAME_WIDTH_HALF - 12, this.platforms[0].y - this.player.height);
    this.player.setAnim(STATE_IDLE | DIR_RIGHT);

    let snail1 = this.spawn_snail(200, 363, DIR_LEFT, 0, GAME_WIDTH - this.SNAIL_WDT);
    this.add(snail1);
}

game_scene.keyDown = function (event) {
    // console.log(event.key + " " + event.code);
    switch (event.code) {
        case "KeyA":
        case "ArrowLeft":
            this.turn_left();
            break;
        case "KeyD":
        case "ArrowRight":
            this.turn_right();
            break;
        case "KeyW":
        case "ArrowUp":
        case "Space":
            this.jump();
            break;
        // case "ArrowDown":
        //     this.idle();
        //     break;
    }
}

game_scene.touchStart = function (x, y) {
    this.startX = x;
    this.startY = y;
}

game_scene.touchEnd = function (x, y) {
    const SWIPE_THRESHOLD = 10; // píxeles mínimos para considerar swipe
    // this.touching = false;
    const dx = x - this.startX;
    const dy = y - this.startY;

    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
        this.jump();
        return;
    }

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= SWIPE_THRESHOLD) {
        // Horizontal swipe
        if (dx < 0) {
            this.turn_left();
        } else {
            this.turn_right();
        }
    }
    // Consider it a tap

    // if (x === game_scene.startX && y === game_scene.startY) {
    //     this.jump();
    // } else {
    //     let difX = x - game_scene.startX;
    //     if (difX < 0) {
    //         this.turn_left();
    //     } else {
    //         this.turn_right();
    //     }
    // }
}

game_scene.turn_left = function () {
    if (this.player.state !== STATE_JUMPING) {
        this.player.state = STATE_RUNNING;
    }
    this.player.dir = DIR_LEFT;
    this.player.vx = -this.player.SPEED_X;
    this.player.setAnim(this.player.state | DIR_LEFT);
}

game_scene.turn_right = function () {
    if (this.player.state !== STATE_JUMPING) {
        this.player.state = STATE_RUNNING;
    }
    this.player.dir = DIR_RIGHT;
    this.player.vx = this.player.SPEED_X;
    this.player.setAnim(this.player.state | DIR_RIGHT);
}

game_scene.jump = function () {
    if (!this.player.jumping) {
        this.player.state = STATE_JUMPING;
        this.player.jumping = true;
        this.player.vy = this.player.JUMP_FORCE;
        this.player.vx = this.player.dir === DIR_LEFT ? -this.player.SPEED_X : this.player.SPEED_X;
        this.player.setAnim(STATE_JUMPING | this.player.dir);
    }
}

game_scene.idle = function () {
    this.player.vx = 0;
    this.player.state = STATE_IDLE;
    this.player.setAnim(STATE_IDLE | this.player.dir);
}    