'use strict'

import { pickRandom, randomInt } from './utils'

export const directionMap = {
  DOWN: 1,
  UP: -1,
  LEFT: -2,
  RIGHT: 2
}

class SnakeNode {
  constructor (x, y) {
    this.x = x
    this.y = y
    this._next = null
    this._prev = null
  }

  next (node = null) {
    if (node) {
      this._next = node
      this._next.prev(this)
    }
    return this._next
  }

  prev (node = null) {
    if (node) {
      this._prev = node
    }
    return this._prev
  }
}

class Snake {
  constructor ({
    x,
    y,
    direction = directionMap.LEFT,
    growLength = 1,
    defaultLength = 2
  }) {
    this.head = new SnakeNode(x, y)
    this.tail = this.head

    this._direction = direction
    this.growLength = growLength
    this.grow(defaultLength - 1)
    this.alive = true
  }

  switchDirection (direction) {
    if (directionMap[direction] + this._direction !== 0) {
      this._direction = directionMap[direction]
    }
    return this
  }

  grow(amount = 1) {
    const addNode = () => {
      let nextNode
      let tailDirection

      let prevTail = this.tail.prev()
      if (prevTail) {
        if (prevTail.x === this.tail.x) {
          tailDirection =
            prevTail.y > this.tail.y ? directionMap.DOWN : directionMap.UP
        } else {
          tailDirection =
            prevTail.x > this.tail.x ? directionMap.RIGHT : directionMap.LEFT
        }
      } else {
        tailDirection = this._direction
      }

      switch (tailDirection) {
        case directionMap.UP:
          nextNode = new SnakeNode(this.tail.x, this.tail.y + 1)
          break
        case directionMap.DOWN:
          nextNode = new SnakeNode(this.tail.x, this.tail.y - 1)
          break
        case directionMap.LEFT:
          nextNode = new SnakeNode(this.tail.x + 1, this.tail.y)
          break
        case directionMap.RIGHT:
          nextNode = new SnakeNode(this.tail.x - 1, this.tail.y)
          break
      }
      this.tail.next(nextNode)
      this.tail = nextNode
    }

    for (let i = 0; i < amount; i++) {
      addNode()
    }
    return this
  }

  getNodes () {
    let nodes = [this.head]
    let head = this.head
    while (head.next()) {
      let node = head.next()
      nodes.push(node)
      head = node
    }
    return nodes
  }

  size () {
    let count = 1
    let head = this.head
    while (head.next()) {
      let node = head.next()
      count++
      head = node
    }
    return count
  }

  walk () {
    let currentHead = this.head
    let currentTail = this.tail
    switch (this._direction) {
      case directionMap.UP:
        currentTail.x = currentHead.x
        currentTail.y = currentHead.y - 1
        break
      case directionMap.DOWN:
        currentTail.x = currentHead.x
        currentTail.y = currentHead.y + 1
        break
      case directionMap.LEFT:
        currentTail.x = currentHead.x - 1
        currentTail.y = currentHead.y
        break
      case directionMap.RIGHT:
        currentTail.x = currentHead.x + 1
        currentTail.y = currentHead.y
        break
    }
    this.head = currentTail
    this.tail = currentTail.prev()
    this.head.next(currentHead)
    this.tail._next = null
    this.head._prev = null
    return this
  }

  eat (food) {
    if (this.head.x === food.x && this.head.y === food.y) {
      this.grow(this.growLength)
      return true
    }
    return false
  }
}

class SnakeGrid {
  constructor (width, height) {
    this.foodOptions = ['🫐', '🍓', '🥭', '🍉', '🍊', '🌽']
    this.gridWidth = width
    this.gridHeight = height
    this.snake = null
    this.food = null
    this.gameOver = false
  }

  _createSnake () {
    let xlowerBound = Math.floor(0.3 * this.gridWidth)
    let xupperBound = Math.floor(0.7 * this.gridWidth)
    let ylowerBound = Math.floor(0.3 * this.gridHeight)
    let yupperBound = Math.floor(0.7 * this.gridHeight)
    const randomX = randomInt(xlowerBound, xupperBound)
    const randomY = randomInt(ylowerBound, yupperBound)
    const randomDirection = pickRandom(Object.values(directionMap))
    return new Snake({
      x: randomX,
      y: randomY,
      direction: randomDirection
    })
  }

  _createFood () {
    return {
      x: randomInt(0, this.gridWidth - 1),
      y: randomInt(0, this.gridHeight - 1),
      text: pickRandom(this.foodOptions)
    }
  }

  start () {
    this.snake = this._createSnake()
    this.food = this._createFood()
    this.gameOver = false
  }

  update () {
    this.snake.walk()
    if (this.snake.eat(this.food)) {
      this.food = this._createFood()
    }

    if (this._isOutside() || this.overlap) {
      this.gameOver = true
      if (this.interval) {
        clearInterval(this.interval)
      }
      return false
    }

    return true
  }

  _createBlankGrid (w, h) {
    return new Array(h).fill(0).map(() => new Array(w).fill(0).map(() => 0))
  }

  _placeFood (grid, food) {
    let { x, y } = food
    while (grid[y][x] !== 0) {
      let newFood = this._createFood()
      this.food = newFood
      x = newFood.x
      y = newFood.y
    }
    grid[y][x] = 2
    return grid
  }

  _placeSnake (grid, snake) {
    let snakeHead = snake.head
    grid[snakeHead.y][snakeHead.x] = 3

    this.overlap = false
    while (snakeHead.next()) {
      snakeHead = snakeHead.next()
      if (
        grid[snakeHead.y] !== undefined &&
        grid[snakeHead.y][snakeHead.x] !== undefined
      ) {
        if (grid[snakeHead.y][snakeHead.x] === 3) {
          // overlap with head
          this.overlap = true
        }

        grid[snakeHead.y][snakeHead.x] = 1
      }
    }

    return grid
  }

  _isOutside () {
    const node = this.snake.head
    return (
      node.x < 0 ||
      node.x >= this.gridWidth ||
      node.y < 0 ||
      node.y >= this.gridHeight
    )
  }

  getGrid () {
    let grid = this._createBlankGrid(this.gridWidth, this.gridHeight)
    if (this.snake && this.food) {
      grid = this._placeSnake(grid, this.snake)
      grid = this._placeFood(grid, this.food)
    }
    return grid
  }
}
export default SnakeGrid
