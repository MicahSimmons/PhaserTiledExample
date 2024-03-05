

const PLAYER_MAX_SPEED = 128 * 1.5;
const PLAYER_ACCEL = 256 * 1.5;
const PLAYER_DECEL = 4;
const PLAYER_AIR_DRAG = 0.5;

class PlayerDude extends ObjectGroup {
    constructor (config) {
        super(config);
        this.movement = {
            speed: 0,
            left: false,
            right: false
        }

        this.jump = this.jump.bind(this);
        this.update = this.update.bind(this);

        this.listen(EVENT_ID.PLAYER_JUMP, this.jump)
        this.listen(EVENT_ID.PLAYER_LEFT_START, () => {
            this.movement.left = true;
            this.updateAnim();
        });
        this.listen(EVENT_ID.PLAYER_LEFT_END, () => { 
            this.movement.left = false
            this.updateAnim();
        });
        this.listen(EVENT_ID.PLAYER_RIGHT_START, () => {
            this.movement.right = true
            this.updateAnim();
        });
        this.listen(EVENT_ID.PLAYER_RIGHT_END, () => {
            this.movement.right = false
            this.updateAnim();
        });

    }

    updateAnim() {
        let p = this.get("Player");
        if (this.movement.right) {
            p.play("right");
        } else if (this.movement.left) {
            p.play("left")
        } else {
            p.play("turn")
        }
    }

    getCollider() {
        return this.get("Player");
    }

    jump (event_id, data) {
        let p = this.get("Player");
        if (p.body.blocked.down) {
            p.setVelocityY(-250);
            let sfx = this.scene.sound.add("boing");
            sfx.play();
        }
    }

    preload() {
        super.preload();
        this.scene.load.spritesheet('dude', 
            'images/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );

        this.scene.load.audio("boing", "sounds/jump.mp3");
    }

    create() {
        this.add( "Player",
            this.scene.physics.add.sprite(100, 450, 'dude')
        ).setBounce(0.2)
         .setCollideWorldBounds(true)
         .setDepth(4);

        this.scene.cameras.main.startFollow(this.get("Player"));

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('dude', {start:0, end:3}),
            frameRate: 10,
            repeat: -1
          });
      
          this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame:4 }],
            frameRate: 20
          });
      
          this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('dude', {start:5, end:8}),
            frameRate: 10,
            repeat: -1
          });
    }

    update (now, deltaTime) {
        let p = this.get("Player");
        if (p.body.blocked.down) {
            if (this.movement.right) {
                if ( this.movement.speed < 0) {
                    this.movement.speed += (PLAYER_ACCEL * deltaTime / 1000);
                }
                if ( this.movement.speed < PLAYER_MAX_SPEED) {
                    this.movement.speed += (PLAYER_ACCEL * deltaTime / 1000);
                }
            } else if (this.movement.left) {
                if ( this.movement.speed > 0) {
                    this.movement.speed -= (PLAYER_ACCEL * deltaTime / 1000);
                }
                if ( this.movement.speed > (-1 * PLAYER_MAX_SPEED)) {
                    this.movement.speed -= (PLAYER_ACCEL * deltaTime / 1000);
                }
            } else {
                this.movement.speed = this.movement.speed - (this.movement.speed * PLAYER_DECEL * deltaTime / 1000);
            }
        } else {
            this.movement.speed = this.movement.speed - (this.movement.speed * PLAYER_AIR_DRAG * deltaTime / 1000);
        }
        p.setVelocityX(this.movement.speed);

    }

}