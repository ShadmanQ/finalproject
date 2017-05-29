//game variables
var floor;
var player;
var playerHealth = 20;
var score = 0;
var finalScore;
var DeadPlayer = false;


var multiplier = 0;

var JUMP = -15.0;
var GRAVITY = 20.0;

var bassBlocks;
var midBlocks;
var trebleBlocks;
var easySong;
var medSong;
var hardSong;
var thefft;




var theEndBarThing;
var gameFont;
var otherFont;
var startTime;

var gameStart = false;
var gameOver = false;


//in game assets
function preload(){
	Song = loadSound("assets/mario.mp3");
	thefft = new p5.FFT;
	gameFont = loadFont("assets/BadMofo.ttf");
	otherFont = loadFont("assets/coolvetica rg.ttf");
}

function setup() {

	//the title screen
  createCanvas(windowWidth, windowHeight);
	textFont(gameFont);

//p5 play groups to hold the platforms
	bassBlocks = new Group;
	midBlocks = new Group;
	trebleBlocks = new Group;



//the end bar thing you see in music
  theEndBarThing = createSprite(width-20, height/2+50,30,600);
  theEndBarThing.shapeColor = color(245,245,245);


  floor = createSprite( width/2, height-50, width, 20);
  floor.shapeColor = color(50);

//sprites that represent the lines on sheet music
  line1 = createSprite(width/2,height-200,width,5);
  line1.shapeColor = color(50);

  line2 = createSprite(width/2,height-350,width,5);
  line2.shapeColor = color(50);

  line3 = createSprite(width/2,height-500,width,5);
  line3.shapeColor = color(50);

  ceiling = createSprite(width/2,height-650,width, 20);
  ceiling.shapeColor = color(50);


//sets up the player character
  player = createSprite();
  player.addAnimation("running","assets/run 1.png","assets/run 6.png");
  player.position.x = 200;
  player.position.y = floor.position.y-50;

}
function draw() {
  background(50);


if (!gameStart){
	fill(255);
	textSize(200);
	textAlign(CENTER);
	text("Rhythm Runner",width/2,height/2-200);
	textSize(60);
	textFont(otherFont);
	text("Press A to start!",width/2,height/2-110);
	textSize(30);
	text("Right to run, Up to Jump",width/2,height/2-60);
	textSize(25);
	if (keyIsDown(65)){
		gameStart = true;
		startTime = millis();
	}
}

// initiates the game background;
else{

	floor.shapeColor=color(245,245,245);
	ceiling.shapeColor=color(245,245,245);
	line1.shapeColor=color(245,245,245);
	line2.shapeColor=color(245,245,245);
	line3.shapeColor=color(245,245,245);
// seperate game logic function
  GameLogic();
}
  drawSprites();
}


function GameLogic(){


	if (!Song.isPlaying())
	{	
		Song.play();

	}


if (millis() > (startTime + song.Duration)){
	finalScore = score;
	gameOver = true;
}


if (playerHealth ==0){
	DeadPlayer = true;
	finalScore = score;
}
spectrum = thefft.analyze();

//basically, the higher up you are the higher your multiplier
if ((player.position.y < floor.position.y) && (player.position.y > line1.position.y)){
	multiplier = 1;
}

if ((player.position.y < line1.position.y) && (player.position.y > line2.position.y)){
	multiplier = 2;
}

if ((player.position.y < line2.position.y) && (player.position.y > line3.position.y)){
	multiplier = 3;
}

if ((player.position.y < line3.position.y) && (player.position.y > ceiling.position.y)){
	multiplier = 4;
}




player.velocity.x = -2.5;
player.velocity.y=GRAVITY;

//gets the energy of the bass, mids, and treble frequencies of the song
var bassEnergy = thefft.getEnergy('bass');
var midsEnergy = thefft.getEnergy('mid');
var trebleEnergy = thefft.getEnergy('treble');

//decides the color of each brick based on parts of the FFT spectrum
 var spectR = map(spectrum[0],0,200,0,255);
 var spectG = map(spectrum[200],0,300,0,255);
 var spectB = map(spectrum[500],0,300,0,255);

textFont(otherFont);
textSize(50);


//changes color of the multiplier to indicate such to the player
if (multiplier == 1){
	fill(255);
}

if (multiplier == 2){
	fill(0,0,255);
}

if (multiplier == 3){
	fill(0,255,0);
}

if (multiplier == 4){
	fill(255,0,0);
}

text( "Multipler x" + multiplier, 0,100);

fill(255);

//increments scroe based on how long the player has survived and the current player. Rewards player sustainability 
score += int(millis()/1000) * multiplier;
text( score, 50,50);

//displays player health
text("Current HP: "+ playerHealth, 4*width/5, 50);

// uses the FFT analysis previously generated to create the bricks
// each brick is added to 
 if (bassEnergy > 140)
 {
 	bassBlock = createSprite(width-100,line3.position.y,40,20);
 	bassBlock.shapeColor = color(spectR,spectG,spectB);
 	bassBlock.velocity.x = -7.0;
 	bassBlock.life = random(50,150);
 	bassBlocks.add(bassBlock);
 
 }

if (midsEnergy > 140){
	midBlock =createSprite(width-100,line2.position.y,20,20);
	midBlock.shapeColor = color(spectG,spectR,spectB);
	midBlock.velocity.x = -7.0;
	midBlock.life = random(50,150);
	midBlocks.add(midBlock);

 }

if (trebleEnergy > 100){
	trebleBlock = createSprite(width-100,line1.position.y,20,20);
	trebleBlock.shapeColor = color(spectB,spectG,spectR);
	trebleBlock.velocity.x = -7.0;
	trebleBlock.life = 150;
	trebleBlocks.add(trebleBlock);
}

//checks if the player is underneath the platform when it collides.
if (player.collide(trebleBlocks) && (player.position.y > line1.position.y)){
	playerHealth-=1;
	player.position.y = floor.position.y - 50;
}


if (player.collide(midBlocks) && (player.position.y > line2.position.y)){
	playerHealth-=1;
	player.position.y = floor.position.y - 50;
}


if (player.collide(bassBlocks) && (player.position.y > line3.position.y)){
	playerHealth-=1;
	player.position.y = floor.position.y - 50;
}


if (player.collide(ceiling) && (player.position.y > ceiling.position.y)){
	playerHealth -=1;
	player.position.y = floor.position.y-50;
}


//standard collision detection when on top of the platforms
player.collide(bassBlocks);
player.collide(midBlocks);
player.collide(trebleBlocks);
player.collide(floor);
player.collide(ceiling);

 if (theEndBarThing.position.x < 0){
 	theEndBarThing.position.x = width+20;
 }

//allows the player to move forward to jump to new playforms
if (keyIsDown(RIGHT_ARROW)){
	player.position.x +=7.5;
}

if (keyDown(UP_ARROW)){
	player.velocity.y=JUMP;
}


//the fail game condition
if (DeadPlayer){
	Song.stop();
	background(50);
	bassBlocks.clear();
	midBlocks.clear();
	trebleBlocks.clear();
	textSize(70);
	textAlign(CENTER);
	text("Aw no, you died! Refresh to start again\nFinal Score: " + finalScore ,width/2,height/2);
}

//the win game condition
if(gameOver){
	textSize(150);
	textAlign(CENTER);
	text("Good Job! You made it to the end,\nFinal Score: "+ finalScore, width/2,height/2);
}

}