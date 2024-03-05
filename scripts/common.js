
const GAME_X_BOUNDS = 800;
const GAME_Y_BOUNDS = 600;

const EVENT_ID = {
    INVALID_EVENT: 0,
    PLAYER_JUMP: 1,
    PLAYER_LEFT_START: 2,
    PLAYER_RIGHT_START: 3,
    PLAYER_LEFT_END: 4,
    PLAYER_RIGHT_END: 5
}

class ObjectGroup {
    constructor ( config ) {
        this.config = config
        this.scene = config.scene;
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.height = config.height;
        this.children = {};
        this.dispatch_table = {};
    }

    add( key, object ) {
        this.children[key] = object;
        return object;
    }

    get(key) {
        return this.children[key];
    }

    init () { 
        for (let key in this.children) {
            if (this.children[key].init != undefined) { this.children[key].init(); }
        }
    }

    preload () { 
        for (let key in this.children) {
            if (this.children[key].preload != undefined) { this.children[key].preload(); }
        }
    }

    create () { 
        for (let key in this.children) {
            if (this.children[key].create != undefined) { this.children[key].create(); }
        }        
    }

    update ( now, deltaTime ) {
        for (let key in this.children) {
            if (this.children[key].update != undefined) { this.children[key].update(); }
        }
    }

    listen ( event_id, cb_fn ) {
        this.dispatch_table[event_id] = cb_fn;
    }

    dispatch ( event_id, data ) {
        if (this.dispatch_table[event_id] != undefined) {
            this.dispatch_table[event_id](event_id, data);
        }

        for (let key in this.children) {
            if (this.children[key].dispatch != undefined) { this.children[key].dispatch( event_id, data ); }
        }
    }
}


class Button extends ObjectGroup {
    constructor (config) {
        super(config);
        this.label = config.label;
        this.event_id = config.event_id;
    }

    create () {
        super.create();

        this.add( "button",
            this.scene.add.rectangle(this.x, this.y, this.width, this.height, 0xeeeeee)
        ).setStrokeStyle(2, 0xaaaaaa)
         .setOrigin(0)
         .setInteractive()
         .on('pointerover', (pointer, obj) => { this.get("button").fillColor = 0xEBAC36 })
         .on('pointerout', (pointer, obj) => { this.get("button").fillColor = 0xeeeeee })
         .on('pointerup', (pointer, x, y) => { this.scene.q(this.event_id, {}) })


        this.add( "label",
            this.scene.add.text( this.x+5, this.y+5, this.label, 
                { fontFamily: 'Arial', fontSize: '14px', fill:'#111'})
        );
    }

    setColor ( rgb_hex ) {
        this.get("button").fillColor = rgb_hex;
    }
}


class BasicScene extends Phaser.Scene {
    constructor (config) {
      super(config);
      this.q = this.q.bind(this);
      this.listeners = {};
      this.child_obj = {};

      this.init = this.init.bind(this);
      this.preload = this.preload.bind(this);
      this.create = this.create.bind(this);
      this.update = this.update.bind(this);
      this.listen = this.listen.bind(this);
      this.q = this.q.bind(this);
      this.dispatchQ = this.dispatchQ.bind(this);
      this.addObj = this.addObj.bind(this);
      this.get = this.get.bind(this);
    }
  
    addObj (key, object_group) {
        this.child_obj[key] = object_group;
        return object_group;
    }

    get (key) {
        return this.child_obj[key];
    }

    init() {

        // Init Sub-Objects
        for (let key in this.child_obj) {
            if (this.child_obj[key].init != undefined) { this.child_obj[key].init(); }
        }
    }
    
    // Preload function to load assets
    preload() {
        // Load Sub-Objects
        for (let key in this.child_obj) {
            if (this.child_obj[key].preload != undefined) { this.child_obj[key].preload(); }
        }
    }
    
    create() {
        // Create Sub-Objects
        for (let key in this.child_obj) {
            if (this.child_obj[key].create != undefined) { this.child_obj[key].create(); }
        }
    }
    
    // Update function called every frame
    update( now, deltaTime ) {
        // Update Sub-Objects
        for (let key in this.child_obj) {
            if (this.child_obj[key].update != undefined) { this.child_obj[key].update( now, deltaTime ); }
        }
    }
  
    listen( event_id, cb_fn) {
      this.listeners[event_id] = cb_fn;
    }

    dispatchQ (event_id, data) {
      console.log("Got Event:" + event_id)
      /* TODO check for q listeners */
      for (let key in this.listeners) {
        if (key == event_id) {
          this.listeners[key](event_id, data);
        }
      }

      for (let key in this.child_obj) {
        if (this.child_obj[key].dispatch != undefined) { this.child_obj[key].dispatch( event_id, data ); }
      }
    }

    q ( event_id, data ) {
        setTimeout( () => this.dispatchQ(event_id, data), 0);
    }

    getCollider() {
        return undefined;
    }
  }
  