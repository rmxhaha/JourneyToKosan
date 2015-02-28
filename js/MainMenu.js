Journey.MainMenu = function(game) {
    this.r = null;
    this.swipeDetect = null;
    this.playerSprite = null;
    this.playerSpriteAnim = null;
    this.payungSprite = null;
    this.logoSprite = null;
    this.ground = null;
    this.emt = null;
    this.graphic = null;
    Journey.gameOver = false;
    this.leftDown = false;
    this.rightDown = false;
    this.tap = false;
    this.wetness = 0;
    this.dummy = null;
    this.backgroundMusic = null;
    this.steppingSound = null;
    this.windSpeed = 0;
    this.windRight = false;
    this.windLeft = false;
};
Journey.MainMenu.prototype = {
    create: function() {
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.world.setBounds(-5000,-10000, 100000, 20000 );
        this.stage.backgroundColor = '#004040';
        this.physics.p2.gravity.y = 500;
        this.physics.p2.friction = 0;
        
        //  Add 2 sprites which we'll join with a spring
        // game.paused = true;
        this.ground = this.add.sprite( 10000, -337, 'groundMain' );
        this.payungSprite = this.add.sprite(180, 200, 'umbrella');
        this.playerSprite = this.add.sprite(200, 400, 'chara', 7);
        this.playerSpriteAnim = this.playerSprite.animations.add('walk');
        // this.playerSpriteAnim.play(10, true);
        // this.playerSpriteAnim.play(10, true);
        
        // this.payungSprite.scale.setTo( 0.35 );



        this.playerSprite.scale.setTo( 0.8 );

        this.physics.p2.enable([this.playerSprite, this.payungSprite], isDebug);

        this.playerSprite.body.fixedRotation = true;
        this.playerSprite.body.mass = 500;
        this.payungSprite.body.mass = 200;
        this.payungSprite.body.damping = 0.8;

        this.payungSprite.body.static = true;

        this.playerSprite.body.clearShapes();
        this.playerSprite.body.addRectangle( 100, 200, 0, 10);


        this.payungSprite.anchor.setTo( 0.48, 0.2 );
        this.payungSprite.body.clearShapes();
        
        var pts = [
            150,10, 
            100, 0,
            50, 10, 
            -30, 50,    
            -30, 70,
            100, 70,
            230, 70,
            230, 50
        ];
            
        for( var i = 0; i < pts.length; ++ i ) { pts[i] = pts[i] * 1.3; }

                var revoluteConstraint = this.physics.p2.createRevoluteConstraint(this.playerSprite, [0,0], this.payungSprite,  [-80,150] );

        this.payungSprite.body.addPolygon({}, pts);
        


        this.cursors = this.input.keyboard.createCursorKeys();


        this.physics.p2.enable( this.ground, isDebug );

        this.ground.body.clearShapes();
        //this.ground.body.addRectangle( 30000, 200, 0, 0 );  
        this.ground.body.loadPolygon('CCTimur_physics', 'Chapter1Ground');
        this.ground.body.static = true;
        this.ground.anchor.setTo( 0.5, 1.143);

        this.emt = new RainEmitter(this, 0,0, Journey.GAME_WIDTH*2, 100, 100, 1500, 500 );

        this.emt.sprites.forEach( function( sprite ){
            sprite.body.onBeginContact.add(function( b ){
                if( b == this.playerSprite.body ){
                    sprite.kill();
                    this.wetness ++;
                }
                if( b == this.payungSprite.body ){
                    sprite.kill();
                }
                if( b == this.ground.body ){
                    sprite.kill();
                }
            }.bind(this));
        }.bind(this));
        
        // this.camera.focusOn( this.playerSprite );
        // game.paused = true;

        this.logoSprite = this.add.sprite( Journey.GAME_WIDTH - 600, 0, 'logo');
        this.logoSprite.scale.setTo( 1.4 );

        this.dummy = game.add.graphics(0,0);
        this.dummy.cameraOffset.setTo(0,0);
        this.dummy.fixedToCamera = true;
        this.dummy.clear();
        this.dummy.beginFill(0x000000);
        this.dummy.drawRect( 0,0, Journey.GAME_WIDTH , Journey.GAME_HEIGHT );
        dummyAlpha = 1.;

        this.backgroundMusic = game.add.audio('rain',1,true);
        this.backgroundMusic.onDecoded.add(function(){
            this.backgroundMusic.fadeIn(8000);
        }.bind(this), this.backgroundMusic);
        this.backgroundMusic.onStop.add(function(){
            this.backgroundMusic.play('',0,1,true);
        }.bind(this), this.backgroundMusic);

        var tmp = game.add.graphics(-1000,527);
        tmp.clear();
        tmp.beginFill(0x000000);
        tmp.drawRect(0,0, 10000, 300);

        // this.add.sprite(0, 0, 'background');
        // this.add.sprite(-130, Journey.GAME_HEIGHT-514, 'monster-cover');
        // this.add.sprite((Journey.GAME_WIDTH-395)/2, 60, 'title');
        this.add.button(Journey.GAME_WIDTH-401-10, Journey.GAME_HEIGHT-143-10,
            'button-start', this.startGame, this, 1, 0, 2);
    },

    update: function() {

        var dt = this.time.elapsed / 1000; // seconds

        this.dummy.alpha = Math.max( 0, dummyAlpha);
        dummyAlpha -= 0.01;
        
        this.emt.update( dt );
        // emt.spawnX = this.camera.x - this.width;
        this.emt.spawnX = this.camera.x - Journey.GAME_WIDTH/2;
        this.emt.spawnY = this.camera.y - 1000;

        this.emt.sprites.forEach( function( sprite ){
            sprite.body.applyForce([0.0001,0], sprite.body.x, sprite.body.y);
        }.bind(this));
        
        // game.paused = true;
    },

    startGame: function() {
        this.state.start('Game');
    }
};

function RainEmitter( game, sx, sy, w, h, dropLimit, vThres, vRes ){
    this.count = 0;
    this.sprites = game.add.group();
    this.spawnX = sx;
    this.spawnY = 20000;
    this.spawnW = w;
    this.spawnH = h;
    this.dropLimit = dropLimit;
    this.velocityThreshold = vThres;
    this.velocityRestraint = vRes;
    this.game = game;
    
    for( var i = 0; i < dropLimit; ++ i )
    {
        s = this.sprites.create( 0, 0, null );
        this.game.physics.p2.enable( s, isDebug );
        s.body.clearShapes();
        s.body.addCircle( 2 );

        this.spawn( s, game);
    }
    this.spawnY = sy;
    this.graphic = this.game.add.graphics(0,0);
}

RainEmitter.prototype.getX = function(){
    return this.spawnX + Math.random() * this.spawnW;
}

RainEmitter.prototype.getY = function(){
    return this.spawnY + Math.random() * this.spawnH;
}

RainEmitter.prototype.getV = function(){
    //return this.velocityThreshold + Math.random() * ( this.velocityRestraint - this.velocityThreshold );
    return this.velocityThreshold;
}

RainEmitter.prototype.spawn = function( sprite, game ){
    sprite.lifespan = 1000 + 1000 * Math.random();
    sprite.revive( 0 );
    sprite.body.x = this.getX();
    sprite.body.y = this.getY();
    sprite.body.mass = eps;
    var v = this.getV();
    var te = Math.PI * 2 * Math.random();
    sprite.body.velocity.x = this.game.windSpeed;
    sprite.body.velocity.y = v;
}

RainEmitter.prototype.drawLine = function( x, y, tx, ty ){
    this.graphic.lineWidth = 2;
    this.graphic.lineColor = 0xFFFFFF;
    this.graphic.moveTo(x, y);
    this.graphic.lineTo(tx , ty );
}

RainEmitter.prototype.update = function( dt ){
    this.graphic.clear();

    

    this.sprites.forEachAlive( function( s ){
        var x = s.x - s.body.velocity.x*dt;
        var y = s.y - s.body.velocity.y*dt;
        var tx = s.x;
        var ty = s.y;
        if ((y < ty)) {
            this.drawLine( x, y, tx, ty );
//            console.log(y,' ',ty);
        };
//      s.body.rotation = -Math.atan2( -s.body.velocity.y, s.body.velocity.x ) + Math.PI*3/2;
    }.bind(this) );
    
    this.sprites.forEachDead( function( s ){
        this.spawn( s );
    }.bind(this) );
}
