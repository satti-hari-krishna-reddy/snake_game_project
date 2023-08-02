const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');
// snakeX , snakeY are head of the snake
let foodX , foodY , velocityX=0 , velocityY=0 , blockSize=20 , snakeX=blockSize*5 , snakeY=blockSize*5 , gameOver=false , score = 0;

// an array to store the snake body
let snakeBody=[];

// set to store to x and y values of snake 
const snakePositions = new Set();

// first set an initial random position for the food
changeFoodPosition();

// event listener to get input from keyboard arrow keys
document.body.addEventListener("keydown",changeSnakeDirection);

// we use this to allow only one key press per function
let isKeyPressed = false;

// This the the fuction that draws the game on the canvas 
function drawTheGame()
{
    // move the snake
    moveSnake();

   if(isGameOver())
   {
    return;
   }
    ifFoodEaten();

    drawScreen();

    // this draws the snake after moving it
    drawSnake();

   // calls the drawTheGame function repeatedly so that we can make our snake moving
    setTimeout(drawTheGame,1000/7); 

}

function isGameOver()
{
  if(snakeX<0)
    gameOver= true;

  else if(snakeX>=canvas.width) 
    gameOver= true;

  else if(snakeY<0) 
    gameOver= true;

  else if(snakeY>=canvas.height) 
    gameOver=true;

  else if(snakePositions.has(snakeX + "," + snakeY))
      gameOver=true;
  
  if(gameOver)
  {
    context.fillStyle='white';
    context.font="50px verdana";
    context.fillText("Game Over!", canvas.width/6.5, canvas.height/2);
  }
  return gameOver;
}
function drawScreen()
{
   // fills black color on the  entire canvas
   context.fillStyle='black';
   context.fillRect(0,0,canvas.width,canvas.height);
   // fills food block in red color at food x,y position
   context.fillStyle='red';
   context.fillRect(foodX,foodY,blockSize,blockSize);
   // draws the score at top right corner
   context.fillStyle='white';
   context.font="11px verdana";
   context.fillText("Score " + score, canvas.width-50, 10);
   isKeyPressed=false;


}

 function changeSnakeDirection(e)
{  
  if(!isKeyPressed) // this condition checks only one key press per function call
    {
      isKeyPressed=true;
    
      if(e.code==="ArrowUp" && velocityY!=1)
       {
         velocityX=0;
         velocityY=-1;
       }
      else if(e.code==="ArrowDown" && velocityY!=-1)
      {
         velocityX=0;
         velocityY=1;
      }
     else if(e.code==="ArrowLeft" && velocityX!=1)
      {
         velocityX=-1;
         velocityY=0;
      }
    else if(e.code==="ArrowRight" && velocityX!=-1)
     {
         velocityX=1;
         velocityY=0;
     }
    }

   else return;
}

// this function makes atmost 10 attempts to find a new position for food before it gives up
function changeFoodPosition()
{    
    for(let i = 0;i<10;i++)
     {
      // selects random position for food x,y
      foodX=Math.floor(Math.random()*((canvas.width/blockSize)-1))*(blockSize);
      foodY=Math.floor(Math.random()*((canvas.height/blockSize)-1))*(blockSize);
      if(!snakePositions.has(foodX + "," +foodY))
         return;
     }
}

function drawSnake()
  {
    // head will be always lime color
    context.fillStyle='lime';
    context.fillRect(snakeX,snakeY,blockSize,blockSize); 

    for(let i=0;i<snakeBody.length;i++)
     {
       // Generating the random color for rest of the body
        const randomColor = `rgb(${Math.floor(Math.random() * 160)}, ${Math.floor(Math.random() * 160)}, ${Math.floor(Math.random() * 160) + 96})`;

        context.fillStyle = randomColor;
        context.fillRect(snakeBody[i][0],snakeBody[i][1],blockSize,blockSize); 
     }
  }

function ifFoodEaten()
{   
    /* if snake x,y and food x,y are same then we have to increase snake body and increment the score
       and set new position for food x,y */
    if(foodX==snakeX && foodY==snakeY)
    {
        snakeBody.push([foodX,foodY]);
        score++;
        changeFoodPosition();

    }               
   
}

function moveSnake()
{ 
   // clear the previous positions of snake to store new positions
   snakePositions.clear();

  // first move entire snake body one block position towards the head starting from tail
  for(let i=snakeBody.length-1;i>0;i--)
   { 
     // adding snake positions into a set for efficent searching for collision detection with head
     snakePositions.add(snakeBody[i][0]+ "," +snakeBody[i][1]);

     snakeBody[i]=snakeBody[i-1];
   }

  if(snakeBody.length>0)
    {
      snakeBody[0]=[snakeX,snakeY];
      snakePositions.add(snakeBody[0][0]+ "," +snakeBody[0][1]);
    }
  // now finally move the head 
  snakeX+=velocityX*blockSize;
  snakeY+=velocityY*blockSize;
}

// start the game by calling drawTheGame
drawTheGame();