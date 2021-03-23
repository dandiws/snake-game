import './App.css'
import SnakeGrid from 'snake'
import { useCallback, useEffect, useRef, useState } from 'react'

function App ({ gridSize, intervalTime }) {
  const [w, h] = gridSize
  const snakeGame = useRef(new SnakeGrid(w, h))
  const [gameOver, setGameOver] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [restart, setRestart] = useState(false)
  const [grid, setGrid] = useState(() => snakeGame.current.getGrid())
  const interval = useRef(null)
  const foodMoji = snakeGame.current.food && snakeGame.current.food.text

  useEffect(() => {
    snakeGame.current.start()
    setGrid(snakeGame.current.getGrid())
  }, [])

  const updateGrid = () => {
    setGrid(snakeGame.current.getGrid())
  }

  const handleGameOver = useCallback(() => {
    setGameOver(true)
    setIsStarted(false)
    clearInterval(interval.current)
    interval.current = null
    setRestart(true)
  }, [])

  const startGame = useCallback(() => {
    if (restart) {
      snakeGame.current.start()
      updateGrid()
    }
    interval.current = setInterval(() => {
      snakeGame.current.update()
      if (snakeGame.current.gameOver) {
        handleGameOver(interval)
      } else {
        updateGrid()
      }
    }, intervalTime)
  }, [restart, intervalTime, handleGameOver])

  const handleKeydown = useCallback(
    e => {
      if (!isStarted) {
        if (e.key === ' ') {
          startGame()
          setIsStarted(true)
        }
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          snakeGame.current.snake.switchDirection('LEFT')
          break
        case 'ArrowRight':
          snakeGame.current.snake.switchDirection('RIGHT')
          break
        case 'ArrowDown':
          snakeGame.current.snake.switchDirection('DOWN')
          break
        case 'ArrowUp':
          snakeGame.current.snake.switchDirection('UP')
          break
        default:
          break
      }
    },
    [isStarted, startGame]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])

  return (
    <main>
      <h1>Snake Game</h1>
      <div className='info'>
        {gameOver && <span>Game Over 🎆</span>}
        <span>
          Score : {snakeGame.current.snake ? snakeGame.current.snake.size() : 0}
        </span>
      </div>
      <div
        className='grid'
        style={{
          gridTemplateRows: `repeat(${h},20px)`,
          gridTemplateColumns: `repeat(${w},20px)`
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => {
            return (
              <div
                key={`${i}${j}`}
                className={`
                cell
                ${cell === 1 ? 'snake' : ''} 
                ${cell === 2 ? 'food' : ''}
                ${cell === 3 ? 'head' : ''}
                `}
                data-food={cell === 2 ? foodMoji : ''}
              />
            )
          })
        )}
      </div>
      <div className='toolbar'>
        <button onClick={startGame} disabled={isStarted}>
          Click or Press space to play
        </button>
      </div>
    </main>
  )
}

export default App
