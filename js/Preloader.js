Journey.Preloader = function(game){
    Journey.GAME_WIDTH = window.innerWidth * window.devicePixelRatio;
    Journey.GAME_HEIGHT = window.innerHeight * window.devicePixelRatio;
};
Journey.Preloader.prototype = {
    preload: function() {
        this.stage.backgroundColor = '#B4D9E7';
        this.preloadBar = this.add.sprite((Journey.GAME_WIDTH-311)/2,
            (Journey.GAME_HEIGHT-27)/2, 'preloaderBar');
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('chara', 'assets/nanoha_taiken_blue.png');
		this.load.image('umbrella', 'assets/Umbrella.png');
		this.load.image('drop', 'assets/tes2.png');
		this.load.image('cloudMain', 'assets/cloud-hi.png');
		this.load.image('cloudExtra', 'assets/clouds1.png');
		this.load.image('bushMain', 'assets/bushes-hi.png');
		this.load.image('groundMain', 'assets/ground.png');
		this.load.image('logo', 'assets/Logo.jpg');

 
        // this.load.spritesheet('Journey', 'img/Journey.png', 82, 98);
        // this.load.spritesheet('monster-idle',
        //     'img/monster-idle.png', 103, 131);
        this.load.spritesheet('button-start',
            'assets/button-start.png', 401, 143);
    },
    create: function() {
        this.state.start('MainMenu');
    }
};