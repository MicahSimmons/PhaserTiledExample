/*************/
/* SCENE     */
/*************/

class TiledScene extends BasicScene {
  constructor (config) {
    super(config);
  }

  init () {
    super.init();

    this.addObj("Dude", new PlayerDude({
      scene: this,
      x: 64,
      y: GAME_Y_BOUNDS - 64
    }));

    this.addObj("Controller", new WasdController({
      scene: this
    }));

    this.addObj("Coins", new CoinMgr({
      scene: this
    }));

  }

  preload () {
    super.preload();

    this.load.image('base_tiles', 'maps/goodly-2x.png')
    this.load.tilemapTiledJSON('tilemap', 'maps/simple_platforms.tmj')

    this.load.audio("bgm", "sounds/puzzle-1-a.mp3");
    this.load.audio("ding", "sounds/completetask_0.mp3");
  }

  create () {
    super.create();

    // Add default background
    this.cameras.main.setBackgroundColor('#56C5E0');

    // Import the map file 
    const map = this.make.tilemap({ key: 'tilemap' })

    // Associate the Phaser Image Key to the Tiled Tileset Name
    const tileset = map.addTilesetImage('Platforms', 'base_tiles')

    // Import the Map Layers.  Save the collision layer to make adjustments.
    let spawn_layer = map.createLayer("SpawnPoints");
    map.createLayer('Background', tileset)
    map.createLayer('Stickers', tileset)
    let platform_layer = map.createLayer('Platforms', tileset)

    // Turn on Collisions with the Platform Layer.  
    // Any occupied tile is considered solid.
    platform_layer.setCollisionByExclusion([-1]);

    // Use a physics group to block the player from passing through collision tiles.
    this.physics.add.collider(this.get("Dude").getCollider(), 
                              platform_layer);

    // Reset the world bounds & camera bounds to match the Tile Map.
    this.physics.world.setBounds(0,0,  map.widthInPixels, map.heightInPixels );
    this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);

    // Spawn Objects 
    this.setupCoins(spawn_layer);

    // Music!
    let bgm = this.sound.add("bgm");
    bgm.play()
    bgm.setLoop(true);
  }

  setupCoins (spawn_layer) {
        // Spawn Objects
      spawn_layer.layer.data.forEach( (row) => {
        row.forEach( (cell, idx) => {
          if (cell.index >= 0) {
            this.get("Coins").spawn( (cell.x * cell.width) , (cell.y * cell.height) )
          }
        })
      })
  
      this.physics.add.collider(this.get("Dude").getCollider(), this.get("Coins").getCollider(), (player, coin) => {
        coin.destroy();
        let ding = this.sound.add("ding");
        ding.play();
      });
  }


}

