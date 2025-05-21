import Phaser from "phaser";
import { GameScene } from "./GameScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-game-container", // ID of the div
  width: 800,
  height: 600,
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
  // Ensure world bounds match game dimensions
  // This is often handled by default, but explicit is good
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const launchGame = (containerId: string): Phaser.Game => {
  return new Phaser.Game({ ...gameConfig, parent: containerId });
};

export default launchGame;
export { gameConfig }; // Export config if you need to reference width/height elsewhere
