//Display/UI

import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin,checkLose} from './minesweeper.js'

     // Constant Variables
const BOARD_SIZE= 8
const NUMBER_OF_MINES = 4

    //Getting some variables
const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector(".board")
const minesLeftText = document.querySelector("[data-mine-count]")
const messageText = document.querySelector('.sub__text')
// console.log(board)

//Setting the board
board.forEach(row =>{
    row.forEach(tile =>{
        boardElement.append(tile.element)
        //Left click on a tile 
        //bubble phase // their events fires after the click event
        tile.element.addEventListener('click', () => {
            revealTile(board, tile)
            checkGameEnd()
        })
        //Right click on a tile
        tile.element.addEventListener('contextmenu', e =>{
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})
      //setting styles from the css file.
boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
            }, 0)
    minesLeftText.textContent = NUMBER_OF_MINES -  markedTilesCount
}


function checkGameEnd(){
    const win= checkWin(board)
    const lose = checkLose(board)

    if (win || lose){
        // event propagation
        //capture phase occurs before the bubble phase
        boardElement.addEventListener("click", stopProp, { capture: true})
        boardElement.addEventListener("contextmenu", stopProp, { capture: true})
    }
    if (win) {
        messageText.textContent = 'You Win'
    }
    if(lose) {
        messageText.textContent = 'You Lose'
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status ===TILE_STATUSES.MARKED) markTile(tile)
                if (tile.mine) revealTile(board, tile)
            })
        })
    }
}
    // stops the event from going further down
function stopProp(e) { 
    e.stopImmediatePropagation()
}




// console.log( createBoard(2,2))



// 1. Populate the board with tiles and mines.
// 2. Left click on tiles 
          // Reveal the tile
// 3. Right click on tile.
           // Mark tiles.
// 4. Check for win/lose

