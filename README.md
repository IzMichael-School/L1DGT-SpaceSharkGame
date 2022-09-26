# L1DGT-SpaceSharkGame
## Progress and To-Do Lists

I am using a software called Todoist to track my progress and organise my ideas. Todoist allows me to show my tasks in a simple ‘To-Do List’ format alongside a ‘Kanban Board’ format. I have added all of the different components of my game to the list, and I add new ideas as I think of them.

I have shared a link to my Todoist board with my Teacher, Mr. Lier. I have also attached a screenshot of my Todoist board half-way through the project, and at the time of submission.

## Testing

For my testing, I have used a JavaScript library called Playwright to automate my tests and execute them after each change.

I am testing for UI elements, such as buttons and titles loading in and working. I am testing that all the fonts I have used are displaying correctly. I am testing that you can navigate through the pages of the menus, and that the controls inside the game work. I am testing that all the external links for credits and attributions, along with my white-label, are all functional. I am testing that the asteroids will successfully damage earth if given the opportunity, and that the earth can die after too many asteroid collisions.

## Version Tracking

As with all other programming projects I undertake, I have created a GitHub repository for this project. Throughout the development of my game, I have committed my changes to this repository and added appropriate commit messages.

You can find the GitHub repository at [https://github.com/IzMichael-School/L1DGT-SpaceSharkGame](https://github.com/IzMichael-School/L1DGT-SpaceSharkGame)

## Timeframes and Planning

I have had to factor in my other commitments, such as other classes, so my estimated timelines are more towards the end of the project’s pipeline than the start. I fell ill during the project’s development time, and subsequently lost 2 weeks of time to work on my game. The order that I completed tasks changed slightly so dates will not line up perfectly with planning. Some tasks took longer than I expected, so dates for subsequent tasks were shifted.

| Task | Planned Completion Date | Actual Completion Date | GitHub Commit Date |
| --- | --- | --- | --- |
| Phaser Scaffolding | Aug 1 | Aug 10 | Aug 18 |
| Shark Character Design | Aug 2 | July 27 | Aug 18 |
| Player Controls V1 (cardinals) | Aug 4 | Aug 18 | Aug 18 |
| Player Health | Aug 7 | Aug 18 | Aug 18 |
| Player Controls V2 (rotation, forwards) | Aug 10 | Aug 29 | Aug 30 |
| Add Earth | Aug 12 | Aug 13 | Aug 18 |
| Earth HP | Aug 13 | Aug 25 | Aug 30 |
| Asteroids | Aug 15 | Aug 29 | Aug 30 |
| Stars | Aug 18 | Aug 30 | Aug 32 |
| Death Menus | Aug 25 | Sep 10 | Sep 11 |
| Timer/Stopwatch | Aug 26 | Sep 11 | Sep 11 |
| Cutscene | Aug 29 | Sep 18 | Sep 19 |
| Custom Fonts | Aug 31 | Sep 11 | Sep 11 |
| Music | Sep 5 | Sep 15 | Sep 17 |
| Tutorial | Sep 7 | Sep 17 | Sep 18  |
| Credits & Attributions | Sep 9 | Sep 18 | Sep 18 |
| Automated Tests | Sep 12 | Sep 18 | Sep 19 |
| Earth Damage Animation | Sep 16 | [Abandoned] | [Abandoned] |
| Star Consumption Stats | Sep 17 | Sep 20 | Sep 27 |
| Asteroid Deflection Stats | Sep 17 | Sep 20 | Sep 27 |
| Asteroids Missed Stats | Sep 17 | Sep 20 | Sep 27 |
| Star Consumed Animation | Sep 20 | [Abandoned] | [Abandoned] |
| Asteroid Destroyed Animation | Sep 24 | [Abandoned] | [Abandoned] |

### My Original Plan

You can clearly note:

- The Shark, which is the player’s avatar
- The Earth, which you need to defend
- The Stars, which are what boosts the Player’s HP and stats
- The Asteroids, which damage the Player and Earth.

You're a shark, and you're flying around in space, trying to defend earth.

Each level, small stars will come into your area, and you can click on them to eat them to gain HP or some other boost (speed, etc.).

Also during each level, large asteroids will come into range, heading towards earth at the bottom of the map. Your goal is to intercept them and let them hit you. Doing so will cause you to lose HP, but it destroys the asteroid and prevents it from damaging Earth.

As you progress through the levels, the stars will give you higher HP boosts and better upgrades, and the asteroids will get larger, faster, more damage, etc.

If you let an asteroid hit earth, its HP goes down and it only goes up at the end of each level. If it runs out, it explodes and you lose. if you run out of HP, you die and lose

### Required Resources

To create this game, I will need an advanced knowledge of the Python programming language, and a working understanding of the `pygame` library. I may need to pay someone to create the art and assets for my game, such as the asteroids, stars, Shark, and Earth, but these could be created by myself if needed.

To ensure that the required assets are available in time for the game’s scheduled release, I will hire someone to create the artwork early on in the project, and ensure that the artist is aware that the images are needed by a specific date, ideally a few weeks before release.

### Game Attributes and Features

Though my research and understanding of Video Games, I know that my game will require the following:

- A functional controls system
- A main menu, help page, and loading screen
- Sprite assets for the Shark character, Earth, asteroids, and stars
- A functional health and death system
- Death and win screens, with totals for stars eaten and asteroids deflected
- Background Art of space with stars
- Integration with Maori mythology and culture
- Background music and sound effects for eating and damage
- Level progress saving and loading
- A credits page, to attribute the artwork and music to the artists

### The Final Outcome

You can clearly note:

- The Shark, which is the player’s avatar
- The Earth, which you need to defend
- The Stars, which are what boosts the Player’s HP
- The Asteroids, which damage the Player and Earth.

You're a shark, and you're flying around in space, trying to defend earth.

Each level, small stars will come into your area, and you can collide with them to eat them to gain HP.

Also during each level, large asteroids will come into range, heading towards earth at the bottom of the map. Your goal is to intercept them and let them hit you. Doing so will cause you to lose HP, but it destroys the asteroid and prevents it from damaging Earth.

If you let an asteroid hit earth, its HP goes down. If it runs out, you lose. if you run out of HP, you die and lose.

### Required Resources

To create this game, I needed and had an advanced knowledge of the JavaScript programming language. Over the course of this project I learned how to use the `Phaser` JS library. All of the assets, aside from the space, 1st, 2nd, and 3rd cutscene images, and the background music, were created by me.

As I created the assets, I was able to ensure that they were ready within a sufficient time for the final game release.

### Game Attributes and Features

After following my plan, and changing things as I and others tested my game, the game has the following:

- A functional controls system
- A main menu, help page, and loading screen
- Sprite assets for the Shark character, Earth, asteroids, and stars
- A functional health and death system
- Death and win screens, with totals for stars eaten and asteroids deflected
- Background Art of space with stars
- Integration with Maori mythology and culture
- Background music
- A credits page, to attribute the artwork and music to the artists
- A stopwatch to use as the scoring
- A highscore tracker

### Cutscene Story

The Maori people of New Zealand have a rich history and culture, with many great legends and beliefs. I have selected a Maori myth to base my game around, and that is the legend of Māngōroa, the Shark of the Milky Way. In legend, Māngōroa was a shark that was chosen by Maui (The same Maui that fished up the North Island) to protect the Maori tribes and people on Earth. Legend tells that Māngōroa has been floating around in space, protecting the Earth from danger for centuries.

1. Long ago, on an island quite close to here, there lived a group of people. These people were the Maori.
2. The Maori were afraid that their Earth could be harmed by things like stars and asteroids, and didn’t know what to do.
3. Until one day, when the Demigod Maui had an idea. Maui proposed that they send a shark, Māngōroa, into space to protect the tribes back on earth.
4. And so they did, and Māngōroa is still up in space today, protecting the Earth from anything that may cause it harm.