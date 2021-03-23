<template>
  <main>
    <h1>Snake Game</h1>
    <div class="info">
      <span v-if="gameOver">Game Over 🎆</span>
      <span>Score : {{ snakeGame.snake ? snakeGame.snake.size() : 0 }}</span>
    </div>
    <div
      class="grid"
      :style="{
        gridTemplateRows: `repeat(${h},20px)`,
        gridTemplateColumns: `repeat(${w},20px)`
      }"
    >
      <div
        v-for="(cell, index) in flattenedGrid"
        :key="index"
        class="cell"
        :class="{ snake: cell === 1, food: cell === 2, head: cell === 3 }"
        v-bind="{ 'data-food': cell === 2 ? foodMoji : undefined }"
      ></div>
    </div>
    <div class="toolbar">
      <button :onclick="startGame" :disabled="isStarted">
        Click or Press space to play
      </button>
    </div>
  </main>
</template>

<script>
import { computed, ref, toRefs } from 'vue'
import SnakeGrid from 'snake-core'

function flatten (grid) {
  return grid.reduce((acc, row) => [...acc, ...row], [])
}

export default {
  props: {
    gridSize: Array,
    intervalTime: Number
  },
  setup (props) {
    let { gridSize, intervalTime } = toRefs(props)
    const [w, h] = gridSize.value
    const snakeGame = new SnakeGrid(w, h)
    snakeGame.start()

    let gameOver = ref(false)
    let isStarted = ref(false)
    let restart = ref(false)
    let grid = ref(snakeGame.getGrid())
    const flattenedGrid = computed(() => flatten(grid.value))

    let interval
    const foodMoji = snakeGame.food && snakeGame.food.text

    const keydownHandler = e => {
      if (!isStarted.value) {
        if (e.key === ' ') {
          startGame()
          isStarted.value = true
        }
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          snakeGame.snake.switchDirection('LEFT')
          break
        case 'ArrowRight':
          snakeGame.snake.switchDirection('RIGHT')
          break
        case 'ArrowDown':
          snakeGame.snake.switchDirection('DOWN')
          break
        case 'ArrowUp':
          snakeGame.snake.switchDirection('UP')
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', keydownHandler)

    function handleGameOver () {
      gameOver.value = true
      isStarted.value = false
      clearInterval(interval)
      interval = null
      restart.value = true
    }

    const updateGrid = () => {
      grid.value = snakeGame.getGrid()
    }

    const startGame = () => {
      if (restart.value) {
        snakeGame.start()
        updateGrid()
      }

      interval = setInterval(() => {
        snakeGame.update()
        if (snakeGame.gameOver) {
          handleGameOver(interval)
        } else {
          updateGrid()
        }
      }, intervalTime.value)
    }

    return {
      w,
      h,
      foodMoji,
      snakeGame,
      gameOver,
      flattenedGrid,
      startGame,
      isStarted
    }
  }
}
</script>

<style>
main {
  text-align: center;
  margin: 0 auto;
  display: grid;
  place-items: center center;
}

h1 {
  color: #ff3c00;
  font-size: 2rem;
}

.info {
  font-size: 28px;
  margin-bottom: 1.5rem;
  width: 100%;
}

.grid {
  display: grid;
}

.cell {
  border: 1px solid rgb(13, 134, 19);
  display: block;
  background: rgb(44, 161, 50);
  position: relative;
}

.cell.head::after {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  background: #e4f121;
  border-color: #e4f121;
  border-radius: 2px;
}
.cell.snake::after {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  background: #fff020;
  border-color: #fff020;
  border-radius: 2px;
}

.cell.food::after {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  content: attr(data-food);
  border-radius: 5px;
}

.toolbar {
  padding: 1rem 0;
}

button {
  padding: 1rem 2rem;
  background: #257af8;
  color: white;
  font-size: 1.5rem;
  border: none;
}

button:disabled {
  opacity: 0.5;
}
</style>
