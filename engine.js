// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', SetupCanvas);

// Monitors whether game is currently in play
let running = false;
let gameOver = false;

let AnimationId;

var oSnake;


// Used to monitor whether paddles and ball are
// moving and in what direction
let DIRECTION = {
    STOPPED: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

function SetupCanvas(){

    // Reference to the canvas element
    canvas = document.querySelector("canvas");

    // Context provides functions used for drawing and 
    // working with Canvas
    ctx = canvas.getContext('2d');

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    document.addEventListener('keydown', MovePlayerPaddle);

    // trigger Animation
    // AnimationId = requestAnimationFrame(gameLoop);
    gameOver = false;
    running = false;

    oSnake = new Snake(200, 200, 'green');
    oSnake.draw();
    
}
class Snake {

    constructor(x, y, color){

        this.color = color;

        // let _x = 0;
        // let _y = 0;

        this._x = x;
        this._y = y;

        
        this.previousX = x-20;
        this.previousY = y;

        // defines movement direction of paddles
        this.move = DIRECTION.STOPPED;

        // defines how quickly tiles can be moved
        this.velocity = 20;
        this.snappedTiles = [];

        // save head's positon for next tile
        let tilePosX = this.previousX;
        let tilePosY = this.previousY;

        console.log("constructor-x.y: " + this.x + "-" + this.y);
        console.log("constructor-Posx.Posy: " + tilePosX + "-" + tilePosY);

        // adding default tiles to initial body
        for (let index = 0; index < 3; index++) {
            this.snappedTiles.push(new Tile(tilePosX, tilePosY, this.velocity, "blue", "@", tilePosX-20, tilePosY))
            tilePosX -= 20;
            // tilePosY = tilePosY;    // Y does not change fo the initial setup       
        }
        console.log("Snake.constructor.1");
        console.log(this.snappedTiles)
    }
    get x() {
        return this._x;
    }
    set x(newValue) {
        this._x= newValue;
        //this.SetPreviousPos();
    }
    get y() {
        return this._y;
    }
    set y(newValue) {
        this._y = newValue;
        //this.SetPreviousPos();
    }
    draw(){

        // draw head
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, 20, 20);

        // el ojo
        ctx.beginPath();
        ctx.arc(this.x+12, this.y+5, 2, 0, Math.PI*2, false);
        ctx.fillStyle = 'black';
        ctx.fill();
        
        console.log("contruct.draw.1");
        console.log(this.snappedTiles)

        //Draw individual tiles into body
        for (let index = 0; index < this.snappedTiles.length; index++) {

            const currentTile = this.snappedTiles[index];
            currentTile.draw();
        }
        // console.log("contructdraw.2");
        // console.log(this.snappedTiles)
    }
    update(){

        // console.log("SetPreviousPos.enter");

        // save previous position
        this.previousX = this._x;
        this.previousY = this._y;

        // here it is where my next tile should be
        switch (this.move) {
            case DIRECTION.DOWN:
                oSnake.y += oSnake.velocity;
                break;
            case DIRECTION.UP:
                oSnake.y -= oSnake.velocity;
                break;        
            case DIRECTION.RIGHT:
                oSnake.x += oSnake.velocity;
                break;     
            case DIRECTION.LEFT:
                oSnake.x -= oSnake.velocity;
                break;
        }
        console.log("update.updatePrevious.1");
        console.log(this.snappedTiles)

        var tilePosX = this.previousX;
        var tilePosY = this.previousY;

        //Draw individual tiles into body
        for (let index = 0; index < this.snappedTiles.length; index++) {

            const currentTile = this.snappedTiles[index];

            currentTile.update(tilePosX, tilePosY);

            // set the positon for the next tile
            tilePosX = currentTile.previousX;
            tilePosY = currentTile.previousY

        }
        console.log("update.updatePrevious.2");
        console.log(this.snappedTiles)
    }
}
class Tile {

    constructor(x, y, velocity, color, letter, previousX, previousY){

        this.color = color;

        // position on canvas
        this.x = x;
        this.y = y;

        this.previousX = previousX;
        this.previousY = previousY;

        this.width = 20;
        this.height = 20;

        this.velocity = velocity;

        // Defines movement direction of paddles
        this.move = DIRECTION.STOPPED;

        this.letter = letter;

        this.snapped = false;

    }
    draw(){

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();

        ctx.fillStyle = 'rgba(0,0,255)';
        ctx.font = "10pt sans-serif";
        ctx.strokeText(this.letter, this.x+3, this.y+15);

    }
    update(newPosX, newPosY){

        // console.log("tile.update.enter: " + this.previousX  + "-" + this.previousY + "-" + newPosX + "-" + newPosY);

        // save my current postion
        this.previousX = this.x;
        this.previousY = this.y;

        // set my new postion
        this.x = newPosX;
        this.y = newPosY;

    }
}
function gameLoop(){

    // console.log("Game is On!!");
    if(gameOver==false) {

        AnimationId = requestAnimationFrame(gameLoop);

        // TDO: Use when want to keep it moving automatically
        //update();
        paint();

    } else {

        // Finish the game
        cancelAnimationFrame(AnimationId)
        console.log("gameOver: " + gameOver);

        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = "red";
        ctx.fillText("Game Over!!!",canvas.width/2, canvas.height/2);
        
    }
}
function paint(){

    // Clear the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Draw Canvas background
    ctx.fillStyle = 'rgb(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    oSnake.draw();

}
function update(){

    // console.log("update.enter")

    oSnake.update();

    // if player tries to move off the board prevent that (LE: No need for this game)
    if(oSnake.y <= 0){
        gameOver = true;
    } else if(oSnake.y >= (canvas.height)){
        gameOver = true;
    }
}
function MovePlayerPaddle(key){

    if(running === false){
        running = true;
        window.requestAnimationFrame(gameLoop);
    }
    
    // handle scape as game over
    if(key.keyCode === 27) gameOver = true;

    // Handle space bar for PAUSE
    if(key.keyCode === 32) {
        running = false;
    }

    // Handle up arrow and w input
    if(key.keyCode === 38 || key.keyCode === 87) oSnake.move = DIRECTION.UP;
    // Handle down arrow and s input
    if(key.keyCode === 40 || key.keyCode === 83) oSnake.move = DIRECTION.DOWN;

    // Handle left arrow and a input
    if(key.keyCode === 37 || key.keyCode === 65) oSnake.move = DIRECTION.LEFT
    // Handle right arrow and d input
    if(key.keyCode === 39 || key.keyCode === 68) oSnake.move = DIRECTION.RIGHT;
    
    update();

    // console.log("key.code: " + key.keyCode)
}