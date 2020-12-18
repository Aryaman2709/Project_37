//Create variables here
var dog, happyDog;
var database;
var foodS, foodStock;
var button, add;
var fedTime, lastFed;
var foodObj;
var readState;
var gameState;
var currentTime;

function preload()
{
  //load images here
  dogImage = loadImage("images/dogImg.png");
  happyDogImage = loadImage("images/dogImg1.png");
  sadDog = loadImage("images/deadDog.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png") 
}

function setup() {
  createCanvas(1000, 500);
  database = firebase.database();

  foodStock = database.ref('food')
  foodStock.on("value",readStock);

  foodObj = new Food();

  feed = createButton("Feed The Dog");
  feed.position(700,95); 
  feed.mousePressed(feedDog); 

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
  dog = createSprite(850,250,50,50);
  dog.addImage(sadDog);
  dog.scale = 0.25

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  })
  
}


function draw() { 
  currentTime = hour()
  if(currentTime===(lastFed+1)){
    update("playing");
    foodObj.garden();
  }else if(currentTime===(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime <= (lastFed+4)){
    update("bathing");
    foodObj.washroom();
  }else{
    update("hungry");
    foodObj.display();
  }

  fedTime = database.ref('feedTime');
  fedTime.on("value", (data)=>{
    lastFed = data.val();
  })

  if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
  }

  

  

  //feed.mousePressed(()=>{
    //feedDog();
    //foodObj.deductFood();
    
  //})

  //addFood.mousePressed(()=>{
    //addFoods();
  //})

  drawSprites();
 
  //text("Press Up Arrow key to feed Drago Milk", 100,50);
  //add styles here

}




function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogImage);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food :foodObj.getFoodStock(),
    feedTime: hour(),
    //gameState: "hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    food: foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

