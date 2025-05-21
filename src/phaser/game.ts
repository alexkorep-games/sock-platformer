import Phaser from "phaser";
import { GameScene } from "./GameScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-game-container", // ID of the div
  width: 800, // Initial canvas width, can be overridden by camera/world bounds
  height: 600, // Initial canvas height
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 300,
        x: 0,
      },
      debug: false, // Set to true for physics debugging
    },
  },
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const launchGame = (containerId: string): Phaser.Game => {
  return new Phaser.Game({ ...gameConfig, parent: containerId });
};

export default launchGame;
export { gameConfig };
