console.log("bonjour")

var parametres = {
  nb_equipes: 2,
  nb_cartes: 40,
  duree_tour: 5,
  ordre_aleatoire: true
}
var les_equipes = [{
  nom_equipe: "equipe1",
  points_equipe: 0,
  cartes_devinees: []
}, {
  nom_equipe: "equipe2",
  points_equipe: 0,
  cartes_devinees: []
}, {
  nom_equipe: "equipe3",
  points_equipe: 0,
  cartes_devinees: []
}, {
  nom_equipe: "equipe4",
  points_equipe: 0,
  cartes_devinees: []
}]
var les_cartes = ["Bob Marley", "Bob Dylan", "Bob l'éponge"]
var les_cartes_passees = []

var manches =[{
  nom_manche:"première",
  }, {
  nom_manche:"deuxième",
  },{
  nom_manche:"troisième",}]

var charger_page = {
    parametre1: parametre1,
    parametres2: parametres2,
    mancheintro: mancheintro,
    manchedebut: manchedebut,
    manchemilieu: manchemilieu,
    manchefin: manchefin,
    partiefin: partiefin,
    rejouer : rejouer
  } //ce que l'on fait en fonction de la page sur laquelle on est
var numero_manche = 0
var equipe_qui_joue = 0
var chrono



//La fonction est executee quand on charge une nouvelle page.
//si il y a une id pour la page, on cherche ce qui est associe a cette id dans l'objet charger_page
//si ce qui est dans charger_page est une fonction, on l'execute (sinon, rien)
function myFunction(detail) {
  console.log(location.href)
  var pageactive = $('div.content').attr('id')
  console.log(pageactive);
  var fonction_a_executer = charger_page[pageactive]
  console.log(fonction_a_executer)
  if (typeof fonction_a_executer === 'function') {
    fonction_a_executer()
  }
}

window.addEventListener('push', myFunction);
$(myFunction);

function Chrono(duree, callback_fin, intervalle, callback_intervalle) {
  var temps_restant, intervalID;

  this.start = function() {

    var obj = this;
    temps_restant = duree;
    intervalID = window.setInterval(function() {
      temps_restant -= intervalle;
      if (temps_restant < 0) {
        obj.stop();
      } else {
        callback_intervalle(temps_restant);
      }
    }, intervalle * 1000)
  }

  this.stop = function() {

    clearInterval(intervalID);
    callback_fin();
  }
}

// contrat: var chronometre = new Chrono(duree, callback_fin, intervalle, callback_intervalle);
// chronometre.start();
// chronometre.stop();

//fonction qui permet de passer à la carte suivante
function carte_suivante(){
  console.log("j'ai lancé la fonction carte_suivante")
  //si il ne reste des cartes ni dans la défausse ni dans la pioche
  if (les_cartes.length===0 && les_cartes_passees.length===0){
      chrono.stop()
      PUSH({url:"manchefin"})
    }
    else {
      //si il reste des cartes dans la défausse mais pas dans la pioche
      if (les_cartes.length===0){
        if (parametres.ordre_aleatoire===true){
          les_cartes = les_cartes_passees;
          les_cartes_passees = []
          melanger(les_cartes)
        }
        else {les_cartes = les_cartes_passees;
              les_cartes_passees = []}
        PUSH({url:"manchemilieu"})
      }
      //si il reste des cartes dans la pioche
      else {PUSH({url:"manchemilieu"})

      }
    }
  }


//fonction mélanger
function melanger(tableau){
  var n=tableau.length;
  var conserver;
  for (i = n-1;i>=1;i--){
    var j = Math.floor(Math.random()*tableau.length);
    conserver = tableau[j];
    tableau[j] = tableau [i];
    tableau[i] = conserver
  }
}


//pour la page parametre1
function parametre1() {

  $('body').on('click', 'a[data-parametres]', function() {
    var name = $(this).data('parametres');
    var value = $(this).data('value');
    console.log(parametres)
    console.log(name + ' -> ' + value);
    parametres[name] = parseInt(value, 10)
    console.log(parametres)
  })

  $('body').on('click', 'div.toggle[data-parametres]', function() {
    var name = $(this).data('parametres');
    var value = $(this).hasClass('active');
    console.log(parametres)
    console.log(name + ' -> ' + value);
    parametres[name] = value
    console.log(parametres)
  })

}


//fonction lancee quand on est sur la page parametres2
function parametres2() {
  chrono = new Chrono(parametres.duree_tour, function() {
    equipe_qui_joue = (equipe_qui_joue + 1) % parametres.nb_equipes
    PUSH({url: 'manchedebut'})
  }, 1, function(temps_restant) {
    $('#chronometre').text(temps_restant)
  })
  console.log("j'ai lancé la fonction parametres2")
    // for tous les data-numero supérieur au nombre d'équipe > suprimer
  var max = 4
  for (var numero = parametres.nb_equipes + 1; numero <= max; numero++) {
    console.log(numero)
    $('input[data-numero="' + numero + '"]').remove()
  }
  //enregistre les noms des equipes
  $('body').on('change', 'input', function() {
    console.log($(this).val())
    console.log($(this).data('numero'))
    var numero_equipe = $(this).data('numero') - 1
    var nom_equipe = $(this).val()
    les_equipes[numero_equipe].nom_equipe = nom_equipe
    console.log(les_equipes)
  })
}


//fonction lancee quand on est sur la page mancheintro
function mancheintro(){
  console.log(les_cartes)
  console.log(les_equipes[0].cartes_devinees)
  console.log(les_cartes_passees)
  $('#manche').text(manches[numero_manche].nom_manche)
  for (var numero = 0;numero<=3;numero++){
    console.log(numero_manche)
    if (numero!=numero_manche){
      $('p[data-numero="' + numero + '"]').remove()
    }
    }
}


//fonction lancee quand on est sur la page manchedebut
function manchedebut() {
  //à écrire
  $('#nom_equipe').text(les_equipes[equipe_qui_joue].nom_equipe)
  $('#demarrer').on('click', function () {
    chrono.start();
    PUSH({url:'manchemilieu'})
  })

}


  //fonction lancee quand on est sur la page manchemilieu
  function manchemilieu() {
    $("#carte").text(les_cartes[0])
    //fonctions pour faire fonctionner les boutons
    $('#positive').on('click', function() {
      les_equipes[equipe_qui_joue].cartes_devinees.push(les_cartes.shift())
      les_equipes[equipe_qui_joue].points_equipe++
      console.log(les_cartes.length)
      carte_suivante()
    })
    $('#negative').on('click', function() {
      les_cartes_passees.push(les_cartes.shift())
      carte_suivante()
    })

  }


  //fonction lancee quand on est sur la page manchefin
  function manchefin() {
    if (numero_manche===2){$('#fin_manche').text("TERMINER")}
    console.log("cartes devinées par l'équipe 1 : " + les_equipes[0].cartes_devinees)
    console.log("cartes devinées par l'équipe 2 : " + les_equipes[1].cartes_devinees)
    console.log("cartes devinées par l'équipe 3 : " + les_equipes[2].cartes_devinees)
    console.log("cartes devinées par l'équipe 4 : " + les_equipes[3].cartes_devinees)

    $('#manche').text(manches[numero_manche].nom_manche)

    $('#nom_equipe1').text(les_equipes[0].nom_equipe)
    $('#nom_equipe2').text(les_equipes[1].nom_equipe)
    $('#nom_equipe3').text(les_equipes[2].nom_equipe)
    $('#nom_equipe4').text(les_equipes[3].nom_equipe)
    $('#points_equipe1').text(les_equipes[0].points_equipe)
    $('#points_equipe2').text(les_equipes[1].points_equipe)
    $('#points_equipe3').text(les_equipes[2].points_equipe)
    $('#points_equipe4').text(les_equipes[3].points_equipe)
    var max = 4
    for (var numero = parametres.nb_equipes; numero <= max; numero++) {
      console.log(numero)
      $('p[data-numero="' + numero + '"]').remove()
      $('a[data-numero="' + numero + '"]').remove()
    }

//ne fonctionne pas du tout !


  $('a[data-numero]').on('touchend click', function(){
console.log('j ai lancé la fonction qui ne marche pas')
    var numero_equipe = $(this).data('numero');
    var cartes_devinees = les_equipes[numero_equipe].cartes_devinees.map(function (carte) {
      return "<li>"+carte+"</li>";
    }).join('');
    $('#cartes_devinees .content-padded').html("Cartes devinées par l'équipe "
    +les_equipes[numero_equipe].nom_equipe+'<ul>'+ cartes_devinees +'</ul>')
    console.log(cartes_devinees)
  })




/*
//exemple
var scores = les_equipes.map(function (equipe) {
  return equipe.points_equipe;
})
//fin exemple

//premier essai
    for (var numero = parametres.nb_equipes; numero <= max; numero++){
      console.log("j'ai compris que tu as cliqué sur le bouton pour connaitre les cartes devinées")
      $('a[data-numero="' + numero + '"]').on('click', function(){
        var cartes_devinees = cartes_devinees.map(function (equipe) {
          return "<li>"+cartes_devinees[numero]+"</li>";}).join('')
        $('#cartes_devinees.content-padded').html("Cartes devinées par l'équipe"
        +les_equipes[numero].nom_equipe+'</br><ul>'+ cartes +'</ul>')
      })
    }
    */



    console.log("j'ai lancé la fonction manchefin")


    $('#fin_manche').on('click', function(){
      for (var i=0;i<=parametres.nb_equipes;i++){
        les_cartes = les_cartes.concat(les_equipes[i].cartes_devinees);
        les_equipes[i].cartes_devinees = []
      }
      melanger(les_cartes)

      if (numero_manche<=1){
        numero_manche++;
        PUSH({url:'mancheintro'})
      }
      else {
        PUSH({url:"partiefin"})}
    })
  }

  //fonction lancee quand on est sur la page partiefin
  function partiefin() {

    var vainqueurs = [];
    var scores = les_equipes.map(function (equipe) {
      return equipe.points_equipe;
    });
    console.log(scores);
    var scores_triees = scores.sort();
    console.log(scores_triees);
    var score_vainqueur = scores_triees.pop();
    console.log(score_vainqueur);
    var vainqueurs = les_equipes.filter(function (equipe) {
      return equipe.points_equipe  === score_vainqueur;
    })
    console.log(vainqueurs);
    var nom_vainqueurs = vainqueurs.map(function (equipe) {
      return equipe.nom_equipe;
    }).join(', ');

    if (vainqueurs.length===1){$('#vainqueurs').text("L'équipe "+ nom_vainqueurs + " a gagné!")}
    else {$('#vainqueurs').text("Les équipes " + nom_vainqueurs + " ont gagné!")}

    $('#nom_equipe1').text(les_equipes[0].nom_equipe)
    $('#nom_equipe2').text(les_equipes[1].nom_equipe)
    $('#nom_equipe3').text(les_equipes[2].nom_equipe)
    $('#nom_equipe4').text(les_equipes[3].nom_equipe)
    $('#points_equipe1').text(les_equipes[0].points_equipe)
    $('#points_equipe2').text(les_equipes[1].points_equipe)
    $('#points_equipe3').text(les_equipes[2].points_equipe)
    $('#points_equipe4').text(les_equipes[3].points_equipe)

    console.log("j'ai lancé la fonction partiefin")
    var max = 4
    for (var numero = parametres.nb_equipes; numero <= max; numero++) {
      console.log(numero)
      $('p[data-numero="' + numero + '"]').remove()
    }
  }

  function rejouer(){
    equipe_qui_joue = 0;
    numero_manche = 0;
    for (var i=0;i<=parametres.nb_equipes;i++){
      les_cartes = les_cartes.concat(les_equipes[i].cartes_devinees);
      les_equipes[i].cartes_devinees = [];
      les_equipes[i].points_equipe = 0
    }
  }
