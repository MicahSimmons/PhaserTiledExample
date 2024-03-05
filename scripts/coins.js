


class CoinMgr extends ObjectGroup {
    constructor (config) {
        super (config);
        this.locs = [];
    }

    preload () {
        this.scene.load.spritesheet('coins', 
            'images/coin_sprite.png',
            { frameWidth: 64, frameHeight: 64 }
        );
    }

    create () {
        this.all_coins = this.scene.physics.add.group({ allowGravity: false });

        this.scene.anims.create({
            key: 'coinspin',
            frames: this.scene.anims.generateFrameNumbers('coins', {start:0, end:5}),
            frameRate: 10,
            repeat: -1
          });        
    }

    makeCoin ( x, y ) {
        let coin = this.scene.physics.add.sprite(x, y, "coins");
        coin.setScale(0.5);
        coin.setOrigin(0);
        coin.play("coinspin");
        this.all_coins.add(coin);
        
        this.scene.tweens.add({
            targets: [ coin ],
            x: x+64,
            yoyo: true,
            duration: 2000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            delay: (Math.random() * 2000)
        });
    }

    spawn ( x, y ) {
        this.locs.push ( {x: x, y:y })
        this.makeCoin(x, y);
    }

    update () {
        if (this.all_coins.countActive() == 0) {
            this.locs.forEach( (loc) => {
                this.makeCoin(loc.x, loc.y)
            })
        }
    }

    getCollider() {
        return this.all_coins;
    }

}