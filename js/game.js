/**
 * @author Victor Zegarra
 * @date 18/11/2025
 */

game_scene = new MiScene();

game_scene.preload = function () {
    this.loadImage('bg', 'assets/images/game/bg.png');
    this.loadImage('player', 'assets/images/game/player.png');
    this.loadImage('platform', 'assets/images/game/platform.png');
    this.loadImage('snail', 'assets/images/game/snail.png');
    this.loadImage('gem', 'assets/images/game/gem.png');
}

game_scene.create = function () {
    this.screen = 0;
    this.img_bg = new MiImage(this.getImage('bg'));
    this.add(this.img_bg);

    this.player = new MiSprite(this.getImage('player'), 24, 24);
    this.player.GRAVITY = 2;
    this.player.JUMP_FORCE = -16;
    this.player.SPEED_X = 2.5;
    this.player.setCollider(6, 2, 12, 22);
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

    // this.add(this.player);

    this.SNAIL_WDT = 34;
    this.SNAIL_HGT = 21;
    this.SNAIL_SPEED_X = 1;
    this.SNAIL_ANIM_LEFT = { frames: [0, 1], delay: 2, loop: true };
    this.SNAIL_ANIM_RIGHT = { frames: [2, 3], delay: 2, loop: true };

    this.GEM_WDT = 16;
    this.GEM_HGT = 14;
    this.GEM_ANIM = { frames: [4, 5, 6, 7], delay: 4, loop: true };
    // this.GEM_ANIM = { frames: [0, 1, 2, 3], delay: 4, loop: true };

    this.enemies = [];
    this.items = [];

    this.level = {
        platforms: [
            { x: 0, y: 176, width: 48, height: 20 },
            { x: 80, y: 208, width: 64, height: 48 },
            { x: 176, y: 240, width: 48, height: 20 },
            { x: 144, y: 288, width: 64, height: 20 },
            { x: 80, y: 336, width: 192, height: 20 },
            { x: -16, y: 384, width: 256, height: 20 }
        ],
        enemies: [
            { x: 200, y: 367, dir: DIR_LEFT, x1: 0, x2: GAME_WIDTH - this.SNAIL_WDT },
            { x: 128, y: 319, dir: DIR_RIGHT, x1: 80, x2: GAME_WIDTH - this.SNAIL_WDT }
        ],
        items: [
            { x: 200, y: 224 },
            { x: 150, y: 272 },
            { x: 180, y: 272 }
        ]
    };

    for (let p of this.level.platforms) {
        let spr = new MiSprite(this.getImage('platform'), p.width, p.height);
        spr.position(p.x, p.y);
        p.cy = p.y + 4; // guardar la coordenada y de la plataforma
        this.add(spr);
    }
}

game_scene.player_update = function () {
    this.animate();

    if (this.jumping) {
        this.vy += this.GRAVITY;
        if (this.vy > 9) this.vy = 9;
    }
    this.move(this.vx, this.vy);

    let onPlatform = false;

    for (let p of game_scene.level.platforms) {

        // ¿Está el personaje sobre esta plataforma?
        let isAbovePlatform =
            this.cx + this.cwidth > p.x &&
            this.cx < p.x + p.width &&
            this.cy + this.cheight <= p.cy &&
            this.cy + this.cheight + this.vy >= p.y;

        if (isAbovePlatform) {
            // Detener la caída
            this.jumping = false;
            onPlatform = true;
            this.vy = 0;
            this.y = p.cy - this.height;
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

    // if (this.x < -this.width) {
    //     this.position(GAME_WIDTH, this.y);
    // }
    // if (this.x > GAME_WIDTH) {
    //     this.position(-this.width, this.y);
    // }

    if (this.x < 0) {
        this.position(0, this.y);
        game_scene.turn_right();
    }
    if (this.x > GAME_WIDTH - this.width) {
        this.position(GAME_WIDTH - this.width, this.y);
        game_scene.turn_left();
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
    snail.setCollider(3, 4, 28, 17);
    return snail;
}

game_scene.snail_update = function () {
    this.animate();
    this.move(this.vx, 0);

    if (this.collidesWith(game_scene.player)) {
        // game_scene.start();
    }

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

game_scene.spawn_gem = function (x, y) {
    let gem = new MiSprite(this.getImage('gem'), this.GEM_WDT, this.GEM_HGT);

    gem.position(x, y);
    gem.setAnimation(this.GEM_ANIM);
    gem.setCollider(1, 3, 10, 9);
    gem.update = game_scene.gem_update;

    return gem;
}

game_scene.gem_update = function () {
    this.animate();

    if (this.collidesWith(game_scene.player)) {
        // El jugador recoge la gema
        game_scene.remove(this);
        let index = game_scene.items.indexOf(this);
        if (index > -1) {
            game_scene.items.splice(index, 1);
        }
        if (game_scene.items.length === 0) {
            // Todas las gemas recogidas, reiniciar el nivel
            // game_scene.start();
        }
    }
}

game_scene.start = function () {
    game_scene.state = GAME_IDLE;
    this.remove(this.player);

    for (let enemy of this.enemies) {
        this.remove(enemy);
    }
    this.enemies.length = 0;

    for (let item of this.items) {
        this.remove(item);
    }
    this.items.length = 0;


    this.player.dir = DIR_RIGHT;
    this.player.state = STATE_IDLE;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.jumping = false;
    this.player.position(GAME_WIDTH_HALF - 12, this.level.platforms[0].cy - this.player.height);
    this.player.setAnim(STATE_IDLE | DIR_RIGHT);

    for (let enemy of this.level.enemies) {
        let snail = this.spawn_snail(enemy.x, enemy.y, enemy.dir, enemy.x1, enemy.x2);
        this.add(snail);
        this.enemies.push(snail);
    }

    for (let item of this.level.items) {
        let gem = this.spawn_gem(item.x, item.y);
        this.add(gem);
        this.items.push(gem);
    }

    this.add(this.player);
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
        case "Escape":
            this.start();
            break
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