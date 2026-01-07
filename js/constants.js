
Constants = {};
    Constants.SNAIL_WDT = 34;
    Constants.SNAIL_HGT = 22;

    Constants.LEVELS = [
    {
        platforms: [
            { x: 24, y: 32, width: 48, height: 20 },
            { x: 80, y: 160, width: 64, height: 20 },
            { x: 0, y: 176, width: 48, height: 20 },
            { x: 80, y: 208, width: 64, height: 48 },
            { x: 176, y: 240, width: 48, height: 20 },
            { x: 144, y: 288, width: 64, height: 20 },
            { x: -16, y: 384, width: 128, height: 20 },
            { x: 156, y: 384, width: 128, height: 20 }
        ],
        carriers: [
            { x: 80, y: 64, width: 64, height: 20, speed_x: 1, speed_y: 0, x1: 0, x2: GAME_WIDTH - 64, y1: 100, y2: 210 },
            { x: 176, y: 100, width: 48, height: 20, speed_x: 0, speed_y: 1, x1: 0, x2: GAME_WIDTH - 64, y1: 100, y2: 210 }
        ],
        enemies: [
            { x: 200, y: 367, dir: DIR_LEFT, x1: 0, x2: GAME_WIDTH - this.SNAIL_WDT },
            { x: 128, y: 319, dir: DIR_RIGHT, x1: 80, x2: GAME_WIDTH - this.SNAIL_WDT }
        ],
        items: [
            { x: 200, y: 224 },
            { x: 150, y: 272 },      


            { x: 180, y: 272 }
        ],
        player: { x: 24, y: 200 }
    },
    {
        platforms: [
            { x: 24, y: 32, width: 48, height: 20 },
            { x: 80, y: 160, width: 64, height: 20 },
            { x: 0, y: 176, width: 48, height: 20 },
            { x: 80, y: 208, width: 64, height: 48 },
            { x: 176, y: 240, width: 48, height: 20 },
            { x: 144, y: 288, width: 64, height: 20 },
            { x: 144, y: 332, width: 64, height: 20 },
            { x: -16, y: 384, width: 256, height: 20 }
        ],
        carriers: [
            { x: 80, y: 64, width: 64, height: 20, speed_x: 1, speed_y: 0, x1: 0, x2: GAME_WIDTH - 64, y1: 100, y2: 210 },
            { x: 176, y: 100, width: 48, height: 20, speed_x: 0, speed_y: 1, x1: 0, x2: GAME_WIDTH - 64, y1: 100, y2: 210 }
        ],
        enemies: [
            { x: 200, y: 367, dir: DIR_LEFT, x1: 0, x2: GAME_WIDTH - this.SNAIL_WDT },
            { x: 128, y: 319, dir: DIR_RIGHT, x1: 80, x2:   - this.SNAIL_WDT }
        ],
        items: [
            { x: 200, y: 224 },
            { x: 150, y: 272 },
            { x: 180, y: 272 }
        ],
        player: { x: 24, y: 200 }
    }
  ]
