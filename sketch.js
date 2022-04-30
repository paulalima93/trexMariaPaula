//variaveis GLOBAIS do jogo
var trex, trex_correndo, trex_bateu;
var chao, chaoImagem, chaoInvisivel;
var nuvem, nuvemImagem;
var obstaculo;
var obsculoImg1, obsculoImg2, obsculoImg3, obsculoImg4, obsculoImg5, obsculoImg6;
var pontos = 0;
var grupoNuvens;
var grupoObstaculos;
var jumpSound, deathSound, cpSound;

var restart, restarImg;
var gameOver, gameOverImg;

var PLAY = 1;
var END = 0;
var gameState = PLAY;


//pré carrega as imagens e animações do jogo dentro da variavel;
function preload() {
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_bateu = loadAnimation("trex_collided.png");
  chaoImagem = loadImage("ground2.png");
  nuvemImagem = loadImage("cloud.png");
  obsculoImg1 = loadImage("obstacle1.png");
  obsculoImg2 = loadImage("obstacle2.png");
  obsculoImg3 = loadImage("obstacle3.png");
  obsculoImg4 = loadImage("obstacle4.png");
  obsculoImg5 = loadImage("obstacle5.png");
  obsculoImg6 = loadImage("obstacle6.png");
  restarImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  jumpSound = loadSound("jump.mp3");
  deathSound = loadSound("die.mp3");
  cpSound = loadSound("checkPoint.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //dino
  trex = createSprite(50,height-40,50,40);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("bateu", trex_bateu);
  trex.scale = 0.5; 

  //chao
  chao = createSprite(200,height-40,width,20);
  chao.addImage("chao",chaoImagem);
  chao.x = chao.width /2;
  chaoInvisivel = createSprite(200,height-30,400,10);
  chaoInvisivel.visible = false;

  console.log(trex.y);

  //trex.debug = true;
  trex.setCollider("circle", 0,0,30);
  
  grupoNuvens = new Group();
  grupoObstaculos = new Group();

  gameOver = createSprite(300,70);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(300, 100);
  restart.addImage(restarImg);
  restart.scale = 0.5;
  restart.visible = false;

}



function draw() {
  background("white");


  //concatenação = exibe duas coisas na tela
  text("Pontuação: " + pontos, width-100,50);
  
  if (gameState === PLAY) {

    chao.velocityX = -(4 + 3 * pontos/100);
    grupoObstaculos.setVelocityXEach(-(4 + 3 * pontos/100))

    pontos = pontos + Math.round(frameRate()/60);

    if(pontos>0 && pontos%100 ===0) {
      cpSound.play();
    }
    //se a tecla do espaço for pressionada, o trex vai ir pra cima
      if (keyDown("space") && trex.y>160) { 
        trex.velocityY = -10;
        jumpSound.play();
      }


    //se o chao sair da tela, ele volta pro meio da tela
      if (chao.x < 0) { 
        chao.x = chao.width/2;
      }

      gerarNuvens();
      gerarObstaculos();

      if (grupoObstaculos.isTouching(trex)) {
        gameState = END;
        deathSound.play();
      }

  } else if(gameState === END) {
    chao.velocityX = 0;
    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);

    grupoObstaculos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);

    trex.changeAnimation("bateu", trex_bateu);

    //pontos = 0;

    gameOver.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart)){
      reset();
    }


  }


  

  //aplica gravidade
  trex.velocityY = trex.velocityY + 0.8;

  //faz o trex colidir
  trex.collide(chaoInvisivel);

  drawSprites();
}


function gerarNuvens() {
  if (frameCount % 60 === 0) {
    nuvem = createSprite(width,100,40,10);
    nuvem.velocityX = -4;
    nuvem.addImage(nuvemImagem);
    nuvem.scale = 0.8;
    nuvem.y = Math.round(random(50,100));
    nuvem.lifetime = width/3;
    trex.depth = nuvem.depth;
    trex.depth +=1;

    grupoNuvens.add(nuvem);
  }
  
}

function gerarObstaculos() {
  if (frameCount % 60 === 0) {
    obstaculo = createSprite(width, height-50 , 20, 40);
    obstaculo.velocityX = -4;

    var aleatorio = Math.round(random(1,6));

    switch (aleatorio) {
      case 1: obstaculo.addImage(obsculoImg1);
        break;
      case 2: obstaculo.addImage(obsculoImg2);
        break;
      case 3: obstaculo.addImage(obsculoImg3);
        break;  
      case 4: obstaculo.addImage(obsculoImg4);
        break;
      case 5: obstaculo.addImage(obsculoImg5);
        break;
      case 6: obstaculo.addImage(obsculoImg6);
        break;
      default:
        break;
    }

    obstaculo.scale = 0.06
    obstaculo.lifetime = width/3;

    grupoObstaculos.add(obstaculo);
  }
}

function reset(){

  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running", trex_correndo);

  grupoObstaculos.destroyEach();
  grupoNuvens.destroyEach();

  pontos = 0;

}