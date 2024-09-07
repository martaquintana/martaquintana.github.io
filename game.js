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
    this.load.image('sky', 'images/game/sky.png');
    this.load.image('mountains', 'images/game/mountains.png');

    this.load.image('ground', 'images/game/ground.png');
    this.load.image('wood', 'images/game/wood.png');
    this.load.image('tree', 'images/game/tree.png');
    this.load.image('stone', 'images/game/stone.png');

    this.load.spritesheet('dude',
        'images/game/explorer.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

var platforms;
var logs;
var restartButton;

function create ()
{
    this.add.image(500, 100, 'sky').setDisplaySize(1000, 400);
    this.add.image(500, 100, 'mountains').setDisplaySize(1000, 400);



    platforms = this.physics.add.staticGroup();
    ground = this.add.tileSprite(500, 320, 1000, 80, 'ground'); // Utilizar tileSprite en lugar de image
    ground.setOrigin(0.5, 0.5);
    platforms.create(500, 320, 'ground').setScale(3).refreshBody(); // Añadir un sprite estático para la colisión
    platforms.children.iterate(function (platform) {
        platform.setSize(1000, 80); // Ajustar el tamaño de la colisión
        platform.setAlpha(0); // Hacer el sprite invisible si solo se usa para colisión
    });
    logs = this.physics.add.group({
        defaultKey: 'tree',
        maxSize: 10
    });

    player = this.physics.add.sprite(200, 200, 'dude');

    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('dude', { start: 1, end: 2 }),
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1

    });



    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, logs, hitLog, null, this);
    this.physics.add.collider(logs, platforms);

    cursors = this.input.keyboard.createCursorKeys();
    player.anims.play('turn');
    spawnLog();

    restartButton = this.add.text(500, 150, 'Restart', {
        fontSize: '32px',
        fontFamily: 'Arial', // Puedes cambiar la fuente
        color: '#fff', // Color del texto
        backgroundColor: '#000', // Fondo del texto
        padding: {
            x: 20,
            y: 10
        },
        borderRadius: 5, // Redondea las esquinas
        align: 'center' // Alineación del texto
    });
        restartButton.setOrigin(0.5, 0.5);
    restartButton.setInteractive();
    restartButton.visible = false; // Ocultar el botón inicialmente

    // Definir lo que pasa cuando se hace clic en el botón de reinicio
    restartButton.on('pointerdown', function () {
        this.scene.restart(); // Reiniciar la escena actual
    }, this);

}
function spawnLog()
{
    var x = Phaser.Math.Between(900, 900);
    var y = Phaser.Math.Between(150, 150);

    var textures = ['tree', 'stone', 'wood'];
    var selectedTexture = Phaser.Math.RND.pick(textures);

    var velocityX = Phaser.Math.Between(-300, -100);

    var log = logs.get(x, y, selectedTexture);
    if (log)
    {
        log.setAlpha(1);
        log.setScale(1);
        log.setVelocityX(velocityX);
        log.setCollideWorldBounds(true);
        log.setBounce(0);

        log.setCollideWorldBounds(true);
        log.body.onWorldBounds = true;
        log.body.world.on('worldbounds', function (body) {
            if (body.gameObject === log && body.blocked.left) {
                log.destroy();
                spawnLog();

            }});
    }

}
function hitLog (player, log)
{
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.stop();
    console.log('Game Over');

    ground.tilePositionX = ground.tilePositionX;

    logs.children.iterate(function (log) {
        log.setVelocityX(0);
        log.anims.stop();
    });
    restartButton.visible = true;
    restartButton.on('pointerover', function () {
        restartButton.setStyle({ fill: '#f39c12' }); // Cambiar color al pasar el ratón
    });

    restartButton.on('pointerout', function () {
        restartButton.setStyle({ fill: '#fff' }); // Volver al color original
    });
}



function update ()
{
    if (!this.physics.world.isPaused) {
        ground.tilePositionX += 1;

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
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-300);
    }



}
