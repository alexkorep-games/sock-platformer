import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import launchGame from "../phaser/game"; // Our game launcher

const PHASER_CONTAINER_ID = "phaser-game-container";

const PhaserGameComponent: React.FC = () => {
  const gameInstance = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Ensure the game is created only once.
    if (gameInstance.current) {
      return;
    }

    // Launch the Phaser game instance
    gameInstance.current = launchGame(PHASER_CONTAINER_ID);

    // Cleanup function to destroy the game when the component unmounts
    return () => {
      gameInstance.current?.destroy(true);
      gameInstance.current = null;
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // This div is where the Phaser canvas will be injected by the 'parent' config
  return (
    <div
      id={PHASER_CONTAINER_ID}
      style={{ width: "800px", height: "600px", margin: "0 auto" }}
    />
  );
};

export default PhaserGameComponent;
