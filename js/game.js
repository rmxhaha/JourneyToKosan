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
		game.physics.p2.enable( s, false );
		s.body.clearShapes();
		s.body.addCircle( 2 );
		this.spawn( s );
	}

	this.graphic = game.add.graphics(0,0);
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

RainEmitter.prototype.spawn = function( sprite ){
	sprite.lifespan = 1000 + 1000 * Math.random();
	sprite.revive( 100 );
	sprite.body.x = this.getX();
	sprite.body.y = this.getY();
	sprite.body.mass = 0.001;
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


var game = new Phaser.Game(
	window.innerWidth * window.devicePixelRatio, 
	window.innerHeight * window.devicePixelRatio, 
	Phaser.CANVAS, '', { preload: preload, create: create, update: update });

	
	
function preload() {
	game.load.image('chara', 'assets/nanoha_taiken_blue.png');
	game.load.image('umbrella', 'assets/Umbrella.png');
	game.load.image('drop', 'assets/tes2.png');
	game.load.image('cloudMain', 'assets/cloud-hi.png');
	game.load.image('cloudExtra', 'assets/clouds1.png');
	game.load.image('bushMain', 'assets/bushes-hi.png');
	game.load.image('groundMain', 'assets/ground.png');
}

var cloudSprite1, cloudSprite2, cloudSpriteEx, bushSprite, groundSprite;
var cursors;


var r, swipeDetect;
var leftDown = false;
var rightDown = false;


function create() {
	game.world.scale.set(  1 / window.devicePixelRatio );
	/*
	var hammertime = new Hammer(game.canvas, {});
	hammertime.on('swipeleft', function(){
		leftDown = true;
		console.log('left');
		setTimeout( function(){ leftDown = false; }, 50 );
	});
	
	hammertime.on('swiperight', function(){
		rightDown = true;
		setTimeout( function(){ rightDown = false; }, 50 );
		
	});
	*/
	r = new Recognizer( game.canvas );
	dd = new DistanceCounter( r );
	swipeDetect = new SwipeDetector( dd, 150 );
	swipeDetect.bind('swipeleft', function(){
		leftDown = true;
		console.log('left');
		setTimeout( function(){ leftDown = false; }, 50 );
	});
	swipeDetect.bind('swiperight', function(){
		rightDown = true;
		setTimeout( function(){ rightDown = false; }, 50 );
		
	});


    //game.add.image(0, 0, 'sky');
	

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.world.setBounds(-5000,-10000, 10000, 20000 );
	game.stage.backgroundColor = '#333';
	game.physics.p2.gravity.y = 500;
	game.physics.p2.friction = 4;
	
    //  Add 2 sprites which we'll join with a spring
    playerSprite = game.add.sprite(200, 500, 'chara');
	payungSprite = game.add.sprite(200, 100, 'umbrella');
	payungSprite.scale.setTo( 0.3 );
	
	game.physics.p2.enable([playerSprite, payungSprite], false);

	playerSprite.body.fixedRotation = true;
	playerSprite.body.mass = 50;
	payungSprite.body.mass = 20;
	payungSprite.body.damping = 0.8;

	payungSprite.anchor.setTo( 0.5, 0.2 );
	payungSprite.body.clearShapes();
	
	var pts = [
		150,10,	
		100, 0,
		50,10,	
		0,50,	
		100, 30,
		200, 50
	];
		
	for( var i = 0; i < pts.length; ++ i ) { pts[i] = pts[i] * 1.3; }

	payungSprite.body.addPolygon({}, pts);
	
	var revoluteConstraint = game.physics.p2.createRevoluteConstraint(playerSprite, [0,0], payungSprite,  [0,150] );

    cursors = game.input.keyboard.createCursorKeys();

	ground = game.add.sprite( 0, 600, null );

	game.physics.p2.enable( ground, true );

	ground.body.clearShapes();
	ground.body.addRectangle( 3000, 200, 0, 0 );  
	ground.body.static = true;
	

	emt = new RainEmitter(game, 0,0, game.width*2, 100, 100, 1500, 500 );
	
	emt.sprites.forEach( function( sprite ){
		sprite.body.onBeginContact.add(function( b ){
			if( b == playerSprite.body ){
				sprite.kill();
				wetness ++;
			}
			if( b == payungSprite.body ){
			//	sprite.kill();
			}
			if( b == ground.body ){
				sprite.kill();
			}
		});
	});
	
	game.camera.follow( playerSprite );

	graphic = game.add.graphics(0,0);
	graphic.cameraOffset.setTo(0,0);
	graphic.fixedToCamera = true;
}

var wetness = 0;

function update() {
	var dt = game.time.elapsed / 1000; // seconds
	
	emt.update( dt );
	emt.spawnX = game.camera.x - game.width;
	emt.spawnY = game.camera.y;

	graphic.clear();
	graphic.beginFill(0x0099FF);
	graphic.drawRect( 0,0, game.width * ( 100 - wetness)/100, 20 );
	
	wetness = Math.max( 0, wetness - 3 * dt );
	
	var handForce = 1000;
	if( leftDown ){
		payungSprite.body.applyForce( 
			[ 5 * handForce * Math.cos( payungSprite.body.rotation ), 5 * handForce * Math.sin( payungSprite.body.rotation ) ],
			payungSprite.body.x ,
			payungSprite.body.y 
		);
	}
	else if( rightDown ){
		payungSprite.body.applyForce( 
			[ 5*-handForce * Math.cos( payungSprite.body.rotation ), 5 * -handForce * Math.sin( payungSprite.body.rotation ) ],
			payungSprite.body.x ,
			payungSprite.body.y 
		);
	}
	
    if (cursors.left.isDown)
    {
		payungSprite.body.applyForce( 
			[ handForce * Math.cos( payungSprite.body.rotation ), handForce * Math.sin( payungSprite.body.rotation ) ],
			payungSprite.body.x ,
			payungSprite.body.y 
		);
    }
    else if (cursors.right.isDown)
    {
		payungSprite.body.applyForce( 
			[ -handForce * Math.cos( payungSprite.body.rotation ), -handForce * Math.sin( payungSprite.body.rotation ) ],
			payungSprite.body.x,
			payungSprite.body.y 
		);
    }
	else {
		var k = payungSprite.body.rotation < Math.PI*2 ? -1 : 1;
		payungSprite.body.applyForce( 
			[ k*handForce * Math.cos( payungSprite.body.rotation ), k*handForce * Math.sin( payungSprite.body.rotation ) ],
			payungSprite.body.x,
			payungSprite.body.y 
		);
		
		
	}
/*
    if (cursors.up.isDown)
    {
        payungSprite.body.moveUp(400);
    }
    else if (cursors.down.isDown)
    {
        payungSprite.body.moveDown(400);
    }
*/
}