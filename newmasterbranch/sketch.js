var floor;
var player;

var startTime;

var JUMP = -15.0;
var GRAVITY = 25.0;

var bassBlocks;
var midBlocks;
var trebleBlocks;
var easySong;
var medSong;
var hardSong;
var thefft;

var EnergyBarrier1;
var EnergyBarrier2;
var EnergyBarrier3;

var theEndBarThing;
var gameFont;
var otherFont;

var gameStart = false;

function preload(){
	hardsong = loadSound("assets/flames.mp3");
	easySong = loadSound("assets/mario.mp3");
	thefft = new p5.FFT;
	gameFont = loadFont("assets/BadMofo.ttf");
	otherFont = loadFont("assets/coolvetica rg.ttf");
	//run_sprite_sheet = loadSpriteSheet("assets/run.png",280,340,10);
	//run_animation = loadAnimation(run_sprite_sheet);	
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameFont);

  theEndBarThing = createSprite(width-20, height/2+50,30,600);
  theEndBarThing.shapeColor = color(245,245,245);
  //theEndBarThing.velocity.x = -10;

  floor = createSprite( width/2, height-50, width, 20);
  floor.shapeColor = color(50);


bassBlocks = new Group();
midBlocks = new Group();
trebleBlocks = new Group();

//sprites that represent the lines on sheet music
  line1 = createSprite(width/2,height-200,width,5);
  line1.shapeColor = color(50);

  line2 = createSprite(width/2,height-350,width,5);
  line2.shapeColor = color(50);

  line3 = createSprite(width/2,height-500,width,5);
  line3.shapeColor = color(50);

  ceiling = createSprite(width/2,height-650,width, 20);
  ceiling.shapeColor = color(50);

  player = createSprite();
  player.addAnimation("running","assets/run 1.png","assets/run 6.png");
  //player.addAnimation("run",run_animation);

  player.position.x = 50;
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
	if (keyIsDown(65)){
		gameStart = true;
	}
}

else{

	floor.shapeColor=color(245,245,245);
	ceiling.shapeColor=color(245,245,245);
	line1.shapeColor=color(245,245,245);
	line2.shapeColor=color(245,245,245);
	line3.shapeColor=color(245,245,245);
  GameLogic();
}
  drawSprites();
}


function GameLogic(){
	if (!easySong.isPlaying())
	{	
		easySong.play();
		startTime = millis();

	}
console.log(startTime);
spectrum = thefft.analyze();

player.velocity.x = -2.5;
player.velocity.y=GRAVITY;
var bassEnergy = thefft.getEnergy('bass');
var midsEnergy = thefft.getEnergy('mid');
var trebleEnergy = thefft.getEnergy('treble');


 var spectR = map(spectrum[0],0,200,0,255);
 var spectG = map(spectrum[200],0,300,0,255);
 var spectB = map(spectrum[500],0,300,0,255);

 //this creates a really equalizer lookingthing in the background
 //for (var i = 0; i< spectrum.length; i++){
   // var x = map(i, 0, spectrum.length, 0, width);
    //var h = -height + map(spectrum[i], 0, 255, height, 0);
    //rect(x, height, width / spectrum.length, h )
    //}

 if (bassEnergy > 130)
 {
 	thing = createSprite(width-100,line3.position.y,20,20);
 	thing.shapeColor = color(spectR,spectG,spectB);
 	thing.velocity.x = -5.0;
 	thing.life = 220;
 	bassBlocks.add(thing);
 }

if (midsEnergy > 130){
	thing = thing = createSprite(width-100,line2.position.y,20,20);
	thing.shapeColor = color(spectG,spectR,spectB);
	thing.velocity.x = -5.0;
	thing.life = 220;
	midBlocks.add(thing);
}

if (trebleEnergy > 100){
	thing = thing = createSprite(width-100,line1.position.y,20,20);
	thing.shapeColor = color(spectB,spectG,spectR);
	thing.velocity.x = -5.0;
	thing.life = 220;
	trebleBlocks.add(thing);
}

 
//theEndBarThing.velocity.x = -10;


player.collide(bassBlocks);
player.collide(midBlocks);
player.collide(trebleBlocks);
player.collide(floor);

 if (theEndBarThing.position.x < 0){
 	theEndBarThing.position.x = width+20;
 }

if (keyIsDown(RIGHT_ARROW)){
	player.position.x +=7.5;
}

if (keyIsDown(UP_ARROW)){
	player.velocity.y=JUMP;
}

}