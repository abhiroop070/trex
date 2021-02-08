
var gameState = "play";

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gimg,rimg
var score;
var gameover,restart
var jump,die,checkpoint


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  gimg = loadImage("gameOver.png")
  rimg = loadImage("restart.png")
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  jump=loadSound("jump.mp3")
  die=loadSound("die.mp3")
  checkpoint=loadSound("checkpoint.mp3")
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  //trex.debug=true
  trex.setCollider("circle",0,0,40)
  
  gameover=createSprite(300,90,20,20)
  restart=createSprite(300,120,20,20)
  gameover.addImage(gimg)
  restart.addImage(rimg)
  restart.scale=1/2
  gameover.scale=1/2
  gameover.visible=false
  restart.visible=false
  score = 0
}

function draw() {
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  
  
  if(gameState === "play"){
    //move the ground
    ground.velocityX = -(4+(score/100 ));
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=160) {
        trex.velocityY = -13;
      jump.play()
    }
    
    //add gravity 
     trex.velocityY = trex.velocityY + 0.8
  if(score>0 && score % 100===0){
    checkpoint.play()
}
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = "end";
        
      die.play()
    }
   
    
  }
   else if (gameState === "end") {
      ground.velocityX = 0;
     obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
     obstaclesGroup.setLifetimeEach(-1)
     cloudsGroup.setLifetimeEach(-1)
     trex.changeAnimation("collided" , trex_collided)
     gameover.visible=true
  restart.visible=true
     
     if(mousePressedOver(restart)){
       gameState="play"
       cloudsGroup.destroyEach()
       obstaclesGroup.destroyEach()
       gameover.visible=false
       restart.visible=false
       trex.changeAnimation("running", trex_running)
       score=0
     }
     
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                          
                                 
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(4+(score/100));
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

