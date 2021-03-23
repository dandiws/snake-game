<script>
  import SnakeGrid from "snake-core";

  export let gridSize;
  export let intervalTime;

  let [w, h] = gridSize;
  let snakeGame = new SnakeGrid(w, h);
  snakeGame.start();

  let gameOver = false;
  let isStarted = false;
  let restart = false;
  let interval;

  $: grid = snakeGame.getGrid();
  $: foodMoji = snakeGame.food && snakeGame.food.text;

  const keydownHandler = (e) => {
    if (!isStarted) {
      if (e.key === " ") {
        startGame();
        isStarted = true;
      }
      return;
    }

    switch (e.key) {
      case "ArrowLeft":
        snakeGame.snake.switchDirection("LEFT");
        break;
      case "ArrowRight":
        snakeGame.snake.switchDirection("RIGHT");
        break;
      case "ArrowDown":
        snakeGame.snake.switchDirection("DOWN");
        break;
      case "ArrowUp":
        snakeGame.snake.switchDirection("UP");
        break;
      default:
        break;
    }
  }

  document.addEventListener("keydown", keydownHandler);

  function handleGameOver() {
    gameOver = true;
    isStarted = false;
    clearInterval(interval);
    restart = true;
  }

  const startGame = () => {
    if (restart) {
      snakeGame.start();
      snakeGame = snakeGame;
    }

    interval = setInterval(() => {
      snakeGame.update();
      if (snakeGame.gameOver) {
        handleGameOver(interval);
      } else {
        snakeGame = snakeGame;
      }
    }, intervalTime);
  };
</script>

<main>
  <h1>Snake Game</h1>
  <div class="info">
    {#if gameOver}
      <span>Game Over 🎆</span>
    {/if}
    <span>Score : {snakeGame.snake ? snakeGame.snake.size() : 0}</span>
  </div>
  <div
    class="grid"
    style="grid-template-rows: repeat({h},20px);grid-template-columns: repeat({w},20px);"
  >
    {#each grid as row}
      {#each row as cell}
        <div
          class="
            cell 
            {cell === 1
            ? 'snake'
            : ''} 
            {cell === 2 ? 'food' : ''}
            {cell === 3
            ? 'head'
            : ''}
            "
          data-food={cell === 2 ? foodMoji : ""}
        />
      {/each}
    {/each}
  </div>
  <div class="toolbar">
    <button on:click={startGame} disabled={isStarted}
      >Click or Press space to play</button
    >
  </div>
</main>

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
    content: "";
    background: #e4f121;
    border-color: #e4f121;
    border-radius: 2px;
  }
  .cell.snake::after {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    content: "";
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
