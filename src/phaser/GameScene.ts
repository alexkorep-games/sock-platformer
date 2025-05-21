export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("GameScene");
  }

  preload() {
    const base = "levels/level01/simplified/AutoLayer/";

    // 1. The full merged image
    this.load.image("lvl_comp", base + "_composite.png");

    // 2. (Optional) individual layers
    this.load.image("lvl_bg", base + "_bg.png");
    this.load.image("lvl_tiles", base + "AutoLayer.png");

    // 3. IntGrid visuals (for debug, optional)
    this.load.image("lvl_int", base + "IntGrid_layer-int.png");

    // 4. Entities + metadata
    this.load.json("lvl_data", base + "data.json");

    // 5. IntGrid CSV for collisions
    this.load.text("lvl_csv", base + "IntGrid_layer.csv");

    this.load.spritesheet("sock", "assets/sock.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    //–– Draw your level––//

    // A) Just the composite:
    this.add.image(0, 0, "lvl_comp").setOrigin(0);

    // —or— assemble per-layer:
    // this.add.image(0, 0, 'lvl_bg').setOrigin(0);
    // this.add.image(0, 0, 'lvl_tiles').setOrigin(0);

    //–– Spawn Entities from data.json––//

    const meta = this.cache.json.get("lvl_data");
    meta.entities.forEach((ent: { px: number[]; __identifier: string; }) => {
      // ent.__identifier is your LDtk entity name
      // ent.px = [x, y] in pixels
      const spr = this.physics.add.sprite(
        ent.px[0],
        ent.px[1],
        ent.__identifier
      );
      // …configure animations, collisions, etc…
    });

    // Player
    this.player = this.physics.add.sprite(100, 450, "sock");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    // If world bounds are not set by game config, set them explicitly
    // this.physics.world.setBounds(0, 0, 800, 600);

    //–– Build collision solids from IntGrid CSV––//

    const raw = this.cache.text.get("lvl_csv").trim();
    const rows = raw.split(/\r?\n/).map((line: string) => line.split(",").map(Number));

    // **Replace** `tileSize` with your LDtk grid size (e.g. 16, 32…)
    const tileSize = 32;

    rows.forEach((row: number[], y: number) => {
      row.forEach((cell: number, x: number) => {
        if (cell !== 0) {
          // create a static physics body per non-zero cell
          const block = this.add.rectangle(
            x * tileSize + tileSize / 2,
            y * tileSize + tileSize / 2,
            tileSize,
            tileSize
          );
          this.physics.add.existing(block, true);
          // e.g. collide with your player:
          this.physics.add.collider(this.player, block);
        }
      });
    });
  }
}

// import Phaser from "phaser";

// export class GameScene extends Phaser.Scene {
//   private player!: Phaser.Physics.Arcade.Sprite;
//   private stars!: Phaser.Physics.Arcade.Group;
//   private platforms!: Phaser.Physics.Arcade.StaticGroup;
//   private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
//   private scoreText!: Phaser.GameObjects.Text;
//   private score: number = 0;
//   private gameOver: boolean = false;

//   constructor() {
//     super({ key: "GameScene" });
//   }

//   preload() {
//     this.load.image("sky", "assets/sky.png");
//     this.load.image("ground", "assets/platform.png");
//     this.load.image("star", "assets/star.png");
//     // If you have a bomb asset:
//     // this.load.image('bomb', 'assets/bomb.png');
//     this.load.spritesheet("sock", "assets/sock.png", {
//       frameWidth: 32,
//       frameHeight: 48,
//     });
//   }

//   create() {
//     // Background
//     this.add.image(400, 300, "sky");

//     // Platforms
//     this.platforms = this.physics.add.staticGroup();
//     this.platforms.create(400, 568, "ground").setScale(2).refreshBody(); // Ground
//     this.platforms.create(600, 400, "ground");
//     this.platforms.create(50, 250, "ground");
//     this.platforms.create(750, 220, "ground");

//     // Player
//     this.player = this.physics.add.sprite(100, 450, "sock");
//     this.player.setBounce(0.2);
//     this.player.setCollideWorldBounds(true);
//     // If world bounds are not set by game config, set them explicitly
//     // this.physics.world.setBounds(0, 0, 800, 600);

//     // Player Animations
//     this.anims.create({
//       key: "left",
//       frames: this.anims.generateFrameNumbers("sock", { start: 0, end: 3 }),
//       frameRate: 10,
//       repeat: -1,
//     });
//     this.anims.create({
//       key: "turn",
//       frames: [{ key: "sock", frame: 4 }],
//       frameRate: 20,
//     });
//     this.anims.create({
//       key: "right",
//       frames: this.anims.generateFrameNumbers("sock", { start: 5, end: 8 }),
//       frameRate: 10,
//       repeat: -1,
//     });

//     // Input
//     if (this.input.keyboard) {
//       this.cursors = this.input.keyboard.createCursorKeys();
//     }

//     // Stars
//     this.stars = this.physics.add.group({
//       key: "star",
//       repeat: 11,
//       setXY: { x: 12, y: 0, stepX: 70 },
//     });
//     this.stars.children.iterate((child) => {
//       const starChild = child as Phaser.Physics.Arcade.Sprite;
//       starChild.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
//       return true; // Pylint expects a return from iterate
//     });

//     // Score Text
//     this.scoreText = this.add.text(16, 16, "Score: 0", {
//       fontSize: "32px",
//       color: "#000",
//     });

//     // Colliders
//     this.physics.add.collider(this.player, this.platforms);
//     this.physics.add.collider(this.stars, this.platforms);
//     this.physics.add.overlap(
//       this.player,
//       this.stars,
//       this.collectStar,
//       undefined,
//       this
//     );

//     // Simple game over text, initially invisible
//     const gameOverText = this.add
//       .text(400, 300, "Game Over", { fontSize: "64px", color: "#ff0000" })
//       .setOrigin(0.5)
//       .setVisible(false);

//     // Example of adding bombs (optional, requires 'bomb' asset)
//     /*
//         const bombs = this.physics.add.group();
//         this.physics.add.collider(bombs, this.platforms);
//         this.physics.add.collider(this.player, bombs, () => {
//             this.physics.pause();
//             this.player.setTint(0xff0000);
//             this.player.anims.play('turn');
//             this.gameOver = true;
//             gameOverText.setVisible(true);
//         }, undefined, this);

//         const spawnBomb = () => {
//             if (this.gameOver) return;
//             const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
//             const bomb = bombs.create(x, 16, 'bomb');
//             bomb.setBounce(1);
//             bomb.setCollideWorldBounds(true);
//             bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
//         }
//         // Call spawnBomb when all stars are collected or periodically
//         */
//   }

//   update() {
//     if (this.gameOver) {
//       return;
//     }

//     if (this.cursors.left.isDown) {
//       this.player.setVelocityX(-160);
//       this.player.anims.play("left", true);
//     } else if (this.cursors.right.isDown) {
//       this.player.setVelocityX(160);
//       this.player.anims.play("right", true);
//     } else {
//       this.player.setVelocityX(0);
//       this.player.anims.play("turn");
//     }

//     if (this.cursors.up.isDown && this.player.body?.touching.down) {
//       this.player.setVelocityY(-330);
//     }
//   }

//   private collectStar(
//     player: Phaser.GameObjects.GameObject | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile,
//     star: Phaser.GameObjects.GameObject | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile
//   ) {
//     const starSprite = star as Phaser.Physics.Arcade.Sprite;
//     starSprite.disableBody(true, true);

//     this.score += 10;
//     this.scoreText.setText("Score: " + this.score);

//     if (this.stars.countActive(true) === 0) {
//       // All stars collected, re-enable them or spawn new challenge
//       this.stars.children.iterate((child) => {
//         const starChild = child as Phaser.Physics.Arcade.Sprite;
//         starChild.enableBody(true, starChild.x, 0, true, true);
//         starChild.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
//         return true;
//       });
//       // Optional: Spawn a bomb if you implemented it
//       // spawnBomb();
//     }
//   }
// }
