<svelte:head>
    <title>DGT - Wāhi Mango</title>
</svelte:head>

<script>
    import Phaser from 'phaser';
    
    // Initialise Variables
    let gameCanvas,
        state = 'menu',
        killCanvas = false,
        game,
        ready = false,
        music,
        timer,
        timerVal = 0,
        highscore = window.localStorage.getItem('highscore') || 0,
        config = {},
        assets = [],
        centre = { x: 0, y: 0 },
        player,
        earth,
        arrows,
        stats = { stars: 0, deflections: 0, misses: 0 },
        keys = {
            A: undefined,
            S: undefined,
            D: undefined,
            W: undefined
        };

    // Save highscore to browser storage when local variable updated
    $: window.localStorage.setItem('highscore', highscore);

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
            // If Page is visible, increment timer by 1 second
            if (!document.hidden) {
                timerVal ++;
            };
        }, 1000)
    };

    function preload() {
        // Load Background
        this.load.image('space', './assets/img/space2.png');
        
        // Load Player Asset
        this.load.spritesheet('shark', './assets/img/shark-sheet.png', {
            frameWidth: 115/2,
            frameHeight: 30
        });

        // Load environment, boost, and enemy assets
        this.load.image('earth', './assets/img/earth2.png');
        this.load.image('asteroid', './assets/img/asteroid.png');
        this.load.image('star', './assets/img/star.png');

        // Load track list
        this.load.audio('fanfare_dans_lusine', './assets/audio/salted-fanfare_dans_lusine.mp3');
        this.load.audio('castles_wars', './assets/audio/salted-castles_wars.mp3');
        this.load.audio('traps', './assets/audio/salted-traps.mp3');
        this.load.audio('burglar_theme', './assets/audio/salted-burglar_theme.mp3');
    };

    function create() {
        ready = false;

        // Play first song
        playBgm();
        // Detect song end, play next song
        music.on('complete', () => playBgm());
        
        // Add simple background for the game
        assets.spacebg = this.add.image(centre.x, centre.y, 'space').setScale(0.5);

        // Add Earth at the bottom of the viewport 
        earth = this.physics.add.sprite(centre.x, config.height + 1000, 'earth');
        earth.setCircle(1100);

        // The player and its initial settings
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

        // Set motion drift and velocity settings
        player.setDamping(true);
        player.setDrag(0.01);
        player.setMaxVelocity(400);

        // Add arrow key listeners
        arrows = this.input.keyboard.createCursorKeys();
        
        // Add WAD key listeners
        keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        // Create asteroid and star physics groups
        assets.asteroids = this.physics.add.group();
        assets.stars = this.physics.add.group();

        setInterval(() => {
            // If page is visible, spawn asteroid at random position off-screen in top
            if (!document.hidden) {
                let asteroid = assets.asteroids.create(Math.floor(Math.random() * (0 - config.width + 1)) + config.width, -500, 'asteroid');
                asteroid.angle = Math.random() * (360 - 0 + 1) + 0;
                this.physics.moveTo(asteroid, Math.floor(Math.random() * (0 - (config.width / 2) + 1) + (config.width / 2)) + (config.width / 2), config.height, Math.random() * (200 - 25 + 1) + 25);
            }
        }, 5000);

        setInterval(() => {
            // If page is visible, spawn star at random position off-screen in left
            if (!document.hidden) {
                let star = assets.stars.create(-500, Math.floor(Math.random() * (0 - config.height + 1)) + config.height, 'star');
                star.angle = Math.random() * (360 - 0 + 1) + 0;
                this.physics.moveTo(star, config.width, Math.floor(Math.random() * (0 - (config.height) + 1) + config.height), Math.random() * (200 - 25 + 1) + 25);
            }
        }, 2000);

        // Add HP indicators
        assets.sharkhp = this.add.text(10, 10, 'HP: ' + player.hp + '%').setFontFamily('Overfield').setFontSize(16);
        player.hp = 100;
        
        assets.earthhp = this.add.text(centre.x, config.height - 60, 'HP: ' + earth.hp + '%').setFontFamily('Overfield').setFontSize(32);
        earth.hp = 100;

        // Add Elapsed Time Display
        assets.timer = this.add.text(10, 10, formatSecs(timerVal)).setFontFamily('Overfield').setFontSize(32);

        // Add Collision Functions
        this.time.delayedCall(1000, () => {
            // When Player collides with asteroid, reduce Player HP and delete asteroid
            this.physics.add.overlap(player, assets.asteroids, async (player, asteroid) => {
                player.hp -= 10;
                stats.deflections ++;
                asteroid.disableBody(true, true);
            }, null, this);
            
            // When Player collides with star, increase Player HP and delete star
            this.physics.add.overlap(player, assets.stars, async (player, star) => {
                player.hp += 5;
                stats.stars ++;
                star.disableBody(true, true);
            }, null, this);

            // When asteroid collides with earth, reduce earth HP and delete asteroid
            this.physics.add.overlap(earth, assets.asteroids, async (earth, asteroid) => {
                earth.hp -= 10;
                stats.misses ++;
                asteroid.disableBody(true, true);
            }, null, this);
        }, null, this);

        ready = true;
    };

    function update() {        
        // WASD Movement (Unused, saved just incase)
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

        // Min and Max Variable Bounds
        if (player.hp < 0) player.hp = 0;
        if (player.hp > 100) player.hp = 100;
        if (earth.hp < 0) earth.hp = 0;
        if (earth.hp > 100) earth.hp = 100;

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
        assets.sharkhp.setX(player.x - (assets.sharkhp.width / 2)).setY(player.y - 50).setText('HP: ' + player.hp + '%').setFontFamily('Overfield');
        // Earth HP Updater
        assets.earthhp.setX(centre.x - assets.earthhp.width / 2).setText('HP: ' + earth.hp + '%').setFontFamily('Overfield');
        // Elapsed Time Updater
        assets.timer.setText(formatSecs(timerVal)).setFontFamily('Overfield');

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

        earth.angle += 0.02;
    };

    function endGame() {
        // Reset Game Instance
        game = {};
        killCanvas = true;
        clearInterval(timer);

        // Store High Score
        if (timerVal > highscore) {
            highscore = timerVal;
        };
    };

    let cutsceneShot = 'none';
    async function loadCutscene() {
        // Load Shot List
        let shots = [0, 1, 2, 3];
        state = 'cutscene';
        // For each shot, check if cutscene is visible, then show shot and wait 10 secs
        for (const i of shots) {
            if (state == 'cutscene') {
                cutsceneShot = i;
                await sleep(10);
            };
        };
        // If cutscene is visible and shots are over, play game
        if (state == 'cutscene') {
            cutsceneShot = 'none';
            await sleep(1);
            loadGame();
        };
    };

    function refresh() {
        window.location = window.location;
    };

    function sleep(s) {
        return new Promise(resolve => setTimeout(resolve, (s * 1000)));
    };

    function playBgm() {
        let tracks = ['fanfare_dans_lusine', 'castles_wars', 'traps', 'burglar_theme'];
        let random = Math.floor(Math.random() * (tracks.length - 1 + 1)) + 1;
        music = game.sound.add(tracks[random - 1], {
            volume: 0.2
        });

        music.play();
    }

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

    window.addEventListener('keydown',  () => document.querySelector('#game').focus())
</script>

<div id="mainbox" class="flex flex-row items-center w-screen h-screen overflow-hidden select-none justify-evenly font-space">
    <!-- Main Menu -->
    <div class:hidden={state != 'menu'} class="flex flex-col items-center justify-center px-20 py-10 text-white bg-blue-800 gameBox">
        <div class="flex flex-col items-center justify-center flex-1 w-full">
            <h1 id="title" class="text-6xl text-center header">W<span class="border-t-8 border-white">a</span>hi Mango</h1>
            {#if highscore > 0}<h2 class="text-4xl text-center">Your high score is {formatSecs(highscore, true)}.</h2>{/if}

            <div class="flex flex-row items-center justify-center w-3/4">
                <button class="flex-1 p-3 px-24 mt-5 text-lg bg-green-600 hover:bg-green-500 rounded-xl" on:click={() => loadCutscene()}>Play Game</button>
                <button class="flex-1 p-3 px-24 mt-5 ml-5 text-lg bg-green-600 hover:bg-green-500 rounded-xl" on:click={() => state = 'tutorial'}>How to Play</button>
            </div>
        </div>

        <!-- Copyright Statement, Credits Link -->
        <h2 class="text-2xl text-center select-none font-round">&copy; IzMichael 2022 - <a href="https://izmichael.com" class="cursor-pointer hover:underline">izmichael.com</a> - <span on:click={() => state = 'credits'} class="cursor-pointer hover:underline">Credits & Attribution</span></h2>
    </div>

    <!-- Tutorial Page -->
    <div class:hidden={state != 'tutorial'} class="flex flex-col items-center justify-center px-20 py-10 text-white bg-blue-800 gameBox">
        <h1 class="mb-3 text-6xl text-center header">How to Play</h1>
        <!-- Available Keys -->
        <h2 class="mt-5 mb-3 text-2xl text-center font-round">You can use
             <img src="./assets/img/a.svg" class="inline-block w-8 aspect-square" title="'Letter A' Key" alt="Keyboard Key" />
             <img src="./assets/img/w.svg" class="inline-block w-8 aspect-square" title="'Letter W' Key" alt="Keyboard Key" />
             <img src="./assets/img/d.svg" class="inline-block w-8 aspect-square" title="'Letter D' Key" alt="Keyboard Key" />
             or the
             <img src="./assets/img/left.svg" class="inline-block w-8 aspect-square" title="'Left Arrow' Key" alt="Keyboard Key" />
             <img src="./assets/img/up.svg" class="inline-block w-8 aspect-square" title="'Up Arrow' Key" alt="Keyboard Key" />
             <img src="./assets/img/right.svg" class="inline-block w-8 aspect-square" title="'Right Arrow' Key" alt="Keyboard Key" />
             arrow keys to move.</h2>
        <!-- Key Assignments -->
        <h2 class="mb-3 text-2xl text-center font-round">The
             <img src="./assets/img/w.svg" class="inline-block w-8 aspect-square" title="'Letter W' Key" alt="Keyboard Key" />
             and
             <img src="./assets/img/up.svg" class="inline-block w-8 aspect-square" title="'Up Arrow' Key" alt="Keyboard Key" />
             keys propel you forwards, the
             <img src="./assets/img/a.svg" class="inline-block w-8 aspect-square" title="'Letter A' Key" alt="Keyboard Key" />
             and
             <img src="./assets/img/left.svg" class="inline-block w-8 aspect-square" title="'Left Arrow' Key" alt="Keyboard Key" />
             keys turn you anti-clockwise, and the
             <img src="./assets/img/d.svg" class="inline-block w-8 aspect-square" title="'Letter D' Key" alt="Keyboard Key" />
             and
             <img src="./assets/img/right.svg" class="inline-block w-8 aspect-square" title="'Right Arrow' Key" alt="Keyboard Key" />
             keys turn you clockwise.</h2>
        <!-- Gameplay Instructions and Health Mechanics -->
        <h2 class="mb-3 text-2xl text-center font-round">Your goal is to defend Earth by destroying the asteroids before they hit the planet.</h2>
        <h2 class="mb-3 text-2xl text-center font-round">When Māngōroa (you, the shark) collides with an asteroid, you destroy it.<br>Destroying an asteroid will cause you to lose 10% of your Health Metre.</h2>
        <h2 class="mb-3 text-2xl text-center font-round">You can regain your health by consuming stars. To consume a star, simply collide with it.<br>Each star will restore 5% of your Health Metre.</h2>
        <h2 class="mb-3 text-2xl text-center font-round">When an asteroid collides with Earth, Earth will lose 10% of its Health Metre.<br>There is no way to restore Earth's Health Metre.</h2>

        <!-- Return and Play Buttons -->
        <div class="flex flex-row items-center justify-center w-3/4">
            <button class="flex-1 p-3 px-24 mt-5 text-lg bg-green-600 hover:bg-green-500 rounded-xl" on:click={() => loadCutscene()}>Play Game</button>
            <button class="flex-1 p-3 px-24 mt-5 ml-5 text-lg bg-green-600 hover:bg-green-500 rounded-xl" on:click={() => state = 'menu'}>Back to Menu</button>
        </div>
    </div>

    <!-- Credits Page -->
    <div class:hidden={state != 'credits'} class="flex flex-col items-center justify-center px-20 py-10 text-white bg-blue-800 gameBox">
        <h1 class="text-6xl text-center header">Credits & Attribution</h1>
        
        <h2 class="mt-3 text-2xl text-center">Music by <a href="https://salted.bandcamp.com/album/craftedmusic" class="cursor-pointer hover:underline font-clean">Salted</a>.</h2>
        <h2 class="text-2xl text-center">Keyboard Icons from <a href="https://github.com/q2apro/keyboard-keys-speedflips" class="cursor-pointer hover:underline font-clean">github.com/q2apro/keyboard-keys-speedflips</a>.</h2>
        <h2 class="text-2xl text-center">Main Game Space Background by <a href="https://opengameart.org/content/space-background-7" class="cursor-pointer hover:underline font-clean">drakzlin</a>.</h2>
        <h2 class="text-2xl text-center">App Space Background by <a href="https://opengameart.org/content/space-background-7" class="cursor-pointer hover:underline font-clean">drakzlin</a>.</h2>
        <h2 class="text-2xl text-center">Ocean Cutscene Background by <a href="https://opengameart.org/content/ocean-background" class="cursor-pointer hover:underline font-clean">KnoblePersona</a>.</h2>

        <!-- Return Button -->
        <div class="flex flex-row items-center justify-center w-3/4">
            <button class="flex-1 p-3 px-24 mt-5 ml-5 text-lg bg-green-600 hover:bg-green-500 rounded-xl" on:click={() => state = 'menu'}>Back to Menu</button>
        </div>
    </div>

    <!-- Game Canvas -->
    {#if killCanvas != true}
    <canvas id="game" class:hidden={state != 'game'} class="bg-blue-800 gameBox" bind:this={gameCanvas}></canvas>
    {/if}
    
    <!-- Cutscene Page -->
    <div class:hidden={state != 'cutscene'} id="cutsceneWrapper" class="relative flex flex-col items-center justify-center overflow-hidden text-white bg-gray-900 gameBox" on:click={async () => { cutsceneShot = 'none'; await sleep(1); loadGame(); }}>
        <!-- Page 1 -->
        <div class:opacity-0={cutsceneShot != 0} class="absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-1000 ease-in-out">
            <img src="./assets/img/cutscene1.png" class="object-cover object-center w-full overflow-hidden" alt="Cutscene Shot 1">
            <h1 class="p-10 text-2xl text-center font-round">Long ago, on an island quite close to here, there lived a group of people. These people were the Māori.</h1>
        </div>

        <!-- Page 2 -->
        <div class:opacity-0={cutsceneShot != 1} class="absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-1000 ease-in-out">
            <img src="./assets/img/cutscene2.png" class="object-cover object-center w-full overflow-hidden" alt="Cutscene Shot 2">
            <h1 class="p-10 text-2xl text-center font-round">The Māori were afraid that their Earth could be harmed by things like stars and asteroids, and didn't know what to do.</h1>
        </div>

        <!-- Page 3 -->
        <div class:opacity-0={cutsceneShot != 2} class="absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-1000 ease-in-out">
            <img src="./assets/img/cutscene3.gif" class="object-cover object-center w-full overflow-hidden" alt="Cutscene Shot 3">
            <h1 class="p-10 text-2xl text-center font-round">Until one day, when the Demigod Maui had an idea. Maui proposed that they send a shark, Māngōroa, into space to protect the tribes back on earth.</h1>
        </div>

        <!-- Page 4 -->
        <div class:opacity-0={cutsceneShot != 3} class="absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-1000 ease-in-out">
            <img src="./assets/img/cutscene4.png" class="object-cover object-center w-full overflow-hidden" alt="Cutscene Shot 4">
            <h1 class="p-10 text-2xl text-center font-round">And so they did, and Māngōroa is still up in space today, protecting the Earth from anything that may cause it harm.</h1>
        </div>

        <!-- Skip Btn -->
        <p class:opacity-0={cutsceneShot == 'none'} class="absolute bottom-0 right-0 z-50 p-2 text-sm italic text-gray-500">Click anywhere to skip</p>
    </div>

    <!-- Player Death Page -->
    <div class:hidden={state != 'playerDeath'} class="flex flex-col items-center justify-center px-20 py-10 text-white bg-blue-800 gameBox">
        <h1 class="text-6xl text-center header">You Died!</h1>
        <h2 class="mb-5 text-4xl text-center">You defended the earth, but at great personal cost...</h2>
        <h2 class="text-4xl text-center">You survived for {formatSecs(timerVal, true)}.</h2>
        <h2 class="text-4xl text-center">Your high score is {formatSecs(highscore, true)}.</h2>
        <h2 class="text-4xl text-center">You collected {stats.stars} stars.</h2>
        <h2 class="text-4xl text-center">You deflected {stats.deflections} asteroids, but missed {stats.misses}.</h2>
        <button class="p-3 px-24 mt-5 text-lg bg-green-600 hover:bg-green-500 rounded-xl" on:click={() => refresh()}>Back to Menu</button>
    </div>

    <!-- Earth Death Page -->
    <div class:hidden={state != 'earthDeath'} class="flex flex-col items-center justify-center px-20 py-10 text-white bg-blue-800 gameBox">
        <h1 class="text-6xl text-center header">You Failed!</h1>
        <h2 class="mb-5 text-4xl text-center">You failed to defend the earth from asteroids...</h2>
        <h2 class="text-4xl text-center">You survived for {formatSecs(timerVal, true)}.</h2>
        <h2 class="text-4xl text-center">Your high score is {formatSecs(highscore, true)}.</h2>
        <h2 class="text-4xl text-center">You collected {stats.stars} stars.</h2>
        <h2 class="text-4xl text-center">You deflected {stats.deflections} asteroids, but missed {stats.misses}.</h2>
        <button class="p-3 px-24 mt-5 text-lg bg-green-400 rounded-xl" on:click={() => refresh()}>Back to Menu</button>
    </div>

    <!-- Debug Output for Unit Testing -->
    {#if ready == true}
        <p class="hidden" id="readyState">Ready: {ready}</p>
    {/if}
</div>

<style global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    #mainbox {
        position: relative;
        overflow: hidden;
    }

    /* App Space Background */
    #mainbox::before {
        content: "";
        position: absolute;
        width: 120vw;
        aspect-ratio: 1 / 1;
        z-index: -1;
        background-image: url('../assets/img/space2.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        /* Apply Continuous Spin Animation */
        animation: spin infinite 500s linear;
    }

    /* Continuous Spin Animation */
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .gameBox {
        width: 1200px;
        max-height: 675px;
        aspect-ratio: 16 / 9;
        border-radius: 0.75rem;
        @apply border-4 border-gray-400 shadow-xl;
    }
</style>