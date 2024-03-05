


/*************/
/* APP MAIN  */
/*************/

// Configuration object for Phaser
const config = {
    parent: 'game-container',
    type: Phaser.AUTO,
    width: GAME_X_BOUNDS,
    height: GAME_Y_BOUNDS,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 250 },
        debug: false
      }
    },
    scene: [ TiledScene ]
  };
  
// Create a new Phaser Game instance with the configuration
const game = new Phaser.Game(config);
  