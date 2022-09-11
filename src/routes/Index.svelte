<svelte:head>
    <title>Svelte App</title>
</svelte:head>

<script>
    import Phaser from 'phaser';
    import { onMount } from 'svelte';

    // Initialise Variables
    let gameCanvas,
        state = 'menu',
        killCanvas = false,
        game,
        timer,
        timerVal = 0,
        config = {},
        assets = [],
        centre = { x: 0, y: 0 },
        player,
        earth,
        arrows,
        keys = {
            A: undefined,
            S: undefined,
            D: undefined,
            W: undefined
        };

    function loadGame() {
        endGame();
        state = 'loading';
        killCanvas = false;
        timerVal = 0;
        
        // Declare Config
        config = {
            type: Phaser.AUTO,
            width: 1200,
            height: (1200 / 16) * 9,
            canvas: gameCanvas,
            type: 'webgl',
            // id: 'game',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        }, centre = {
            x: config.width / 2,
            y: config.height / 2
        }, assets = { bg: undefined };

        // Create Phaser Instance with Config
        game = new Phaser.Game(config);

        // Show Game Canvas
        state = 'game';
        // Start Stopwatch
        timer = setInterval(() => {
            timerVal ++;
        }, 1000)
    };

    function preload() {
        // Import assets
        this.load.image('space', 'assets/img/space.png');
        this.load.spritesheet('shark', 'assets/img/shark-sheet.png', {
            frameWidth: 115/2,
            frameHeight: 30
        });
        this.load.image('earth', 'assets/img/earth2.png');
        this.load.image('asteroid', 'assets/img/asteroid.png');
        this.load.image('star', 'assets/img/star.png');

        this.load.audio('bgm1', 'assets/audio/salted-fanfare_dans_lusine.mp3');
    };

    function create() {
        // Music
        // this.music = this.sound.add('bgm1', {
        //     volume: 0.2,
        //     loop: true
        // });

        // this.music.play();
        // Create sprites, keyboard listeners, and text displays
        
        // Add simple background for the game
        assets.spacebg = this.add.image(centre.x, centre.y, 'space').setScale(0.5);

        // Add Earth at the bottom of the viewport 
        earth = this.physics.add.sprite(centre.x, config.height + 1000, 'earth');

        // The player and its settings
        player = this.physics.add.sprite(centre.x, centre.y, 'shark').setScale(1).refreshBody();
        player.setCollideWorldBounds(true);
        player.setAngle(0);
        player.flipX = true;

        // The player's movement animation
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('shark', {
                start: 0,
                end: 1
            }),
            frameRate: 10,
            repeat: 1
        });

        // Add controls listeners and bindings
        player.setDamping(true);
        player.setDrag(0.01);
        player.setMaxVelocity(400);

        arrows = this.input.keyboard.createCursorKeys();
        
        keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        game.input.mouse.capture = 'true';

        // Add Asteroids
        assets.asteroids = this.physics.add.group({
            // key: 'asteroid',
            // repeat: 15,
            // setXY: { x: -500, y: -500, stepX: 150 }
        });
        assets.stars = this.physics.add.group({
            // key: 'asteroid',
            // repeat: 15,
            // setXY: { x: -500, y: -500, stepX: 150 }
        });
        // this.time.delayedCall(1000, () => {
        //     assets.asteroids.children.entries.forEach(asteroid => {
        //         this.physics.moveTo(asteroid, centre.x + (Math.random() * (500 - (-500) + 1) + -500), config.height, Math.random() * (300 - 25 + 1) + 25);
        //         this.physics.add.overlap(earth, asteroid, (earth, asteroid) => {
        //             console.log('bump')
        //             earth.hp -= 20;
        //             asteroid.disableBody(true, true);
        //         }, null, this);
        //     });
        // }, null, this);

        setInterval(() => {
            let asteroid = assets.asteroids.create((Math.random() * (0 - (config.width) + 1) + config.width) - (config.width / 2), -500, 'asteroid');
            this.physics.moveTo(asteroid, centre.x + (Math.random() * (0 - (config.width) + 1) + config.width) - (config.width / 2), config.height, Math.random() * (200 - 25 + 1) + 25);
        // }, Math.random() * (7500 - (-7500) + 1000) + -7500);
        }, 5000);

        setInterval(() => {
            let star = assets.stars.create(-500, (Math.random() * (0 - (config.height) + 1) + config.height) - 500, 'star');
            // star.body.collideWorldBounds = true;
            // star.body.bounce.set(1);
            this.physics.moveTo(star, config.width, (Math.random() * (config.height / 2 - (-config.height / 2) + 1) + -config.height / 2), Math.random() * (200 - 25 + 1) + 25);
        // }, Math.random() * (7500 - (-7500) + 1000) + -7500);
        }, 2000);

        // Add HP indicators
        assets.sharkhp = this.add.text(10, 10, 'HP: ' + player.hp + '%').setFontFamily('Nunito Sans').setFontSize(16);
        player.hp = 100;
        
        assets.earthhp = this.add.text(centre.x, config.height - 60, 'HP: ' + earth.hp + '%').setFontFamily('Nunito Sans').setFontSize(32);
        earth.hp = 100;

        // Add Elapsed Time Display
        assets.timer = this.add.text(10, 10, formatSecs(timerVal)).setFontFamily('Nunito Sans').setFontSize(32);

        // Add Collision Functions
        this.time.delayedCall(1000, () => {
            // When Player collides with asteroid, reduce Player HP and delete asteroid
            this.physics.add.overlap(player, assets.asteroids, (player, asteroid) => {
                if (!player.hp >= 0) {
                    player.hp -= 10;
                };
                asteroid.disableBody(true, true);
            }, null, this);
            
            // When Player collides with star, increase Player HP and delete star
            this.physics.add.overlap(player, assets.stars, (player, star) => {
                if (!player.hp <= 100) {
                    player.hp += 5;
                };
                star.disableBody(true, true);
            }, null, this);

            // When asteroid collides with earth, reduce earth HP and delete asteroid
            this.physics.add.overlap(earth, assets.asteroids, (earth, asteroid) => {
                if (!earth.hp >= 0) {
                    earth.hp -= 10;
                };
                asteroid.disableBody(true, true);
            }, null, this);
        }, null, this);
    };

    function update() {
        // WASD Movement
        // player.setVelocityX(0);
        // player.setVelocityY(0);

        // if (keys.W.isDown) {
        //     // Move North
        //     player.setVelocityY(-speed);
        //     player.anims.play('move', true);
        // }
        // if (keys.A.isDown) {
        //     // Move West
        //     player.setVelocityX(-speed);
        //     player.anims.play('move', true);
        // }
        // if (keys.S.isDown) {
        //     // Move South
        //     player.setVelocityY(speed);
        //     player.anims.play('move', true);
        // }
        // if (keys.D.isDown) {
        //     // Move East
        //     player.setVelocityX(speed);
        //     player.anims.play('move', true);
        // }

        // Arrow Key Rotation
        if (arrows.left.isDown || keys.A.isDown) {
            // Rotate Anti-Clockwise
            // player.setAngle(player.angle - speed / 100);
            player.setAngularVelocity(-200);
            player.anims.play('move', true);
        } else if (arrows.right.isDown || keys.D.isDown) {
            // Rotate Clockwise
            // player.setAngle(player.angle + speed / 100);
            player.setAngularVelocity(200);
            player.anims.play('move', true);
        } else {
            player.setAngularVelocity(0);
        }
        if (arrows.up.isDown || keys.W.isDown) {
            // Move in direction of rotation
            this.physics.velocityFromRotation(player.rotation, 200, player.body.acceleration);
            console.log(player.rotation)
            player.anims.play('move', true);
        } else {
            player.setAcceleration(0);
        }

        // Player HP Tracks Player
        assets.sharkhp.setX(player.x - (assets.sharkhp.width / 2)).setY(player.y - 50).setText('HP: ' + player.hp + '%');
        // Earth HP Updater
        assets.earthhp.setX(centre.x - assets.earthhp.width / 2).setText('HP: ' + earth.hp + '%');
        // Elapsed Time Updater
        assets.timer.setText(formatSecs(timerVal));

        // Player Death Handler
        if (player.hp <= 0) {
            this.physics.moveTo(player, centre.x, config.height + 200, 100);
            player.setCollideWorldBounds(false);
            state = 'playerDeath';
            endGame();
        };

        // Earth Death Handler
        if (earth.hp <= 0) {
            this.physics.moveTo(earth, centre.x, config.height + 1500, 20);
            assets.earthhp.setX(config.height - 1500);
            state = 'earthDeath';
            endGame();
        };
    };

    function endGame() {
        // Reset Game Instance
        game = {};
        killCanvas = true;
        clearInterval(timer);
    };

    function refresh() {
        window.location = window.location;
    };

    function formatSecs(secs, str = false) {
        // Format Seconds into mm:ss String
        let min = Math.floor(secs / 60);
        let sec = Math.floor(secs % 60);
        if (str == true) {
            return min + 'm, ' + sec + 's';
        } else  {
            return String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
        }
    };

    window.addEventListener('keydown',  () => gameCanvas.focus())
</script>

<div class="flex flex-row items-center justify-evenly w-screen bg-[#141931] p-10 h-screen overflow-hidden font-space">
    <!-- <h1 class="text-4xl font-bold text-white rotate-180 vertical-rl">DGT - Shark Space Game</h1> -->

    <div class:hidden={state != 'menu'} class="flex flex-col items-center justify-center text-white bg-blue-900 gameBox">
        <h1 class="text-6xl text-center">Space Shark Game</h1>
        <button class="p-3 px-24 mt-5 text-lg bg-green-400 rounded-xl" on:click={() => loadGame()}>Play Game</button>
    </div>

    {#if killCanvas != true}
    <canvas id="game" class:hidden={state != 'game'} class="gameBox" bind:this={gameCanvas}></canvas>
    {/if}

    <div class:hidden={state != 'playerDeath'} class="flex flex-col items-center justify-center text-white bg-blue-900 gameBox">
        <h1 class="text-6xl text-center">You Died!</h1>
        <h2 class="text-4xl text-center">You defended the earth, but at great personal cost...</h2>
        <h2 class="text-4xl text-center">You survived for {formatSecs(timerVal, true)}.</h2>
        <button class="p-3 px-24 mt-5 text-lg bg-green-400 rounded-xl" on:click={() => refresh()}>Play Again</button>
    </div>

    <div class:hidden={state != 'earthDeath'} class="flex flex-col items-center justify-center text-white bg-blue-900 gameBox">
        <h1 class="text-6xl text-center">You Failed!</h1>
        <h2 class="text-4xl text-center">You failed to defend the earth from asteroids...</h2>
        <h2 class="text-4xl text-center">You survived for {formatSecs(timerVal, true)}.</h2>
        <button class="p-3 px-24 mt-5 text-lg bg-green-400 rounded-xl" on:click={() => refresh()}>Play Again</button>
    </div>
</div>

<style>
    /* .vertical-rl {
        writing-mode: vertical-rl;
    } */

    .gameBox {
        width: 1200px;
        /* height: 675px; */
        /* height: 100%; */
        aspect-ratio: 16 / 9;
    }
</style>