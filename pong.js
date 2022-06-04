const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let rebondMur = new Audio("soundEffects/rebondMur.mp3");
let pointJoueur = new Audio("soundEffects/pointJoueur.mp3");
let pointJ2 = new Audio("soundEffects/pointJ2.mp3");
// variables utiles
let lancement = 1;
let points = 10;
let bot;
let enJeu = true;
let monte = false,
  descend = false,
  monte2 = false,
  descend2 = false;
const up = 38,
  down = 40,
  up2 = 109,
  down2 = 107;
const vitesseBalleLancement = 5,
  vitesseBalle = 15;
let largeurPaddle = 20,
  hauteurPaddle = 150;
let commence = -1;
class Paddle {
  constructor(x, y, largeur, hauteur, vectY, vitesse, score) {
    this.x = x;
    this.y = y;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.vectY = vectY;
    this.vitesse = vitesse;
    this.score = score;
  }
}
const joueur = new Paddle(
  20,
  canvas.height / 2 - hauteurPaddle / 2,
  largeurPaddle,
  hauteurPaddle,
  0,
  15,
  0
);
const j2 = new Paddle(
  canvas.width - largeurPaddle - 20,
  canvas.height / 2 - hauteurPaddle / 2,
  largeurPaddle,
  hauteurPaddle,
  Math.floor(Math.random() * 2),
  9,
  0
);

const balle = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  rayon: 20,
  vectX: 0,
  vectY: 0,
  vitesse: 0,
};
function init() {
  document.addEventListener("keydown", appuiTouche);
  document.addEventListener("keyup", relacheTouche);
  document.getElementById("win");
  let unJ = document.getElementById("unJ");
  let deuxJ = document.getElementById("deuxJ");
  unJ.addEventListener("click", function () {
    unJ.remove();
    deuxJ.remove();
    if (win.value != "") {
      points = win.value;
    }
    win.remove();
    bot = true;
    reset();
    jeu();
  });
  deuxJ.addEventListener("click", function () {
    unJ.remove();
    deuxJ.remove();
    if (win.value != "") {
      points = win.value;
    }
    win.remove();
    bot = false;
    j2.vitesse = joueur.vitesse;
    reset();
    jeu();
  });
}

function jeu() {
  if (enJeu) {
    update();
    render();
    requestAnimationFrame(jeu);
  }
}

function update() {
  if (lancement == 1) {
    balle.vitesse = vitesseBalleLancement;
  } else {
    balle.vitesse = vitesseBalle;
  }
  //condition de victoire
  if (joueur.score == points) {
    victoireJ1();
  }
  if (j2.score == points) {
    victoireJ2();
  }
  //joueur
  if (joueur.y > 0 && monte == true) {
    joueur.y += -joueur.vitesse;
  }
  if (joueur.y + joueur.hauteur < canvas.height && descend == true) {
    joueur.y += joueur.vitesse;
  }
  //----- j2 -----
  if (bot) {
    //suivi de la balle
    if (balle.y < j2.y + j2.hauteur / 2 - j2.vitesse) {
      j2.vectY = -1;
    } else if(balle.y > j2.y + j2.hauteur/2 + j2.vitesse) {
      j2.vectY = 1;
    }else{
      j2.vectY = 0;
    }

    //rebond sur les bords
    if (j2.y <= 0) {
      j2.vectY = Math.abs(j2.vectY);
    }
    if (j2.y + j2.hauteur >= canvas.height) {
      j2.vectY = -Math.abs(j2.vectY);
    }
    j2.y += j2.vectY* j2.vitesse;
  } else {
    if (j2.y > 0 && monte2 == true) {
      j2.y += -j2.vitesse;
    }
    if (j2.y + j2.hauteur < canvas.height && descend2 == true) {
      j2.y += j2.vitesse;
    }
  }
  //----- Balle -----
  // rebond balle sur les murs
  if (balle.x - balle.rayon <= 0) {
    j2.score++;
    pointJ2.play();
    reset();
    commence = -commence;
  }
  if (balle.x + balle.rayon >= canvas.width) {
    joueur.score++;
    pointJoueur.play();
    reset();
    commence = -commence;
  }
  if (balle.y - balle.rayon <= 0 || balle.y + balle.rayon >= canvas.height) {
    balle.vectY = -balle.vectY;
    rebondMur.play();
  }
  //collisions
  collisionJoueur(joueur, balle);
  collisionJ2(j2, balle);

  //actualisation position balle
  balle.x += balle.vitesse * balle.vectX;
  balle.y += balle.vitesse * balle.vectY;
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.font = "40px Press Start";
  context.fillText(joueur.score, canvas.width / 4, canvas.height / 8);
  context.fillText(j2.score, (3 * canvas.width) / 4, canvas.height / 8);
  context.font = "10px Press Start";
  context.fillText("Points pour gagner : " + points, 12, 15);
  context.fillRect(joueur.x, joueur.y, joueur.largeur, joueur.hauteur);
  context.fillRect(j2.x, j2.y, j2.largeur, j2.hauteur);
  context.beginPath();
  context.arc(balle.x, balle.y, balle.rayon, 0, 2 * Math.PI, false);
  context.fill();
  context.stroke();
}

function appuiTouche(event) {
  switch (event.keyCode) {
    case up:
      monte = true;
      break;
    case down:
      descend = true;
      break;
    case up2:
      monte2 = true;
      break;
    case down2:
      descend2 = true;
  }
}
function relacheTouche(event) {
  switch (event.keyCode) {
    case up:
      monte = false;
      break;
    case down:
      descend = false;
      break;
    case up2:
      monte2 = false;
      break;
    case down2:
      descend2 = false;
  }
}
function reset() {
  lancement = 1;
  balle.vectX = 0;
  balle.vectY = 0;
  balle.x = canvas.width / 2;
  balle.y = canvas.height / 2;
  setTimeout(reset2, 1000);
}
function reset2() {
  balle.vectX = commence;
  balle.vectY = lanceBalle();
}
function collisionJoueur(rectangle, cercle) {
  //collision coté droit
  if (
    cercle.y >= rectangle.y &&
    cercle.y <= rectangle.y + rectangle.hauteur &&
    Math.abs(cercle.x - (rectangle.x + rectangle.largeur)) <= cercle.rayon
  ) {
    //inverser x
    cercle.vectX = -cercle.vectX;
    //angle proportionnel au point de collision
    cercle.vectY =
      ((cercle.y - (rectangle.y + rectangle.hauteur / 2)) / rectangle.hauteur) *
      2;
    lancement++;
  }
  //collision haut
  if (
    cercle.x >= rectangle.x &&
    cercle.x <= rectangle.x + rectangle.largeur &&
    Math.abs(cercle.y - rectangle.y) <= cercle.rayon
  ) {
    cercle.vectY = -Math.abs(cercle.vectY);
    cercle.y = rectangle.y - cercle.rayon;
  }
  //collision bas
  if (
    cercle.x >= rectangle.x &&
    cercle.x <= rectangle.x + rectangle.largeur &&
    Math.abs(cercle.y - (rectangle.y + rectangle.hauteur)) <= cercle.rayon
  ) {
    cercle.vectY = Math.abs(cercle.vectY);
    cercle.y = rectangle.y + rectangle.hauteur + cercle.rayon;
  }
}
function collisionJ2(rectangle, cercle) {
  //collision coté gauche
  if (
    cercle.y >= rectangle.y &&
    cercle.y <= rectangle.y + rectangle.hauteur &&
    Math.abs(cercle.x - rectangle.x) <= cercle.rayon
  ) {
    //inverser x
    cercle.vectX = -cercle.vectX;
    //angle proportionnel au point de collision
    cercle.vectY =
      ((cercle.y - (rectangle.y + rectangle.hauteur / 2)) / rectangle.hauteur) *
      2;
    lancement++;
  }
  //collision haut
  if (
    cercle.x >= rectangle.x &&
    cercle.x <= rectangle.x + rectangle.largeur &&
    Math.abs(cercle.y - rectangle.y) <= cercle.rayon
  ) {
    cercle.vectY = -Math.abs(cercle.vectY);
    cercle.y = rectangle.y - cercle.rayon;
  }
  //collision bas
  if (
    cercle.x >= rectangle.x &&
    cercle.x <= rectangle.x + rectangle.largeur &&
    Math.abs(cercle.y - (rectangle.y + rectangle.hauteur)) <= cercle.rayon
  ) {
    cercle.vectY = Math.abs(cercle.vectY);
    cercle.y = rectangle.y + rectangle.hauteur + cercle.rayon;
  }
}

function lanceBalle() {
  let retour;
  do {
    retour = Math.random() * 2 - 1;
  } while (retour < 0.7 && retour > -0.7);
  return retour;
}
function victoireJ1() {
  let j1Win = document.getElementById("ecranJ1Win");
  canvas.remove();
  j1Win.style.opacity = 1;
  console.log("Victoire J1");
  enJeu = false;

  canvas.classList.remove("shadow");
}
function victoireJ2() {
  let j2Win = document.getElementById("ecranJ2Win");
  canvas.remove();
  j2Win.style.opacity = 1;
  console.log("Victoire J2");
  enJeu = false;
  canvas.classList.remove("shadow");
}
