// Logic part


export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}

export function createBoard (boardSize, numberOfMines) {

    const board = []
    const minesPositions= getMinePositions(boardSize, numberOfMines)

        for ( let x = 0; x < boardSize; x++){
            const row = []
            for ( let y = 0; y < boardSize; y++){
                const element = document.createElement("div")
                //DEFAULT status of the Each tile
                element.dataset.status = TILE_STATUSES.HIDDEN

                const tile = {
                    element,
                    x,
                    y,
                       // check to see if the positions of the minepositions, one 
                       // of them matches the current x and y co0dinates
                    mine: minesPositions.some(positionMatch.bind(null,{x,y})),

                    // get and set the status of the tile directly
                    get status() {
                        return this.element.dataset.status
                    },
                    set status(value) {
                        this.element.dataset.status = value
                    }
                }
            row.push(tile)
        }
        board.push(row)
        }  
        return board
}

export function markTile(tile) {
    //Check to see if the tile we are marking is eligible to marked.
    //we can only mark a tile that is hidden or unmark a tile that has been marked.
    if (
        // tile.status is not hidden and marked
        tile.status !== TILE_STATUSES.HIDDEN && 
        tile.status !== TILE_STATUSES.MARKED
        ) {
        return
    }
       // check to see if are we marking it for the first time or are we unmarking it.
    if(tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN
    } else {
        tile.status = TILE_STATUSES.MARKED
    }
}

export function revealTile(board, tile) {
    if(tile.status !== TILE_STATUSES.HIDDEN) {
        return
    }
    if(tile.mine) {
        tile.status = TILE_STATUSES.MINE
        return
    }
    tile.status = TILE_STATUSES.NUMBER
    const adjacentTiles = nearbyTiles(board, tile)
    // get the mines that are adjacent to it.
    const mines = adjacentTiles.filter(t => t.mine)
    if (mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board))
    } else {
        tile.element.textContent = mines.length
    }
}

export function checkWin(board) {
    return board.every(row =>{
        return row.every(tile => {
            return tile.status === TILE_STATUSES.NUMBER ||   // is the tile a number tile 
                (tile.mine &&   // or is a mine
                    (tile.status === TILE_STATUSES.HIDDEN || // and is it hidden 
                        tile.status === TILE_STATUSES.MARKED)) // or marked
            
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}

function getMinePositions(boardSize, numberOfMines){
    const positions = []

    while(positions.length < numberOfMines) {
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize), 
        }
        // p => positionMatch(p,position)
        if (!positions.some(positionMatch.bind(null, position))){
            positions.push(position)
        }
    }
    
    return positions
}

function positionMatch(a,b){
    return a.x === b.x && a.y === b.y
}
function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

// get all the adjacentTiles for the tile we pass in of this board
function nearbyTiles(board, {x,y}) {
    const tiles = []

    for(let xoffSet = -1; xoffSet <= 1; xoffSet++){
        for(let yoffSet = -1; yoffSet <= 1; yoffSet++){
            const tile = board[x + xoffSet]?.[y + yoffSet] 
            if (tile) tiles.push(tile)
        }
    }
    return tiles
}