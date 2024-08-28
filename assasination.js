 
//Canvas Drawing - Global Variables
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let percentField = document.getElementById("inputPercent");
let timer;
let kingCount=0;
let kingRow;
let kingCol;
let killerCount=0;
let killerSum=1;
let killerRow;
let killerCol;
let color="green";

//creating an object
function Cell(t,hp){
  this.type=t;
  this.health=hp;
}

ctx.translate(0,10);

function drawKiller(x,y){
  ctx.save();
  ctx.fillStyle=color;
  ctx.fillText("K",x*10,y*10);
  //Add code - draw a killer
  ctx.restore();
}

function drawOrganism(x,y){
  ctx.save();
  ctx.fillText("*",x*10,y*10);
  //Add code - draw a shape for an organism
  ctx.restore();
}

function drawVWall(x,y){
  ctx.save();
  ctx.fillText("|",x*10,y*10);
  //Add code - draw a shape for the vertical walls
  ctx.restore();
}

function drawHWall(x,y){
  ctx.save();
  ctx.fillText("-",x*10,y*10);
  //Add code - draw a shape for the horizontal walls
  ctx.restore();
}

function drawEmpty(x,y){
  ctx.save();
  ctx.fillText(" ",x*10,y*10);
  //Add code - draw a shape for an empty space
  ctx.restore();
}

function drawCorner(x,y){
  ctx.save();
  ctx.fillText("C",x*10,y*10);
  //Add code - draw the corner shape 
  ctx.restore();
}

function drawKing(x,y){
  ctx.save();
  ctx.fillStyle="red";
  ctx.fillText("$",x*10,y*10);
  //Add code - draw the king 
  ctx.restore();
}

function clickFillButton(){
  ctx.clearRect(0,0,1000,500);
  randomFill();
  printWorld();
}

function clickStartButton(){
  let timerSpeed = document.getElementById("speed").value;
  timer = setInterval(runSim, timerSpeed);
}

function clickStopButton(){
  clearInterval(timer);
}

function clickResetButton(){
  clearInterval(timer);
  buildEmptyWorld();    
  buildEmptyWorldCopy();  
  gen = 0;
  kingCount=0;
  kingRow="";
  kingCol="";
  killerCount=0;
  killerSum=1;
  printWorld();
}

// Main Program & Global Variables
let HEIGHT = 50;
let ROWS = HEIGHT-2; // to account for the top & bottom border/wall
let WIDTH = 100;
let COLS = WIDTH-2; // to account for the left & right border/wall

let VACUUM = ' '; 
let EMPTY = '0';  
let ORGANISM = '*';  
let LEFTRIGHTWALL = '|';  
let TOPBOTTOMWALL = '-';  
let CORNERSWALL = 'C';  
let KING='$';
let KILLER='K';

canvas.onclick = function king(){
  if(kingCount==0){
  ctx.fillStyle="red";
  ctx.fillText(KING,event.offsetX-event.offsetX%10,event.offsetY+10-event.offsetY%10);
  kingCount+=1;
  kingCol=Math.trunc(event.offsetX/10);
  kingRow=Math.trunc(event.offsetY/10);
  //console.log("king="+kingRow+","+kingCol);
  ctx.fillStyle="black";
  }
}

// Build the initial empty world array and worldCopy array (for calculating the next generation)
let world = new Array(HEIGHT);  // 2-dimensional character array for storing the world
for (let r = 0; r < HEIGHT; r++){
  let newRow = new Array(WIDTH);
  for (let c = 0; c < WIDTH; c++){
    newRow[c] = VACUUM;  // just to put something/nothing into the array
  }
  world[r] = newRow.slice();  // copy the new row to the array
}
buildEmptyWorld();    

let worldCopy = new Array(HEIGHT);  // used for copying the world while processing next generation
for (let r = 0; r < HEIGHT; r++){
  let newRow = new Array(WIDTH);
  for (let c = 0; c < WIDTH; c++){
    newRow[c] = VACUUM;  // just to put something/nothing into the array
  }
  worldCopy[r] = newRow.slice();  // copy the new row to the array
}
buildEmptyWorldCopy();

let gen = 0;  //start with Generation 0

function buildEmptyWorld(){
  // fill the entire world with appropriate characters
  for (let row = 0 ; row < HEIGHT ; row++){
    for (let col = 0 ; col < WIDTH ; col++){
      if ((row == 0 && col == 0)||(row == 0 && col == (WIDTH-1))||(row == (HEIGHT-1) && col == 0)||(row == (HEIGHT-1) && col == (WIDTH-1))){
        world[row][col] = new Cell(CORNERSWALL);
      }
      else if (row==0||row==HEIGHT-1){  //Add code - if on the top row or bottom row
        world[row][col] = new Cell(TOPBOTTOMWALL); 
      }
      else if (col==0||col==WIDTH-1){  //Add code - if on the very left or very right col
        world[row][col] = new Cell(LEFTRIGHTWALL);
      }
      else {  // inside the walls all cells are empty
        world[row][col] = new Cell(EMPTY);
      }
    }
  }
}

function buildEmptyWorldCopy(){
    // fill the entire worldCopy with appropriate characters
    for (let row = 0 ; row < HEIGHT ; row++){
      for (let col = 0 ; col < WIDTH ; col++){
        if ((row == 0 && col == 0)||(row == 0 && col == (WIDTH-1))||(row == (HEIGHT-1) && col == 0)||(row == (HEIGHT-1) && col == (WIDTH-1))){
          worldCopy[row][col] =  new Cell(CORNERSWALL);
        }
        else if (row==0||row==HEIGHT-1){  //Add code - if on the top row or bottom row
          worldCopy[row][col] = new Cell(TOPBOTTOMWALL); 
        }
        else if (col==0||col==WIDTH-1){  //Add code - if on the very left or very right col
          worldCopy[row][col] = new Cell(LEFTRIGHTWALL); 
        }
        else {  // inside the walls all cells are empty
          worldCopy[row][col] = new Cell(EMPTY);
        }
      }
    }
  }
  
  
// randomly fills the world with given percentage
function randomFill(){ 
  let percent=document.getElementById("inputPercent").value; 
        killerRow= Math.trunc(Math.random()*48)+1;
        killerCol= Math.trunc(Math.random()*98)+1;
  // for each location inside the walls of world
  for (let row = 1 ; row <= ROWS; row++){
    for (let col = 1 ; col <= COLS; col++){
      if (row==kingRow&&col==kingCol){
        world[row][col] = new Cell(KING);
      }
      else if(killerCount==0&&killerCol==col&&killerRow==row){
        world[killerRow][killerCol]=new Cell(KILLER,1);
        killerCount+=1;  
      }
      else if (Math.trunc(Math.random()*100)<percent){ 
        world[row][col] = new Cell(ORGANISM);
      }
      else{ 
        world[row][col] = new Cell(EMPTY);  
      } 
    }
  }  
}
  

  
// a method that returns number of neighbours of a given position
function countNeighbours(row, col){
  let count = 0;
  for (let i=row-1;i<row+2;i++){
    for (let j=col-1;j<col+2;j++){
      if ((i==row&&j==col)==false){
        if(world[i][j].type==ORGANISM){
          count+=1;
        }
      }
    }    
  } 
  //console.log(count);
  //console.log("next");
  return count;  
}
  
// process what will be in the position at the next generation
function nextGen(){
  // only process inside the walls
  for (let row = 1; row <= ROWS; row++){
    for (let col = 1; col <= COLS; col++){
      if(killerCount==0){
        killerRow= Math.trunc(Math.random()*48)+1;
        killerCol= Math.trunc(Math.random()*98)+1;
        worldCopy[killerRow][killerCol].type=KILLER;
        worldCopy[killerRow][killerCol].health=1;
        world[killerRow][killerCol].health=1;
        color="green";
        killerCount+=1;  
      }
      else if (world[row][col].type!==KING&&world[row][col].type!==KILLER&&(killerRow==row&&killerCol==col)==false){
        let numNeighbours = countNeighbours(row,col);

        if(numNeighbours===3){
          worldCopy[row][col].type=ORGANISM;
        }
        else if(numNeighbours>3||numNeighbours<2){
          worldCopy[row][col].type=EMPTY;
        }
      }
      else if (world[row][col].type==KING&&(killerRow==row&&killerCol==col)==false){
        worldCopy[row][col].type=KING;
      }
      else if (world[row][col].type==KILLER){
        if (kingRow<killerRow){
          killerRow=row-1;
        }
        if (kingCol<killerCol){
          killerCol=col-1;
        }
        if (kingRow>killerRow){
          killerRow=row+1;
        }
        if (kingCol>killerCol){
          killerCol=col+1;
        }

        if (world[killerRow][killerCol].type==ORGANISM&&world[row][col].health>0){
          worldCopy[killerRow][killerCol].type=KILLER;
          worldCopy[killerRow][killerCol].health=world[row][col].health-1;
          worldCopy[row][col].type=EMPTY;
        }
        else if(world[killerRow][killerCol].type==ORGANISM&&world[row][col].health==0){
          worldCopy[row][col].type=EMPTY;
        }    
        else if(world[killerRow][killerCol].type==KING){
          worldCopy[killerRow][killerCol].type=KILLER;
          worldCopy[row][col].type=EMPTY;
        }
        else{
          worldCopy[killerRow][killerCol].type=KILLER;
          worldCopy[killerRow][killerCol].health=world[row][col].health;
          worldCopy[row][col].type=EMPTY;
        }

        if (worldCopy[killerRow][killerCol].health==1){
          color="green";
        }
        else if (worldCopy[killerRow][killerCol].health==0){
          color="red";
        }
      }
    }
  }
  copyWorld();  
  console.log("number of killers:"+killerCount);
}
  
// copy all values for the next generation from 'worldCopy' to 'world'
function copyWorld(){
  for (let row = 0; row < HEIGHT; row++){
    for (let col = 0;col < WIDTH; col++){
      world[row][col].type = worldCopy[row][col].type;
      world[row][col].health= worldCopy[row][col].health;
    }
  }
}
  
// a method that returns true if world is EMPTY, otherwise return false
function worldIsEmpty(){
  for (let row = 1; row <= ROWS; row++){
    for (let col = 1; col <= COLS; col++){
      if (world[row][col].type==KING){ 
        return false;
      }
    }
  }
  return true;  // return true if the world is completely empty
}

function killerCheck(){
  for (let row = 1; row <= ROWS; row++){
    for (let col = 1; col <= COLS; col++){
      if (world[row][col].type==KILLER){ 
        return false;
      }
    }
  }
  return true;  
}
  
// a method that prints out the entire world (including the edges/walls)
function printWorld(){
  ctx.clearRect(0,0,1000,500);
  console.log("current generation"+gen);

  for (let row = 0; row < HEIGHT; row++){ 
    let str="";   
    for (let col = 0; col < WIDTH; col++){
      str+=world[row][col].type; 
      //Add code - build up a string with all the characters in the row
      switch (world[row][col].type){
        // Note - coords need to be reversed when converting to drawing in Canvas!
        case "*": drawOrganism(col,row);
                            break;
        case "0": drawEmpty(col,row);
                            break;
        case "|": drawVWall(col,row);
                            break;  
        case "-": drawHWall(col,row);
                            break;
        case "C": drawCorner(col,row);
                            break;
        case "$": drawKing(col,row);
                            break;  
        case "K": drawKiller(col,row);
                            break;      
      }
    }
    console.log(str);
  }
}

function runSim(){
  gen++;
  let genDisplay = document.getElementById("generation");
  genDisplay.innerHTML = "Days of reign of the king: " + gen+". Assassination attempts: "+killerSum;
  nextGen();  // process next generation
  printWorld();  // print the world
 
  if (worldIsEmpty()){  // check if world is EMPTY
    genDisplay.innerHTML = "The KING is dead on day: " + gen+". Assassination succeded on atempt: "+killerSum+". All heil the new KING!";  // print this message and stop the loop
    clickStopButton();  
  }

  if(killerCheck()){
    killerCount=0;
    killerSum+=1;
  }
}

