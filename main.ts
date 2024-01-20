enum ActionKind {
    Walking,
    Idle,
    Jumping,
    BigWalkingLeft,
    smallWalkingLeft,
    BigWalkingRight,
    SmallWalkingRight
}
namespace SpriteKind {
    export const Box = SpriteKind.create()
    export const coin = SpriteKind.create()
    export const CheapCheap = SpriteKind.create()
    export const brick = SpriteKind.create()
    export const Goomba = SpriteKind.create()
    export const Text = SpriteKind.create()
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`1up`, function (sprite, location) {
    music.magicWand.play()
    tiles.setTileAt(location, assets.tile`transparency16`)
    info.changeLifeBy(1)
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (mario.isHittingTile(CollisionDirection.Top)) {
        if (tiles.tileAtLocationEquals(location, assets.tile`mushroomBlock`)) {
            if (Math.percentChance(95)) {
                tiles.setTileAt(tiles.getTileLocation(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row) - 1), assets.tile`mushroom`)
                tiles.setTileAt(location, assets.tile`surpriseBlockAfterHit`)
            } else if (Math.percentChance(5)) {
                tiles.setTileAt(tiles.getTileLocation(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row) - 1), assets.tile`1up`)
                tiles.setTileAt(location, assets.tile`surpriseBlockAfterHit`)
            }
        } else if (tiles.tileAtLocationEquals(location, assets.tile`coinBlock`)) {
            music.baDing.play()
            coinBlock = sprites.create(assets.image`coin`, SpriteKind.coin)
            animation.runImageAnimation(
            coinBlock,
            assets.animation`supriseCoin`,
            100,
            false
            )
            tiles.placeOnTile(coinBlock, tiles.getTileLocation(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row) - 2))
            info.changeScoreBy(200)
            tiles.setTileAt(location, assets.tile`surpriseBlockAfterHit`)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`myTile0`)) {
            if (bigMario == 1) {
                music.bigCrash.play()
                brickBlockExploding = sprites.create(assets.tile`myTile0`, SpriteKind.brick)
                info.changeScoreBy(50)
                animation.runImageAnimation(
                brickBlockExploding,
                assets.animation`explodingBrickAnim`,
                100,
                false
                )
                tiles.placeOnTile(brickBlockExploding, tiles.getTileLocation(tiles.locationXY(location, tiles.XY.column) - 1, tiles.locationXY(location, tiles.XY.row) - 1))
                tiles.setWallAt(location, false)
                tiles.setTileAt(location, assets.tile`transparency16`)
            } else {
                scene.cameraShake(4, 100)
            }
        } else {
            scene.cameraShake(4, 100)
        }
    }
})
sprites.onOverlap(SpriteKind.Goomba, SpriteKind.Player, function (sprite, otherSprite) {
    if (sprite.y > otherSprite.y) {
        sprite.setImage(assets.image`squishedGoomba`)
    }
    hitByEnemy(sprite, otherSprite)
})
function createGame () {
    level = 0
    info.startCountdown(120)
    buildLevel()
}
function createCheepCheep () {
    for (let value of tiles.getTilesByType(assets.tile`myTile4`)) {
        cheepcheep = sprites.create(assets.image`cheepCheep`, SpriteKind.CheapCheap)
        animation.runImageAnimation(
        cheepcheep,
        assets.animation`cheepCheepFlying`,
        200,
        true
        )
        cheepcheep.setVelocity(50, 0)
        tiles.placeOnTile(cheepcheep, value)
        cheepcheep.setBounceOnWall(true)
    }
    tiles.replaceAllTiles(assets.tile`myTile4`, assets.tile`transparency16`)
}
function resetGame () {
    tiles.destroySpritesOfKind(SpriteKind.coin)
    tiles.destroySpritesOfKind(SpriteKind.Food)
    tiles.destroySpritesOfKind(SpriteKind.Enemy)
    tiles.destroySpritesOfKind(SpriteKind.CheapCheap)
    tiles.destroySpritesOfKind(SpriteKind.Goomba)
    buildLevel()
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile`, function (sprite, location) {
    let mapList: number[] = []
    level += 1
    if (level >= mapList.length) {
        game.over(true, effects.confetti)
    } else {
        resetGame()
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mario.isHittingTile(CollisionDirection.Bottom)) {
        mario.vy = jumpHeight
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile7`, function (sprite, location) {
    info.changeLifeBy(-1)
    resetGame()
})
function animateRun () {
    bigMarioRunLeft = animation.createAnimation(ActionKind.BigWalkingLeft, 100)
    animation.attachAnimation(mario, bigMarioRunLeft)
    bigMarioRunLeft.addAnimationFrame(img`
        ................
        ................
        ....222222......
        ....5222222.....
        ....55222222....
        .22222222222....
        ....dd8dd888....
        .dddd88dd8dd8...
        dddddddd88dd8...
        dddd8ddd88dd88..
        .888888ddddd88..
        .88888ddddd88...
        ..dddddddd8.....
        .....ddd2228....
        ......8288828...
        .....82888828...
        ..dd228888828...
        ..dd8888888288..
        dddd8888888228..
        ddd88888882228..
        ddd8888888222...
        ...2888222222...
        ...2222222222...
        ...8222222222...
        ..22822222222...
        ..22288222228888
        ...2222822228888
        ...2222..2228888
        ...8888.....8888
        ...8888.......88
        .888888........8
        .888888.........
        `)
    bigMarioRunLeft.addAnimationFrame(img`
        ................
        ....22222.......
        ....5222222.....
        ....55222222....
        .22222222222....
        ....dd8dd888....
        .dddd88dd8dd8...
        dddddddd88dd8...
        dddd8ddd88dd88..
        .888888ddddd88..
        .88888ddddd88...
        ..dddddddd88....
        .....dd2222.....
        ....882288228...
        ....8228888228..
        ...88228888828..
        ...82228888828..
        ...8dd88888828..
        ...dddd8888828..
        ..2dddd8882222..
        .22dddd8822222..
        .222ddd2222222..
        .2222882222222..
        ..228882222222..
        ..288888222222..
        ..88888882222...
        ....88822228....
        ...888.88888....
        ...88..88888....
        .......888888...
        ....888888888...
        ....8888888.....
        `)
    bigMarioRunLeft.addAnimationFrame(img`
        .....22222......
        .....5222222....
        .....55222222...
        ..22222222222...
        ....ddd8dd888...
        ..dddd88dd8dd8..
        .dddddddd88dd8..
        .dddd8ddd88dd88.
        ..888888ddddd88.
        ..88888ddddd888.
        ...dddddddd88...
        ......dd888.....
        .d...2882222....
        ddd.288228888...
        ddd82822888888..
        ddd288228888888.
        8d8288228888888.
        .88288222888888.
        ..85825222888888
        ...2222222228888
        ...22222222ddddd
        ...22222222ddddd
        8..222222222dddd
        88.222222222ddd.
        8888822222282...
        88888222228228..
        8888822288222888
        88888...22228888
        ..........288888
        ............888.
        ............888.
        ...........888..
        `)
    smallMarioRunLeft = animation.createAnimation(ActionKind.smallWalkingLeft, 100)
    animation.attachAnimation(mario, smallMarioRunLeft)
    smallMarioRunLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . 2 2 2 2 2 . . . . 
        . . . . 2 2 2 2 2 2 2 2 2 . . . 
        . . . . . . d 8 d d 8 8 8 . . . 
        . . . . d d d 8 d d d 8 d 8 . . 
        . . . d d d 8 d d d 8 8 d 8 . . 
        . . . . 8 8 8 8 d d d d 8 8 . . 
        . . . . . d d d d d d d . . . . 
        . . . . . d . 8 1 8 8 8 8 . . . 
        . . . . d d d 8 8 8 8 8 8 d . . 
        . . . . . d d 8 8 8 8 8 2 d d . 
        . . . . . . 2 2 2 2 2 2 2 8 8 . 
        . . . . . . 2 2 2 2 2 2 2 2 8 . 
        . . . . . . . 2 2 2 2 2 2 2 8 8 
        . . . . . . . . 8 8 8 . . . . 8 
        . . . . . . . 8 8 8 8 . . . . . 
        `)
    smallMarioRunLeft.addAnimationFrame(img`
        . . . . . . . . . 2 2 2 2 2 . . 
        . . . . . . 2 2 2 2 2 2 2 2 2 . 
        . . . . . . . . d 8 d d 8 8 8 . 
        . . . . . . d d d 8 d d d 8 d 8 
        . . . . . d d d 8 d d d 8 8 d 8 
        . . . . . . 8 8 8 8 d d d d 8 8 
        . . . . . . . d d d d d d d . . 
        . . . . . . . . . 8 8 8 2 8 8 . 
        . . . . . . . . 8 8 2 2 8 8 8 8 
        . . . . . . . d 2 2 d 2 2 8 8 8 
        . . . . . . . 2 2 2 2 2 8 8 8 8 
        . . . . . . . 2 2 2 d d d 8 8 2 
        . . . . . . . . 2 2 2 d d 8 2 . 
        . . . . . . . . 8 8 8 2 2 2 . . 
        . . . . . . . 8 8 8 8 8 8 8 . . 
        . . . . . . . . . . . 8 8 8 . . 
        `)
    smallMarioRunLeft.addAnimationFrame(img`
        . . . . . . 2 2 2 2 2 . . . . . 
        . . . 2 2 2 2 2 2 2 2 2 . . . . 
        . . . . . d 8 d d 8 8 8 . . . . 
        . . . d d d 8 d d d 8 d 8 . . . 
        . . d d d 8 d d d 8 8 d 8 . . . 
        . . . 8 8 8 8 d d d d 8 8 . . . 
        . . . . d d d d d d d . . . . . 
        . . . . . . 8 8 2 2 8 8 8 8 . . 
        . d d d 8 8 8 2 2 2 8 8 8 8 d d 
        . d d 8 8 2 2 2 d 2 8 8 . d d d 
        . . 8 . . 2 2 2 2 2 2 2 . . . . 
        . . 8 8 2 2 2 2 2 2 2 2 2 . . . 
        . . 8 8 2 2 2 2 2 2 2 2 2 2 . . 
        . . 8 8 2 2 2 . . 2 2 2 2 8 8 . 
        . . . . . . . . . . . . 8 8 8 . 
        . . . . . . . . . . . 8 8 8 . . 
        `)
    bigMarioRunRight = animation.createAnimation(ActionKind.BigWalkingRight, 100)
    animation.attachAnimation(mario, bigMarioRunRight)
    bigMarioRunRight.addAnimationFrame(img`
        ................
        ................
        ......222222....
        .....2222225....
        ....22222255....
        ....22222222222.
        ....888dd8dd....
        ...8dd8dd88dddd.
        ...8dd88dddddddd
        ..88dd88ddd8dddd
        ..88ddddd888888.
        ...88ddddd88888.
        3....8dddddddd..
        ....8222ddd.....
        ...8288828......
        ...82888828.....
        ...828888822dd..
        ..8828888888dd..
        ..8228888888dddd
        ..82228888888ddd
        ...2228888888ddd
        ...2222228882...
        ...2222222222...
        ...2222222228...
        ...22222222822..
        88882222288222..
        8888222282222...
        8888222..2222...
        8888.....8888...
        88.......8888...
        8........888888.
        .........888888.
        `)
    bigMarioRunRight.addAnimationFrame(img`
        ................
        .......22222....
        .....2222225....
        ....22222255....
        ....22222222222.
        ....888dd8dd....
        ...8dd8dd88dddd.
        ...8dd88dddddddd
        ..88dd88ddd8dddd
        ..88ddddd888888.
        ...88ddddd88888.
        ....88dddddddd..
        .....2222dd.....
        ...822882288....
        ..8228888228....
        ..82888882288...
        ..82888882228...
        ..82888888dd8...
        ..8288888dddd...
        ..2222888dddd2..
        ..2222288dddd22.
        ..2222222ddd222.
        ..2222222882222.
        ..222222288822..
        ..222222888882..
        ...22228888888..
        ....82222888....
        ....88888.888...
        ....88888..88...
        ...888888.......
        ...888888888....
        .....8888888....
        `)
    bigMarioRunRight.addAnimationFrame(img`
        ......22222.....
        ....2222225.....
        ...22222255.....
        ...22222222222..
        ...888dd8ddd....
        ..8dd8dd88dddd..
        ..8dd88dddddddd.
        .88dd88ddd8dddd.
        .88ddddd888888..
        .888ddddd88888..
        ...88dddddddd...
        .....888dd......
        ....2222882...d.
        ...888822882.ddd
        ..88888822828ddd
        .888888822882ddd
        .8888888228828d8
        .88888822288288.
        88888822252858..
        8888222222222...
        ddddd22222222...
        ddddd22222222...
        dddd222222222..8
        .ddd222222222.88
        ...2822222288888
        ..82282222288888
        8882228822288888
        88882222...88888
        888882..........
        .888............
        .888............
        ..888...........
        `)
    smallMarioRunRight = animation.createAnimation(ActionKind.SmallWalkingRight, 100)
    animation.attachAnimation(mario, smallMarioRunRight)
    smallMarioRunRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . 2 2 2 2 2 . . . . . . . 
        . . . 2 2 2 2 2 2 2 2 2 . . . . 
        . . . 8 8 8 d d 8 d . . . . . . 
        . . 8 d 8 d d d 8 d d d . . . . 
        . . 8 d 8 8 d d d 8 d d d . . . 
        . . 8 8 d d d d 8 8 8 8 . . . . 
        . . . . d d d d d d d . . . . . 
        . . . 8 8 8 8 1 8 . d . . . . . 
        . . d 8 8 8 8 8 8 d d d . . . . 
        . d d 2 8 8 8 8 8 d d . . . . . 
        . 8 8 2 2 2 2 2 2 2 . . . . . . 
        . 8 2 2 2 2 2 2 2 2 . . . . . . 
        8 8 2 2 2 2 2 2 2 . . . . . . . 
        8 . . . . 8 8 8 . . . . . . . . 
        . . . . . 8 8 8 8 . . . . . . . 
        `)
    smallMarioRunRight.addAnimationFrame(img`
        . . 2 2 2 2 2 . . . . . . . . . 
        . 2 2 2 2 2 2 2 2 2 . . . . . . 
        . 8 8 8 d d 8 d . . . . . . . . 
        8 d 8 d d d 8 d d d . . . . . . 
        8 d 8 8 d d d 8 d d d . . . . . 
        8 8 d d d d 8 8 8 8 . . . . . . 
        . . d d d d d d d . . . . . . . 
        . 8 8 2 8 8 8 . . . . . . . . . 
        8 8 8 8 2 2 8 8 . . . . . . . . 
        8 8 8 2 2 d 2 2 d . . . . . . . 
        8 8 8 8 2 2 2 2 2 . . . . . . . 
        2 8 8 d d d 2 2 2 . . . . . . . 
        . 2 8 d d 2 2 2 . . . . . . . . 
        . . 2 2 2 8 8 8 . . . . . . . . 
        . . 8 8 8 8 8 8 8 . . . . . . . 
        . . 8 8 8 . . . . . . . . . . . 
        `)
    smallMarioRunRight.addAnimationFrame(img`
        . . . . . 2 2 2 2 2 . . . . . . 
        . . . . 2 2 2 2 2 2 2 2 2 . . . 
        . . . . 8 8 8 d d 8 d . . . . . 
        . . . 8 d 8 d d d 8 d d d . . . 
        . . . 8 d 8 8 d d d 8 d d d . . 
        . . . 8 8 d d d d 8 8 8 8 . . . 
        . . . . . d d d d d d d . . . . 
        . . 8 8 8 8 2 2 8 8 . . . . . . 
        d d 8 8 8 8 2 2 2 8 8 8 d d d . 
        d d d . 8 8 2 d 2 2 2 8 8 d d . 
        . . . . 2 2 2 2 2 2 2 . . 8 . . 
        . . . 2 2 2 2 2 2 2 2 2 8 8 . . 
        . . 2 2 2 2 2 2 2 2 2 2 8 8 . . 
        . 8 8 2 2 2 2 . . 2 2 2 8 8 . . 
        . 8 8 8 . . . . . . . . . . . . 
        . . 8 8 8 . . . . . . . . . . . 
        `)
}
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    if (bigMario == 1) {
        mario.setImage(assets.image`bigMario`)
    }
})
function shrinkMario () {
    bigMario = 0
    animation.runImageAnimation(
    mario,
    assets.animation`shrinkingMario`,
    100,
    true
    )
    pause(1000)
    animation.stopAnimation(animation.AnimationTypes.All, mario)
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (bigMario == 0) {
        animation.setAction(mario, ActionKind.smallWalkingLeft)
    } else {
        animation.setAction(mario, ActionKind.BigWalkingLeft)
    }
    mario.vx = 0 - walkingSpeed
})
function createGoomba () {
    for (let value of tiles.getTilesByType(assets.tile`myTile3`)) {
        goomba = sprites.create(assets.image`goombaStill`, SpriteKind.Goomba)
        animation.runImageAnimation(
        goomba,
        assets.animation`Goomba`,
        200,
        true
        )
        goomba.setVelocity(50, 0)
        tiles.placeOnTile(goomba, value)
        goomba.setBounceOnWall(true)
    }
    tiles.replaceAllTiles(assets.tile`myTile3`, assets.tile`transparency16`)
}
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    animation.stopAnimation(animation.AnimationTypes.All, mario)
    if (bigMario == 0) {
        mario.setImage(assets.image`marioStandingStill`)
    } else {
        mario.setImage(assets.image`bigMarioStandingStillLeft`)
    }
    mario.vx = 0
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    animation.stopAnimation(animation.AnimationTypes.ImageAnimation, mario)
    if (bigMario == 0) {
        mario.setImage(assets.image`marioStandingStill`)
    } else {
        mario.setImage(assets.image`bigMarioStandingStillRight`)
    }
    mario.vx = 0
})
info.onCountdownEnd(function () {
    info.changeLifeBy(-1)
    resetGame()
})
function buildLevel () {
    mario.setPosition(19, 40)
    scene.setBackgroundImage(assets.image`backgroundImage1`)
    tiles.setTilemap(tilemap`level7`)
    animateCoins()
    createGoomba()
    createCheepCheep()
    createSpiny()
    createTurtle()
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`mushroom`, function (sprite, location) {
    music.powerUp.play()
    tiles.setTileAt(location, assets.tile`transparency16`)
    mario.setImage(assets.image`bigMario`)
    bigMario = 1
    info.changeScoreBy(200)
})
sprites.onOverlap(SpriteKind.CheapCheap, SpriteKind.Player, function (sprite, otherSprite) {
    hitByEnemy(sprite, otherSprite)
})
function animateCoins () {
    for (let value of tiles.getTilesByType(assets.tile`myTile1`)) {
        coins = sprites.create(assets.image`coin`, SpriteKind.coin)
        tiles.placeOnTile(coins, value)
        animation.runImageAnimation(
        coins,
        assets.animation`fullCoin`,
        200,
        true
        )
    }
    tiles.replaceAllTiles(assets.tile`myTile1`, assets.tile`transparency16`)
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (bigMario == 0) {
        animation.setAction(mario, ActionKind.SmallWalkingRight)
    } else {
        animation.setAction(mario, ActionKind.BigWalkingRight)
    }
    mario.vx = walkingSpeed
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.coin, function (sprite, otherSprite) {
    music.baDing.play()
    info.changeScoreBy(100)
    otherSprite.destroy(effects.warmRadial, 100)
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (sprite, otherSprite) {
    hitByEnemy(sprite, otherSprite)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (bigMario == 1) {
        mario.setImage(assets.image`bigMarioDucking`)
    }
})
function hitByEnemy (enemySprite: Sprite, playerSprite: Sprite) {
    if (bigMario == 0) {
        if (enemySprite == spiny) {
            info.changeLifeBy(-1)
            resetGame()
        } else {
            if (enemySprite.y > playerSprite.y) {
                enemySprite.destroy(effects.fire, 500)
                info.changeScoreBy(200)
            } else {
                info.changeLifeBy(-1)
                resetGame()
            }
        }
    } else {
        shrinkMario()
    }
}
info.onLifeZero(function () {
    game.over(false, effects.melt)
})
function createPlayer (player2: Sprite) {
    bigMario = 0
    player2.ay = gravity
    info.setLife(3)
    scene.cameraFollowSprite(player2)
    animateRun()
}
function createSpiny () {
    for (let value of tiles.getTilesByType(assets.tile`myTile5`)) {
        spiny = sprites.create(assets.image`spinyStandingStill`, SpriteKind.Enemy)
        animation.runImageAnimation(
        spiny,
        assets.animation`spinyWalking`,
        200,
        true
        )
        spiny.setVelocity(50, 0)
        tiles.placeOnTile(spiny, value)
        spiny.setBounceOnWall(true)
    }
    tiles.replaceAllTiles(assets.tile`myTile5`, assets.tile`transparency16`)
}
function createTurtle () {
    for (let value of tiles.getTilesByType(assets.tile`myTile6`)) {
        turtle = sprites.create(assets.image`turtleStill`, SpriteKind.Enemy)
        animation.runImageAnimation(
        turtle,
        assets.animation`turtle`,
        200,
        true
        )
        turtle.setVelocity(50, 0)
        tiles.placeOnTile(turtle, value)
        turtle.setBounceOnWall(true)
    }
    tiles.replaceAllTiles(assets.tile`myTile6`, assets.tile`transparency16`)
}
function reverseMove (badGuy: Sprite) {
    badGuy.setVelocity(0 - badGuy.vx, 0)
}
let turtle: Sprite = null
let spiny: Sprite = null
let coins: Sprite = null
let goomba: Sprite = null
let smallMarioRunRight: animation.Animation = null
let bigMarioRunRight: animation.Animation = null
let smallMarioRunLeft: animation.Animation = null
let bigMarioRunLeft: animation.Animation = null
let cheepcheep: Sprite = null
let level = 0
let brickBlockExploding: Sprite = null
let bigMario = 0
let coinBlock: Sprite = null
let mario: Sprite = null
let jumpHeight = 0
let walkingSpeed = 0
let gravity = 0
let pixelsToMeters = 30
gravity = 9.81 * pixelsToMeters
walkingSpeed = 70
jumpHeight = -150
mario = sprites.create(assets.image`marioStandingStill`, SpriteKind.Player)
createPlayer(mario)
createGame()
buildLevel()
game.onUpdate(function () {
    if (mario.isHittingTile(CollisionDirection.Top)) {
        mario.vy = 0
    }
})
forever(function () {
    pause(2000)
    for (let value of sprites.allOfKind(SpriteKind.CheapCheap)) {
        reverseMove(value)
    }
})
