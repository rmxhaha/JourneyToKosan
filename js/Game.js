Journey.Game = function(game){
	this.cursors = null;
	this.r = null;
	this.swipeDetect = null;
	this.playerSprite = null;
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
};

	// var cloudSprite1, cloudSprite2, cloudSpriteEx, bushSprite, groundSprite;
	// var cursors;


	// var r, swipeDetect;
	// var leftDown = false;
	// var rightDown = false;
	// var gameOver = false;
	// var tap = false;
	// var logoSprite;
	// var wetness = 0;
	const eps = 1e-6;

Journey.Game.prototype = {

	create: function() {
		Journey.gameOver = true;
		//game.world.scale.set(  1 / window.devicePixelRatio );
		// console.log(window.devicePixelRatio);

		this.r = new Recognizer( game.canvas );
		this.dd = new DistanceCounter( this.r );
		this.swipeDetect = new SwipeDetector( this.dd, 150 );
		this.swipeDetect.bind('swipeleft', function(){
			this.leftDown = true;
			console.log('left');
			setTimeout( function(){ this.leftDown = false; }.bind(this), 50 );
		}.bind(this));
		this.swipeDetect.bind('swiperight', function(){
			this.rightDown = true;
			setTimeout( function(){ this.rightDown = false; }.bind(this), 50 );
			
		}.bind(this));

	 //    //this.add.image(0, 0, 'sky');
		

		// //	Enable p2 physics
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.world.setBounds(-5000,-10000, 100000, 20000 );
		this.stage.backgroundColor = '#333';
		this.physics.p2.gravity.y = 500;
		this.physics.p2.friction = 0;
		
	 //    //  Add 2 sprites which we'll join with a spring
	    this.playerSprite = this.add.sprite(200, 400, 'chara');
		this.payungSprite = this.add.sprite(60, 150, 'umbrella');
		this.payungSprite.scale.setTo( 0.35 );
		
		this.physics.p2.enable([this.playerSprite, this.payungSprite], true);

		this.playerSprite.body.fixedRotation = true;
		this.playerSprite.body.mass = 500;
		this.payungSprite.body.mass = 200;
		this.payungSprite.body.damping = 0.8;

		this.payungSprite.anchor.setTo( 0.5, 0.2 );
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

				var revoluteConstraint = this.physics.p2.createRevoluteConstraint(this.playerSprite, [0,0], this.payungSprite,  [0,200] );

		this.payungSprite.body.addPolygon({}, pts);
		


	    this.cursors = this.input.keyboard.createCursorKeys();

		this.ground = this.add.sprite( 0, 600, 'groundMain' );
		this.ground.scale.setTo( 10 );

		this.physics.p2.enable( this.ground, true );

		this.ground.body.clearShapes();
		this.ground.body.addRectangle( 30000, 200, 0, 0 );  
		this.ground.body.static = true;
		

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
		this.graphic = game.add.graphics(0,0);
		this.graphic.cameraOffset.setTo(0,0);
		this.graphic.fixedToCamera = true;
		// this.paused = true;

		this.logoSprite = this.add.sprite( 0, 0, 'logo');
		this.logoSprite.scale.setTo( 0.1 );

		this.input.onTap.add(doSomething, this);
	},

	update: function() {
		this.camera.focusOnXY( this.playerSprite.body.x, this.playerSprite.body.y );
		var dt = this.time.elapsed / 1000; // seconds
		
		this.emt.update( dt );
		// emt.spawnX = this.camera.x - this.width;
		this.emt.spawnX = this.playerSprite.body.x-450;
		this.emt.spawnY = this.camera.y;

		this.graphic.clear();
		this.graphic.beginFill(0x0099FF);
		this.graphic.drawRect( 0,0, Journey.GAME_WIDTH * ( 100 - this.wetness)/100, 20 );
		
		this.wetness = Math.max( 0, this.wetness - 3 * dt );

		if (this.wetness >= 100) {
			this.wetness = 0;
			this.state.start('Game');
		};
		
		var handForce = 10000;
		if( this.leftDown ){
			this.payungSprite.body.applyForce( 
				[ 5 * handForce * Math.cos( this.payungSprite.body.rotation ), 5 * handForce * Math.sin( this.payungSprite.body.rotation ) ],
				this.payungSprite.body.x ,
				this.payungSprite.body.y 
			);
		}
		else if( this.rightDown ){
			this.payungSprite.body.applyForce( 
				[ 5*-handForce * Math.cos( this.payungSprite.body.rotation ), 5 * -handForce * Math.sin( this.payungSprite.body.rotation ) ],
				this.payungSprite.body.x ,
				this.payungSprite.body.y 
			);
		}

		
		var payungAngleLimit = 1/4;
	    if (this.cursors.left.isDown && this.payungSprite.body.rotation<Math.PI*payungAngleLimit && this.payungSprite.body.rotation>Math.PI*-payungAngleLimit)
	    {
			this.payungSprite.body.applyForce( 
				[ handForce * Math.cos( this.payungSprite.body.rotation ), handForce * Math.sin( this.payungSprite.body.rotation ) ],
				this.payungSprite.body.x,
				this.payungSprite.body.y 
			);
	    }
	    else if (this.cursors.right.isDown && this.payungSprite.body.rotation<Math.PI*payungAngleLimit && this.payungSprite.body.rotation>Math.PI*-payungAngleLimit)
	    {
			this.payungSprite.body.applyForce( 
				[ -handForce * Math.cos( this.payungSprite.body.rotation ), -handForce * Math.sin( this.payungSprite.body.rotation ) ],
				this.payungSprite.body.x,
				this.payungSprite.body.y 
			);
	    }
		else {
			var k = this.payungSprite.body.rotation < Math.PI*0 + eps ? -1 : 1;
			this.payungSprite.body.applyForce( 
				[ k*handForce * Math.cos( this.payungSprite.body.rotation ), k*handForce * Math.sin( this.payungSprite.body.rotation ) ],
				this.payungSprite.body.x,
				this.payungSprite.body.y 
			);
			
			
		}
		// playerSprite.body.applyForce([-3000,0], playerSprite.body.x, playerSprite.body.y)
		if (!Journey.gameOver) {
			this.playerSprite.body.velocity.x = 100;
			this.ground.body.velocity.x = -3000;
		};

		// game.paused = true;
	}

};

function RainEmitter( game, sx, sy, w, h, dropLimit, vThres, vRes ){
	this.count = 0;
	this.sprites = game.add.group();
	this.spawnX = sx;
	this.spawnY = sy;
	this.spawnW = w;
	this.spawnH = h;
	this.dropLimit = dropLimit;
	this.velocityThreshold = vThres;
	this.velocityRestraint = vRes;
	this.game = game;
	
	for( var i = 0; i < dropLimit; ++ i )
	{
		s = this.sprites.create( 0, 0, null );
		this.game.physics.p2.enable( s, false );
		s.body.clearShapes();
		s.body.addCircle( 2 );

		this.spawn( s, game);
	}

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
	sprite.revive( 100 );
	sprite.body.x = this.getX();
	sprite.body.y = this.getY();
	sprite.body.mass = eps;
	var v = this.getV();
	var te = Math.PI * 2 * Math.random();
	sprite.body.velocity.x = -1000;
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

	this.sprites.forEachDead( function( s ){
		this.spawn( s );
	}.bind(this) );

	this.sprites.forEachAlive( function( s ){
		var x = s.x - s.body.velocity.x*dt;
		var y = s.y - s.body.velocity.y*dt;
		var tx = s.x;
		var ty = s.y;
		
		this.drawLine( x, y, tx, ty );
//		s.body.rotation = -Math.atan2( -s.body.velocity.y, s.body.velocity.x ) + Math.PI*3/2;
	}.bind(this) );
	
}

function doSomething(pointer) {
	if (this.logoSprite.alive) {
		this.logoSprite.kill();
		console.log('tap');
		Journey.gameOver = false;
	};

 // pointer will contain the pointer that activated this event
}

