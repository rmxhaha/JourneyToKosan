Journey.Game = function(game){
	this.cursors = null;
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
	this.gameWin = null;
	this.b = null;
	this.windSpeed = 0;
	this.windRight = false;
	this.windLeft = false;
	this.tmp = -1;
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
	const isDebug = true;

Journey.Game.prototype = {

	create: function() {
		// Journey.gameOver = true;
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
		this.stage.backgroundColor = '#004040';
		this.physics.p2.gravity.y = 500;
		this.physics.p2.friction = 0;
		
	    //  Add 2 sprites which we'll join with a spring
	 	// game.paused = true;
		//this.b = this.add.sprite( 10000, -337, 'background' );
		for( var i = 1; i <= 5; ++ i ){
			this.add.sprite( 10000 + (i-1) * 2000, -337, 'background' + i );
			this.add.sprite( 10000 + (i-1) * 2000, -337, 'ground' + i );
		}
		
		
	 	this.ground = this.add.sprite( 10000, -337, null );
	 	this.payungSprite = this.add.sprite(80, 200, 'umbrella');
	    this.playerSprite = this.add.sprite(100, 400, 'chara');
		//this.payungSprite = this.add.sprite(16000, -1000, 'umbrella');
		//this.playerSprite = this.add.sprite(16000, -800, 'chara');
	    this.playerSpriteAnim = this.playerSprite.animations.add('walk');
	    this.playerSpriteAnim.play(10, true);
	    // this.playerSpriteAnim.play(10, true);
		
		// this.payungSprite.scale.setTo( 0.35 );



		this.playerSprite.scale.setTo( 0.8 );

		this.physics.p2.enable([this.playerSprite, this.payungSprite], isDebug);

		this.playerSprite.body.fixedRotation = true;
		this.playerSprite.body.mass = 500;
		this.payungSprite.body.mass = 200;
		this.payungSprite.body.damping = 0.8;

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

		// this.ground.scale.setTo(0.25);
		this.ground.body.clearShapes();
		// this .ground.body.addRectangle( 30000, 200, 0, 0 );  
		this.ground.body.loadPolygon('CCTimur_physics', 'Chapter1Ground');
		this.ground.body.static = true;
		// this.ground.anchor.setTo( 0.5, -1);

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
		
		this.camera.follow( this.playerSprite );
		this.graphic = game.add.graphics(0,0);
		this.graphic.cameraOffset.setTo(0,0);
		this.graphic.fixedToCamera = true;
		// game.paused = true;

		this.dummy = game.add.graphics(0,0);
		this.dummy.cameraOffset.setTo(0,0);
		this.dummy.fixedToCamera = true;
		this.dummy.clear();
		this.dummy.beginFill(0x000000);
		this.dummy.drawRect( 0,0, Journey.GAME_WIDTH , Journey.GAME_HEIGHT );
		dummyAlpha = 1.;

		this.backgroundMusic = game.add.audio('rain',1,true);
		this.backgroundMusic.onDecoded.add(function(){
			this.backgroundMusic.fadeIn(4000);
		}.bind(this), this.backgroundMusic);
		this.backgroundMusic.onStop.add(function(){
			this.backgroundMusic.play('',0,1,true);
		}.bind(this), this.backgroundMusic);
		
		this.steppingSound = game.add.audio('step');

		var tmp = game.add.graphics(-1000,500);
		tmp.clear();
		tmp.beginFill(0x000000);
		tmp.drawRect(0,0, 10000, 300);

		var text = "wetness";
	    var style = { font: "17px Courier bold", fill: "#000000", align: "center" };

	    var t = game.add.text(5, 1, text, style);
	    t.cameraOffset.setTo(0,0);
	    t.fixedToCamera = true;

	},

	update: function() {
		//this.camera.focusOnXY( this.playerSprite.body.x, this.playerSprite.body.y );
		var dt = this.time.elapsed / 1000; // seconds

		this.dummy.alpha = Math.max( 0, dummyAlpha);
		dummyAlpha -= 0.01;
		
		this.emt.update( dt );
		// emt.spawnX = this.camera.x - this.width;
		this.emt.spawnX = this.camera.x - Journey.GAME_WIDTH/2;
		this.emt.spawnY = this.camera.y - 1000;

		this.graphic.clear();
		this.graphic.beginFill(0xFFFFFF);
		this.graphic.drawRect( 0,0, Journey.GAME_WIDTH * ( this.wetness)/100, 20 );
		
		this.wetness = Math.max( 0, this.wetness );

		if (this.wetness >= 100) {
			this.wetness = 0;
			// this.state.start('Game');
		};
		
		var handForce = 10000;
		// if( this.leftDown ){
		// 	this.payungSprite.body.applyForce( 
		// 		[ 5 * handForce , 0  ],
		// 		this.payungSprite.body.x ,
		// 		this.payungSprite.body.y 
		// 	);
		// }
		// else if( this.rightDown ){
		// 	this.payungSprite.body.applyForce( 
		// 		[ 5*-handForce , 0  ],
		// 		this.payungSprite.body.x ,
		// 		this.payungSprite.body.y 
		// 	);
		// }

		
		var payungAngleLimit = 2;
	    if ((this.cursors.left.isDown || this.leftDown) && this.payungSprite.body.rotation<Math.PI*payungAngleLimit && this.payungSprite.body.rotation>Math.PI*-payungAngleLimit)
	    {
	    	var k = 3;
			this.payungSprite.body.applyForce( 
				[ k * handForce * Math.cos( this.payungSprite.body.rotation ), k * handForce * Math.sin( this.payungSprite.body.rotation ) ],
				this.payungSprite.body.x,
				this.payungSprite.body.y 
			);	

	    }
	    else if ((this.cursors.right.isDown || this.rightDown) && this.payungSprite.body.rotation<Math.PI*payungAngleLimit && this.payungSprite.body.rotation>Math.PI*-payungAngleLimit)
	    {
	    	var k = 3;
			this.payungSprite.body.applyForce( 
				[ k * -handForce * Math.cos( this.payungSprite.body.rotation ), k * -handForce * Math.sin( this.payungSprite.body.rotation ) ],
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
			this.playerSprite.body.velocity.x = 400;
			this.playerSpriteAnim.isPaused = false;
		}
		else {
			this.playerSprite.body.velocity.x = 0;
			this.playerSpriteAnim.isPaused = true;
		}

		if (this.playerSprite.body.velocity.x != 0){
			if (!this.steppingSound.isPlaying)
				this.steppingSound.play('',0,1,true);
		}
		else {
			this.steppingSound.pause();
		}

		if (Math.random() < 0.005 && !this.windLeft && !this.windRight) {
			console.log(Math.random());
			if (Math.random() < 0.5) {
				this.windRight = true;
				setTimeout ( function(){ this.windRight = false; }.bind(this),3000 );
			}
			else {
				this.windLeft = true;
				setTimeout ( function(){ this.windLeft = false; }.bind(this), 3000 );
			}
			
		};

		if (this.windRight) {
			this.emt.sprites.forEach( function( sprite ){
				sprite.body.applyForce([-0.0001,0], sprite.body.x, sprite.body.y);
			}.bind(this));
			if (this.payungSprite.body.rotation<Math.PI*payungAngleLimit && this.payungSprite.body.rotation>Math.PI*-payungAngleLimit)
		    {
		    	var k = 1;
				this.payungSprite.body.applyForce( 
					[ k * -handForce * Math.cos( this.payungSprite.body.rotation ), k * -handForce * Math.sin( this.payungSprite.body.rotation ) ],
					this.payungSprite.body.x,
					this.payungSprite.body.y 
				);
		    }
		};

		if (this.windLeft) {
			this.emt.sprites.forEach( function( sprite ){
				sprite.body.applyForce([0.0001,0], sprite.body.x, sprite.body.y);
			}.bind(this));
			if (this.payungSprite.body.rotation<Math.PI*payungAngleLimit && this.payungSprite.body.rotation>Math.PI*-payungAngleLimit)
		    {
		    	var k = 1;
				this.payungSprite.body.applyForce( 
					[ k * handForce * Math.cos( this.payungSprite.body.rotation ), k * handForce * Math.sin( this.payungSprite.body.rotation ) ],
					this.payungSprite.body.x,
					this.payungSprite.body.y 
				);
		    }
		};
		
		//console.log(this.playerSprite.position.x);
		if (this.playerSprite.position.x > 18000)
		{
			if (dummyAlpha < 0)
			{ dummyAlpha = 0; }
			if (this.tmp == -1) {
				this.camera.focusOnXY( 18000, this.playerSprite.body.y );
				this.tmp = this.playerSprite.body.y;
			}
			else {
				this.camera.focusOnXY( 18000, this.tmp );
			}
			
			this.dummy.alpha = Math.min( 1, dummyAlpha);
			dummyAlpha += 0.02;
			this.steppingSound.pause();
			if (this.dummy.alpha == 1) {
				if (this.gameWin == null)
				{
					this.gameWin = this.add.sprite(18000 - 350, this.camera.y + Journey.GAME_HEIGHT/3, 'gameWin');
					this.input.onTap.add(function() { this.state.start('MainMenu'); }.bind(this));
				}
			}
			if (this.playerSprite.position.x > 19000)
			{ this.playerSprite.body.velocity.x = 0; }
		}
		
		// game.paused = true;
	}

};
