

class WasdController extends ObjectGroup {
    constructor (config) {
        super(config);
        this.jumping = false;
        this.right = false;
        this.left = false;
    }

    create () {
        super.create();

        this.keys = this.scene.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' });
    }

    update ( now, deltaTime ) {
        //console.log(this.keys);
        if (this.keys.up.isDown) {
            if (!this.jumping) {
                this.jumping = true;
                this.scene.q(EVENT_ID.PLAYER_JUMP, {});
            }
        } else {
            this.jumping = false;
        }

        if ((this.keys.right.isDown) && (this.right == false)) {
            this.right = true;
            this.scene.q(EVENT_ID.PLAYER_RIGHT_START, {});
        } else if ((this.keys.right.isDown == false) && (this.right)) {
            this.right = false;
            this.scene.q(EVENT_ID.PLAYER_RIGHT_END, {});
        }

        if ((this.keys.left.isDown) && (this.left == false)) {
            this.left = true;
            this.scene.q(EVENT_ID.PLAYER_LEFT_START, {});
        } else if ((this.keys.left.isDown == false) && (this.left)) {
            this.left = false;
            this.scene.q(EVENT_ID.PLAYER_LEFT_END, {});
        }
    }
}