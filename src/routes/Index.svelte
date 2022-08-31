<svelte:head>
    <title>Svelte App</title>
</svelte:head>

<script>
    import Phaser from 'phaser';
    import { onMount } from 'svelte';
    let wrapper,
        game,
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

    onMount(() => {
        config = {
            type: Phaser.AUTO,
            width: 1200,
            height: (1200 / 16) * 9,
            parent: wrapper,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            // physics: {
            //     default: 'matter',
            //     arcade: {
            //         debug: false
            //     }
            // },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        }, centre = {
            x: config.width / 2,
            y: config.height / 2
        }, assets = { bg: undefined };
        game = new Phaser.Game(config)
    });

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
    };

    function create() {
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
            let asteroid = assets.asteroids.create((Math.random() * (500 - (-500) + 1) + -500), -500, 'asteroid');
            this.physics.moveTo(asteroid, centre.x + (Math.random() * (500 - (-500) + 1) + -500), config.height, Math.random() * (200 - 25 + 1) + 25);
        // }, Math.random() * (7500 - (-7500) + 1000) + -7500);
        }, 5000);

        setInterval(() => {
            let star = assets.stars.create(-500, (Math.random() * (500 - (-500) + 1) + -500), 'star');
            this.physics.moveTo(star, config.width, (Math.random() * (500 - (-500) + 1) + -500), Math.random() * (200 - 25 + 1) + 25);
        // }, Math.random() * (7500 - (-7500) + 1000) + -7500);
        }, 2000);

        // Add HP indicators
        assets.sharkhp = this.add.text(10, 10, 'HP: ' + player.hp + '%').setFontFamily('Nunito Sans').setFontSize(16);
        player.hp = 100;
        
        assets.earthhp = this.add.text(centre.x, config.height - 60, 'HP: ' + earth.hp + '%').setFontFamily('Nunito Sans').setFontSize(32);
        earth.hp = 100;

        // Add HP Collision Functions
        this.time.delayedCall(1000, () => {
            this.physics.add.overlap(player, assets.asteroids, (player, asteroid) => {
                player.hp -= 10;
                asteroid.disableBody(true, true);
            }, null, this);
            this.physics.add.overlap(player, assets.stars, (player, star) => {
                player.hp += 5;
                star.disableBody(true, true);
            }, null, this);
            this.physics.add.overlap(earth, assets.asteroids, (earth, asteroid) => {
                earth.hp -= 10;
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
    };
</script>

<div bind:this={wrapper} class="flex flex-row items-center justify-evenly w-screen bg-[#141931] h-screen overflow-hidden">
    <h1 class="text-4xl font-bold text-white rotate-180 vertical-rl font-clean">DGT - Shark Space Game</h1>
</div>

<style>
    .vertical-rl {
        writing-mode: vertical-rl;
    }
</style>