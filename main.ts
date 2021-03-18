namespace SpriteKind {
    export const Box = SpriteKind.create()
    export const coin = SpriteKind.create()
}
function createMushrooms () {
    supriseBoxTiles = scene.getTilesByType(2)
    for (let value of supriseBoxTiles) {
        mushroom = sprites.create(assets.image`regularMushroom`, SpriteKind.Food)
        value.place(mushroom)
    }
}
function createCheepCheep (position: number) {
    cheepcheep = sprites.create(assets.image`cheepCheep`, SpriteKind.Enemy)
    animation.runImageAnimation(
    cheepcheep,
    assets.animation`cheepCheepFlying`,
    200,
    true
    )
    createEnemy(cheepcheep, position, 30)
    for (let index = 0; index < 100; index++) {
        pause(2000)
        reverseMove(cheepcheep)
    }
}
function resetGame () {
    goomba.destroy()
    spiny.destroy()
    cheepcheep.destroy()
    buildLevel()
}
function createMap () {
    scene.setBackgroundImage(assets.image`backgroundImage1`)
    scene.setTileMap(mapList[0])
    scene.setTile(14, assets.image`floor`, true)
    scene.setTile(13, assets.image`questionBlock`, true)
    scene.setTile(12, img`
        2 2 2 2 2 2 2 f 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 f 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 f 2 2 2 2 2 2 2 2 
        f f f f f f f f f f f f f f f f 
        2 2 2 f 2 2 2 2 2 2 2 f 2 2 2 2 
        2 2 2 f 2 2 2 2 2 2 2 f 2 2 2 2 
        2 2 2 f 2 2 2 2 2 2 2 f 2 2 2 2 
        f f f f f f f f f f f f f f f f 
        2 2 2 2 2 2 2 f 2 2 2 2 2 2 2 f 
        2 2 2 2 2 2 2 f 2 2 2 2 2 2 2 f 
        2 2 2 2 2 2 2 f 2 2 2 2 2 2 2 f 
        f f f f f f f f f f f f f f f f 
        2 2 2 f 2 2 2 2 2 2 2 f 2 2 2 2 
        2 2 2 f 2 2 2 2 2 2 2 f 2 2 2 2 
        2 2 2 f 2 2 2 2 2 2 2 f 2 2 2 2 
        f f f f f f f f f f f f f f f f 
        `, true)
    scene.setTile(8, assets.image`pipeBottomLeft`, true)
    scene.setTile(9, assets.image`pipeBottomRight`, true)
    scene.setTile(6, assets.image`pipeTopLeft`, true)
    scene.setTile(7, assets.image`pipeTopRight`, true)
    scene.setTile(4, assets.image`solidBlock`, true)
    scene.setTile(10, assets.image`door`, true)
    scene.setTile(15, assets.image`blackBox`, true)
    scene.setTile(5, assets.image`coin`, false)
    scene.setTile(2, assets.image`regularMushroom`, false)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mario.vy == 0) {
        mario.vy = -175
        pause(500)
        mario.vy = 50
    }
})
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    if (bigMario == 1) {
        mario.setImage(assets.image`bigMarioDucking`)
    }
})
function shrinkMario () {
    bigMario = 0
    animation.runImageAnimation(
    mario,
    assets.animation`shrinkingMario`,
    200,
    true
    )
    pause(500)
    animation.stopAnimation(animation.AnimationTypes.All, mario)
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (bigMario == 0) {
        animation.runImageAnimation(
        mario,
        assets.animation`smallMarioLeftWalking`,
        100,
        true
        )
    } else {
        animation.runImageAnimation(
        mario,
        assets.animation`bigMarioWalkingLeft`,
        200,
        true
        )
    }
    mario.setVelocity(-50, 0)
})
function createGoomba (position: number) {
    goomba = sprites.create(assets.image`goombaStill`, SpriteKind.Enemy)
    animation.runImageAnimation(
    goomba,
    assets.animation`Goomba`,
    200,
    true
    )
    createEnemy(goomba, position, 104)
}
scene.onHitTile(SpriteKind.Player, 10, function (sprite) {
    level += 1
    if (level > mapList.length) {
        game.over(true, effects.confetti)
    } else {
        resetGame()
    }
})
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    animation.stopAnimation(animation.AnimationTypes.All, mario)
    if (bigMario == 0) {
        mario.setImage(assets.image`marioStandingStill`)
        mario.setVelocity(0, 0)
    } else {
        mario.setImage(assets.image`bigMarioStandingStillLeft`)
        mario.setVelocity(0, 0)
    }
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    animation.stopAnimation(animation.AnimationTypes.ImageAnimation, mario)
    if (bigMario == 0) {
        mario.setImage(assets.image`marioStandingStill`)
        mario.setVelocity(0, 0)
    } else {
        mario.setImage(assets.image`bigMarioStandingStillRight`)
        mario.setVelocity(0, 0)
    }
})
info.onCountdownEnd(function () {
    info.changeLifeBy(-1)
    resetGame()
})
scene.onHitTile(SpriteKind.Enemy, 9, function (sprite) {
    reverseMove(sprite)
})
function buildLevel () {
    createMap()
    mario.setPosition(8, 85)
    mario.ay = 175
    info.startCountdown(120)
    scene.cameraFollowSprite(mario)
    createCoins()
    createMushrooms()
    createGoomba(150)
    createSpiny(330)
    createCheepCheep(250)
}
function createEnemy (badGuy: Sprite, startingPosition: number, yPosition: number) {
    badGuy.setVelocity(50, 0)
    badGuy.setPosition(startingPosition, yPosition)
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (bigMario == 0) {
        animation.runImageAnimation(
        mario,
        assets.animation`smallMarioRightWalking`,
        100,
        true
        )
    } else {
        animation.runImageAnimation(
        mario,
        assets.animation`bigMarioWalkingRight`,
        100,
        true
        )
    }
    mario.setVelocity(50, 0)
})
scene.onHitTile(SpriteKind.Enemy, 4, function (sprite) {
    reverseMove(sprite)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.coin, function (sprite, otherSprite) {
    info.changeScoreBy(100)
    otherSprite.destroy()
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (sprite, otherSprite) {
    if (bigMario == 0) {
        if (sprite == spiny) {
            info.changeLifeBy(-1)
            resetGame()
        } else {
            if (otherSprite.y < sprite.y) {
                sprite.destroy(effects.fire, 500)
                info.changeScoreBy(200)
            } else {
                info.changeLifeBy(-1)
                resetGame()
            }
        }
    } else {
        shrinkMario()
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (bigMario == 1) {
        mario.setImage(assets.image`bigMario`)
    }
})
scene.onHitTile(SpriteKind.Enemy, 8, function (sprite) {
    reverseMove(sprite)
})
info.onLifeZero(function () {
    game.over(false, effects.melt)
})
scene.onHitTile(SpriteKind.Player, 15, function (sprite) {
    resetGame()
})
function createCoins () {
    supriseBoxTiles = scene.getTilesByType(5)
    for (let value2 of supriseBoxTiles) {
        coins = sprites.create(assets.image`coin`, SpriteKind.coin)
        value2.place(coins)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy(effects.warmRadial, 100)
    mario.setImage(assets.image`bigMario`)
    bigMario = 1
    info.changeScoreBy(200)
})
scene.onHitTile(SpriteKind.Player, 12, function (sprite) {
    if (mario.isHittingTile(CollisionDirection.Top)) {
        scene.cameraShake(4, 100)
    }
})
function createSpiny (position: number) {
    spiny = sprites.create(assets.image`spinyStandingStill`, SpriteKind.Enemy)
    animation.runImageAnimation(
    spiny,
    assets.animation`spinyWalking`,
    200,
    true
    )
    createEnemy(spiny, position, 104)
}
function reverseMove (badGuy: Sprite) {
    badGuy.setVelocity(0 - badGuy.vx, 0)
}
let coins: Sprite = null
let bigMario = 0
let spiny: Sprite = null
let goomba: Sprite = null
let cheepcheep: Sprite = null
let mushroom: Sprite = null
let supriseBoxTiles: tiles.Tile[] = []
let mapList: Image[] = []
let level = 0
let mario: Sprite = null
mario = sprites.create(assets.image`marioStandingStill`, SpriteKind.Player)
info.setLife(3)
level = 0
mapList = [assets.image`level1`, assets.image`level2`]
buildLevel()
