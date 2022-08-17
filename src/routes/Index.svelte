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
        speed = 160,
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
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        }, centre = {
            x: config.width / 2,
            y: config.height / 2
        }, assets = {bg: undefined, earth: undefined};
        game = new Phaser.Game(config)
    });

    function preload() {
        // Import assets
        this.load.image('space', 'assets/img/space.png');
        this.load.spritesheet('shark', 'assets/img/shark-sheet.png', {
            frameWidth: 115/2,
            frameHeight: 30
        });
    }

    function create() {
        // Create sprites, keyboard listeners, and text displays
        
        // Add simple background for the game
        assets.spacebg = this.add.image(centre.x, centre.y, 'space').setScale(0.5);

        // The player and its settings
        player = this.physics.add.sprite(100, 250, 'shark').setScale(1).refreshBody();
        player.setCollideWorldBounds(true);
        player.setAngle(0);

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
        arrows = this.input.keyboard.createCursorKeys();
        console.log(arrows, Phaser.Input.Keyboard.KeyCodes)
        
        keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        game.input.mouse.capture = 'true';
    }

    function update() {
        // WASD Movement
        player.setVelocityX(0);
        player.setVelocityY(0);

        if (keys.W.isDown) {
            // Move North
            player.setVelocityY(-speed);
            player.anims.play('move', true);
        }
        if (keys.A.isDown) {
            // Move West
            player.setVelocityX(-speed);
            player.anims.play('move', true);
        }
        if (keys.S.isDown) {
            // Move South
            player.setVelocityY(speed);
            player.anims.play('move', true);
        }
        if (keys.D.isDown) {
            // Move East
            player.setVelocityX(speed);
            player.anims.play('move', true);
        }

        // Arrow Key Rotation
        if (arrows.left.isDown) {
            // Rotate Anti-Clockwise
            player.setAngle(player.angle - speed / 100);;
            player.anims.play('move', true);
        } else if (arrows.right.isDown) {
            // Rotate Clockwise
            player.setAngle(player.angle + speed / 100);;
            player.anims.play('move', true);
        }
    };
</script>

<div bind:this={wrapper} class="flex flex-row items-center justify-evenly w-screen py-5 bg-[#141931] h-screen overflow-hidden">
    <h1 class="text-4xl font-bold text-white rotate-180 vertical-rl font-clean">DGT - Shark Space Game</h1>
</div>

<style>
    .vertical-rl {
        writing-mode: vertical-rl;
    }
</style>