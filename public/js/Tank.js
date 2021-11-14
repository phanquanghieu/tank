const Tank = {
  tankSpeed: 3,
  bodySize: 30,
  gunLength: 30,
  bulletSpeed: 5,
  bulletSize: 6,
  bulletColor: 'blue',

  drawTank(tank) {
    // draw tank body
    Game.c.beginPath()
    Game.c.fillStyle = player._id === tank.playerId ? 'lime' : 'red'
    Game.c.fillRect(
      tank.x - Tank.bodySize / 2,
      tank.y - Tank.bodySize / 2,
      Tank.bodySize,
      Tank.bodySize
    )

    // draw gun barrel
    Game.c.beginPath()
    Game.c.moveTo(tank.x, tank.y)
    Game.c.lineTo(
      tank.x + Math.cos(tank.gunDirection) * Tank.gunLength,
      tank.y - Math.sin(tank.gunDirection) * Tank.gunLength
    )
    Game.c.lineWidth = 4
    Game.c.stroke()

    Game.c.beginPath()
    Game.c.arc(tank.x, tank.y, Tank.bulletSize + 2, 0, Math.PI * 2, false)
    Game.c.fillStyle = Tank.bulletColor
    Game.c.fill()
  },

  drawBullet(bullet) {
    Game.c.beginPath()
    Game.c.arc(bullet.x, bullet.y, Tank.bulletSize / 2, 0, Math.PI * 2, false)
    Game.c.fillStyle = Tank.bulletColor
    Game.c.fill()
  },
}
