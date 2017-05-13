var floor;
var player;


var noteblocks;

var song;
var thefft;

var theEndBarThing;
var gameFont;

var gameStart = false;

function preload(){
	song = loadSound("assets/mario.mp3");
	thefft = new p5.FFT;
	gameFont = loadFont("assets/BadMofo.ttf");
	//run_sprite_sheet = loadSpriteSheet("assets/run.png",280,340,10);
	//run_animation = loadAnimation(run_sprite_sheet);	
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noteblocks = new Group();
  textFont(gameFont);

  theEndBarThing = createSprite(width-20, height/2+50,30,600);
  theEndBarThing.shapeColor = color(245,245,245);
  //theEndBarThing.velocity.x = -10;

  floor = createSprite( width/2, height-50, width, 20);
  floor.shapeColor = color(245,245,245);


//sprites that represent the lines on sheet music
  line1 = createSprite(width/2,height-200,width,5);
  line1.shapeColor = color(245,245,245);

  line2 = createSprite(width/2,height-350,width,5);
  line2.shapeColor = color(245,245,245);

  line3 = createSprite(width/2,height-500,width,5);
  line3.shapeColor = color(245,245,245);

  ceiling = createSprite(width/2,height-650,width, 20);
  ceiling.shapeColor = color(245,245,245);

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
}

else{
  GameLogic();
}
  drawSprites();
}


function GameLogic(){
	if (!song.isPlaying())
	{	
		song.play();
	}

spectrum = thefft.analyze();

var bassEnergy = thefft.getEnergy('bass');
var midsEnergy = thefft.getEnergy('mid');
var trebleEnergy = thefft.getEnergy('treble');


 var spectR = map(spectrum[0],0,200,0,255);
 var spectG = map(spectrum[200],0,600,0,255);
 var spectB = map(spectrum[500],0,600,0,255);

 //this creates a really equalizer lookingthing in the background
 //for (var i = 0; i< spectrum.length; i++){
   // var x = map(i, 0, spectrum.length, 0, width);
    //var h = -height + map(spectrum[i], 0, 255, height, 0);
    //rect(x, height, width / spectrum.length, h )
    //}

 if (bassEnergy > 95)
 {
 	thing = createSprite(600+spectrum[0],line1.position.y,20,20);
 	thing.color = color(spectR,spectG,spectB);
 	thing.velocity.x = -5.0;
 	noteblocks.add(thing);
 }

 if (noteblocks.length > 5){
 	for (var i = 0; i < noteblocks.length; i++){
 		if (noteblocks[i].position.x < 40)
 		{
 			noteblocks[i].remove()
 		}
 	}
 }
 
 if (theEndBarThing.position.x < 0){
 	theEndBarThing.position.x = width+20;
 }

if (keyIsDown(RIGHT_ARROW)){
	player.position.x +=5;
}

if (keyIsDown(UP_ARROW)){
	player.position.y -=5;
}

if (keyIsDown(DOWN_ARROW)){
	player.position.y +=5;
}
}