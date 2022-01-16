const Tank = {
  bodySize: 30,
  gunLength: 30,
  bulletSize: 6,
  bulletColor: "blue",

  drawTank(tank) {
    // draw tank body
    Game.c.beginPath()
    Game.c.fillStyle = player._id === tank.playerId ? "lime" : "red"
    Game.c.fillRect(
      tank.x - Tank.bodySize / 2,
      tank.y - Tank.bodySize / 2,
      Tank.bodySize,
      Tank.bodySize
    )

    Game.c.beginPath()
    Game.c.arc(tank.x, tank.y, Tank.bulletSize + 2, 0, Math.PI * 2, false)
    Game.c.fillStyle = Tank.bulletColor
    Game.c.fill()

    Game.c.fillStyle = "black"
    Game.c.font = "12px Arial"
    Game.c.textAlign = "center"
    Game.c.fillText(tank.username, tank.x, tank.y - Tank.bodySize / 2 - 4)

    Game.c.beginPath()
    Game.c.strokeStyle = "#ddd"
    Game.c.lineWidth = 6
    Game.c.lineCap = "round"
    Game.c.moveTo(tank.x - Tank.bodySize / 2, tank.y + Tank.bodySize / 2 + 6)
    Game.c.lineTo(tank.x + Tank.bodySize / 2, tank.y + Tank.bodySize / 2 + 6)
    Game.c.stroke()

    Game.c.beginPath()
    Game.c.strokeStyle = "lime"
    Game.c.lineWidth = 6
    Game.c.lineCap = "round"
    Game.c.moveTo(tank.x - Tank.bodySize / 2, tank.y + Tank.bodySize / 2 + 6)
    Game.c.lineTo(
      tank.x - Tank.bodySize / 2 + (tank.hp / tank.hpMax) * Tank.bodySize,
      tank.y + Tank.bodySize / 2 + 6
    )
    Game.c.stroke()

    // draw gun barrel
    Game.c.beginPath()
    Game.c.strokeStyle = "#000"
    Game.c.moveTo(tank.x, tank.y)
    Game.c.lineTo(
      tank.x + Math.cos(tank.gunDirection) * Tank.gunLength,
      tank.y - Math.sin(tank.gunDirection) * Tank.gunLength
    )
    Game.c.lineWidth = 4
    Game.c.stroke()
  },

  drawBullet(bullet) {
    Game.c.beginPath()
    Game.c.arc(bullet.x, bullet.y, Tank.bulletSize / 2, 0, Math.PI * 2, false)
    Game.c.fillStyle = Tank.bulletColor
    Game.c.fill()
  },
}
