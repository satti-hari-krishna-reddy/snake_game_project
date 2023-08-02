const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');
// snakeX , snakeY are head of the snake
let foodX , foodY , velocityX=0 , velocityY=0 , blockSize=15 , snakeX=blockSize*5 , snakeY=blockSize*5 , gameOver=false , score = 0;

// an array to store the snake body
let snakeBody=[];

// set to store to x and y values of snake 
const snakePositions = new Set();

// Function to set canvas size and related calculations
function setCanvasSize() {
  // Check if the device is a desktop or mobile/tablet
  const isDesktop = window.innerWidth > 768; 

  if (isDesktop) {
    // For desktop, set fixed canvas dimensions (e.g., 400x400)
    canvas.width = 400;
    canvas.height = 400;
  } else {
    // For mobile and tablet, set canvas dimensions to 80% of the window width and height
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.7;
  }
}

// Call setCanvasSize initially and add event listener for window resize
setCanvasSize();
window.addEventListener('resize', setCanvasSize);


// first set an initial random position for the food
changeFoodPosition();

// event listener to get input from keyboard arrow keys
document.body.addEventListener("keydown",changeSnakeDirection);

let touchStartX, touchStartY;

document.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', (event) => {
  
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY))
   {
    if (deltaX > 0 && velocityX!=-1)
     {
        // Swipe right
        velocityX = 1;
        velocityY = 0; 
     } 

    else if(deltaX < 0 && velocityX!=1)
     {
        // Swipe left
        velocityX = -1;
        velocityY = 0;
     }
  } 

  else
   {
    if (deltaY > 0 && velocityY!=-1) 
     {
        // Swipe down
        velocityX = 0;
        velocityY = 1;
    } 

    else if(deltaY < 0 && velocityY!=1)
     {
       // Swipe up
       velocityX = 0;
       velocityY = -1;
    }
  }});


// we use this to allow only one key press per function call
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

    // this draws the snake after moving 
    drawSnake();

   // calls the drawTheGame function repeatedly so that we can make our snake moving
    setTimeout(drawTheGame,1000/9); 

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
    context.font=`${canvas.width * 0.1}px verdana`; 
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

   // reset it back to false to allow key presses for next function call 
   isKeyPressed=false;


}

 function changeSnakeDirection(e)
{ 

  if(!isKeyPressed) // this condition allows only one key press per function call
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
    for(let i = 0; i < 10; i++)
     {
      /* selects random position for food x,y and we are subtracting 1 to avoid 
         the food being placed at border positions on the canvas*/
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
    
   /* this condition is to handle when snakeBody = 1 and also to move
    the part which was just behind the head to move to the previous head positon*/ 
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
