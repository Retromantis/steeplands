/**
 * @author Victor Zegarra
 * @date 18/11/2025
 */

game_scene = new MiScene();

game_scene.preload = function () {
    this.addImage('bg', 'assets/images/game/bg.png');
    this.addImage('player', 'assets/images/game/player.png');
    this.addImage('plat3', 'assets/images/game/plat3.png');
}

game_scene.create = function () {
    this.screen = 0;
    this.img_bg = new MiImage(this.getImage('bg'));
    this.add(this.img_bg);

    this.anims = {};
    this.anims[STATE_IDLE | DIR_LEFT] = { frames: [0, 1], delay: 8, loop: true };
    this.anims[STATE_IDLE | DIR_RIGHT] = { frames: [2, 3], delay: 8, loop: true };
    this.anims[STATE_RUNNING | DIR_LEFT] = { frames: [4, 5], delay: 1, loop: true };
    this.anims[STATE_RUNNING | DIR_RIGHT] = { frames: [6, 7], delay: 1, loop: true };

    this.player = new MiSprite(this.getImage('player'), 48, 48);
    this.player.speed = 200;
    this.player.speedX = 4;
    // this.player.vx = CREATURAS_VX;
    // this.player.isVisible = false;
    this.player.update = function () {
        this.animate();
        this.move(this.vx, 0);

        if (this.x < -this.width) {
            this.position(GAME_WIDTH, this.y);
        }
        if (this.x > GAME_WIDTH) {
            this.position(-this.width, this.y);
        }
    }
    this.add(this.player);

    this.platforms = [
        { x: 148, y: 430, width: 64, height: 10 },
        { x: 76, y: 530, width: 192, height: 10 },
        { x: -12, y: 630, width: 384, height: 10 }
    ];

    for (let p of this.platforms) {
        let spr = new MiSprite(this.getImage('plat3'), p.width, p.height);
        spr.position(p.x, p.y);
        this.add(spr);
    }
}

game_scene.start = function () {
    this.player.dir = DIR_LEFT;
    this.player.state = STATE_IDLE;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.gravity = 0.8;
    this.player.jumpForce = -16;
    this.player.jumping = false;
    this.player.position(GAME_WIDTH_HALF, this.platforms[1].y - this.player.height);
    this.player.setAnimation(this.anims[STATE_IDLE | DIR_LEFT]);
}

game_scene.keyDown = function (event) {
    // console.log(event.key + " " + event.code);
    switch (event.code) {
        case "ArrowLeft":
            this.running_left();
            break;
        case "ArrowRight":
            this.running_right();
            break;
        case "Space":
            this.jump();
            break;
    }
}

// game_scene.keyUp = function (event) {
//     // console.log(event.key + " " + event.code);
//     switch (event.code) {
//         case "ArrowLeft":
//             this.running_left();
//             break;
//         case "ArrowRight":
//             this.running_right();
//             break;
//         case "Space":
//             this.jump();
//             break;
//     }
// }

// game_scene.touchDown = function (x, y) {
//     console.log("Game Scene touched at: " + x + ", " + y);
// }

game_scene.running_left = function () {
    this.player.dir = DIR_LEFT;
    this.player.state = STATE_RUNNING;
    this.player.vx = -this.player.speedX;
    this.player.setAnimation(this.anims[STATE_RUNNING | DIR_LEFT]);
}

game_scene.running_right = function () {
    this.player.dir = DIR_RIGHT;
    this.player.state = STATE_RUNNING;
    this.player.vx = this.player.speedX;
    this.player.setAnimation(this.anims[STATE_RUNNING | DIR_RIGHT]);
}

game_scene.jump = function () {
    if (!this.player.jumping) {
        this.player.jumping = true;
        this.player.vy = this.player.jumpForce;
    }
}

game_scene.update = function () {
    this.$update();
    if (this.player.jumping) {
        this.player.vy += this.player.gravity;
        this.player.y += this.player.vy;
        this.player.position(this.player.x, this.player.y);
        // console.log("Jumping Vy: " + this.player.vy)
    }

    let onPlatform = false;

    for (let p of this.platforms) {

        // ¿Está el personaje sobre esta plataforma?
        let isAbovePlatform =
            this.player.x + this.player.width > p.x &&
            this.player.x < p.x + p.width &&
            this.player.y + this.player.height <= p.y &&
            this.player.y + this.player.height + this.player.vy >= p.y;

        if (isAbovePlatform) {
            // Detener la caída
            this.player.jumping = false;
            onPlatform = true;
            this.player.vy = 0;
            this.player.y = p.y - this.player.height;
            this.player.position(this.player.x, this.player.y);
            break;
        }
    }

    // Si no está sobre ninguna plataforma, sigue cayendo
    if (!onPlatform) {
        this.player.jumping = true;
    }
}