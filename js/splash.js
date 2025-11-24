/**
 * @author Victor Zegarra
 * @date 28/03/2025
 */

splash_scene = new MiScene();

splash_scene.preload = function () {
    this.addImage('bg1', 'assets/images/splash/bg1.png');
    this.addImage('bg2', 'assets/images/splash/bg2.png');
    this.addImage('bg3', 'assets/images/splash/bg3.png');
    this.addImage('bg4', 'assets/images/splash/bg4.png');
    this.addImage('bg5', 'assets/images/splash/bg5.png');
    this.addImage('creaturas', 'assets/images/splash/creaturas.png');
    this.addImage('key_click', 'assets/images/splash/key_click.png');
}

splash_scene.create = function () {
    screen = 0;
    img_bg = new MiImage(this.getImage('bg1'));
    this.add(img_bg);

    // txt_key = new MiText("24px Arial");
    // txt_key.position(20,50);
    // txt_key.text = "Hola"
    // txt_key.style = 'white';
    // this.add(txt_key);

    CREATURAS_LEFT = [0, 1];
    CREATURAS_RIGHT = [2, 3];
    CREATURAS_VX = 4;

    spr_creaturas = new MiSprite(this.getImage('creaturas'), 252, 78);
    spr_creaturas.position(GAME_WIDTH, 30);
    spr_creaturas.vx = CREATURAS_VX;
    spr_creaturas.isVisible = false;
    spr_creaturas.update = function () {
        this.animate();
        this.move(this.vx, this.vy);

        if (this.vx < 0 && this.x <= -this.width) {
            this.setAnimation({ frames: CREATURAS_RIGHT, delay: 0, loop: true });
            this.vx = CREATURAS_VX;
        } if (this.vx > 0 && this.x >= GAME_WIDTH) {
            this.setAnimation({ frames: CREATURAS_LEFT, delay: 0, loop: true });
            this.vx = -CREATURAS_VX;
        }
    }
    this.add(spr_creaturas);

    spr_key_click = new MiSprite(this.getImage('key_click'), 160, 17);
    spr_key_click.centerX = true;
    spr_key_click.position(GAME_WIDTH_HALF, GAME_HEIGHT - 25);
    spr_key_click.setAnimation({ frames: [0, -1], delay: 8, loop: true });
    spr_key_click.update = function () {
        this.animate();
    }
    this.add(spr_key_click);
}

splash_scene.keyDown = function (event) {
    // txt_key.text = event.key + " " + event.code;
    next_screen();
}

splash_scene.touchDown = function (x, y) {
    next_screen();
}

next_screen = function () {
    screen++;
    switch (screen) {
        case 1:
            console.log("bg2");
            img_bg.setImage(splash_scene.getImage('bg2'));
            spr_creaturas.isVisible = true;
            bg_music.volume = 0.1;
            bg_music.play();
            break;
        case 2:
            console.log("bg3");
            img_bg.setImage(splash_scene.getImage('bg3'));
            spr_creaturas.isVisible = false;
            break;
        case 3:
            console.log("bg4");
            img_bg.setImage(splash_scene.getImage('bg4'));
            break;
        case 4:
            console.log("bg5");
            img_bg.setImage(splash_scene.getImage('bg5'));
            break;
        case 5:
            bg_music.pause();
            bg_music.currentTime = 0;
            game.startScene('game');
            break;
    }
}