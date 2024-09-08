var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 300,
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/game/sky.png');
    this.load.image('mountains', 'assets/game/mountains.png');
    this.load.image('ground', 'assets/game/ground.png');
    this.load.image('wood', 'assets/game/wood.png');
    this.load.image('tree', 'assets/game/tree.png');
    this.load.image('stone', 'assets/game/stone.png');
    this.load.image('star', 'assets/game/star.png');
    this.load.image('restartButton', 'assets/game/restart.png');

    this.load.spritesheet('explorer',
        'assets/game/explorer.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

var platforms;
var logs;
var restartButton;
var starTimer;
var gameOverText;
var youWinText;
var gameInfo;
var gameInfoTimer;
var scoreText;
var score;

function create ()
{
    score = 0;

    this.add.image(500, 100, 'sky').setDisplaySize(1000, 400);
    this.add.image(500, 100, 'mountains').setDisplaySize(1000, 400);

    platforms = this.physics.add.staticGroup();
    ground = this.add.tileSprite(500, 320, 1000, 80, 'ground');
    ground.setOrigin(0.5, 0.5);
    platforms.create(500, 320, 'ground').setScale(3).refreshBody();
    platforms.children.iterate(function (platform) {
        platform.setSize(1000, 80);
        platform.setAlpha(0);
    });

    logs = this.physics.add.group({
        defaultKey: 'tree',
        maxSize: 10
    });

    player = this.physics.add.sprite(200, 200, 'explorer');

    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('explorer', { start: 1, end: 2 }),
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('explorer', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1

    });



    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, logs, hitLog, null, this);
    this.physics.add.collider(logs, platforms);

    cursors = this.input.keyboard.createCursorKeys();
    player.anims.play('turn');
    spawnLog();

   restartButton = this.add.image(500, 200, 'restartButton').setInteractive();
   restartButton.setScale(0.1);
   restartButton.setTint(0xfff);

    restartButton.setVisible(false);
    restartButton.on('pointerdown', function () {
        this.scene.restart();
    }, this);
   restartButton.on('pointerover', function () {
        this.setTint(0x000);
        this.setScale(0.12);
    });

    restartButton.on('pointerout', function () {
        this.setScale(0.1);
       this.setTint(0xfff);

    });
    star = this.physics.add.sprite(950, 150, 'star');
    star.setScale(1.5);

    star.setVisible(false);
    star.setCollideWorldBounds(true);
    starTimer = this.time.delayedCall(60000, function() {
        if(!youWinText.visible && !gameOverText.visible){
            star.setVisible(true);
            star.setPosition(960,170);
            star.setVelocityX(-100);
            star.body.onWorldBounds = true;

            star.body.world.on('worldbounds', (body) => {
                if (body.gameObject === star && body.blocked.left) {
                    star.destroy();
                    this.physics.pause();
                    gameOver.call(this);
                }
            });
            }

    }, [], this);

    this.physics.add.overlap(player, star, collectStar, null, this);
    this.physics.add.collider(star, platforms);
    gameOverText = this.add.text(500, 90, 'Game Over', {
        fontSize: '72px',
        fill: '#ff0000',
        fontFamily: 'Arial, sans-serif',
        align: 'center',
        fontWeight: 800,

    }).setOrigin(0.5, 0.5);
    gameOverText.setVisible(false);

    youWinText = this.add.text(500, 90, 'You found the star! :)', {
        fontSize: '72px',
        fill: '#00ff00',
        fontFamily: 'Arial, sans-serif',
        align: 'center',
        fontWeight: 800,
    }).setOrigin(0.5, 0.5);
    youWinText.setVisible(false);

    gameInfo = this.add.text(500, 20, 'Find the star: Press space to jump and dodge the obstacles.', {
        fontSize: '18px',
        fill: '#fff',
        fontFamily: 'Arial, sans-serif',
        align: 'center',
    }).setOrigin(0.5, 0.5);
    gameInfo.setVisible(true);

    gameInfoTimer = this.time.delayedCall(10000, function() {
        gameInfo.setVisible(false);
    }, [], this);
    scoreText = this.add.text(900, 20, 'Score: 0', {
        fontSize: '18px',
        fill: '#fff',
        fontFamily: 'Arial, sans-serif',
        align: 'center',
    }).setOrigin(0.5, 0.5);
}

function collectStar(player, star) {
    this.physics.pause();
    player.anims.stop();
    player.setTint(0x00ff00);
    star.setVisible(false);
    youWinText.setVisible(true);
    restartButton.visible = true;
}

function stopGame(player, star) {
    this.physics.pause();
    player.anims.stop();
    player.setTint(0x00ff00);
    star.setVisible(false);

}
function spawnLog()
{
    var x = 960;
    var y = 170;

    var textures = ['tree', 'stone', 'wood'];
    var selectedTexture = Phaser.Math.RND.pick(textures);
    var velocityX = Phaser.Math.Between(-300, -100);

    var log = logs.get(x, y, selectedTexture);
    if (log)
    {
        log.setAlpha(1);
        if (selectedTexture === 'tree'){
            log.setScale(1.4);
        }else{
            log.setScale(0.8);
        }
        log.setVelocityX(velocityX);
        log.setCollideWorldBounds(true);
        log.setBounce(0);

        log.setCollideWorldBounds(true);
        log.body.onWorldBounds = true;
        log.body.world.on('worldbounds', function (body) {
            if (body.gameObject === log && body.blocked.left) {
                log.destroy();
                if (selectedTexture === 'tree'){
                    score += 30
                }else if (selectedTexture === 'wood'){
                    score += 20
                }else{
                    score += 10
                }

                spawnLog();

            }});
    }

}
function hitLog (player, log)
{
    this.physics.pause();
    gameOver()
    logs.children.iterate(function (log) {
        log.setVelocityX(0);
        log.anims.stop();
    });
}

function gameOver ()
{
    player.setTint(0xff0000);
    player.anims.stop();
    if (!youWinText.visible) {
        gameOverText.setVisible(true);
    }
    ground.tilePositionX = ground.tilePositionX;
    gameInfo.setVisible(true);
    restartButton.visible = true;
}

function update ()
{
    if (!this.physics.world.isPaused) {
        ground.tilePositionX += 1;
        score += 1;
        scoreText.setText(score.toString().padStart(6, '0'));

    if (!player.body.blocked.down)
    {
        if (player.anims.currentAnim.key !== 'up') {
            player.anims.play('up', true);
        }
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn', true);
    }

    }
    if (cursors.space.isDown && player.body.touching.down)
    {
        player.setVelocityY(-300);
    }

}
