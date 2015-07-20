'use strict';

(function() {

  angular.module('carApp')
    .value('TipValue', [
      'Les icones présentes sur la carte représentent soit des personnes proposant un covoiturage, soit des personnes cherchant un covoiturage. Pour contacter une personne, ouvrez sa fiche profil et cliquez sur son e-mail.',
      'Le menu compte permet d\'accéder à un formulaire de mise à jour de vos informations. Si vous proposez votre véhicule, pensez à mettre à jour le nombre de places disponibles.',
      'Pour agrandir ou réduire la taille de la carte, utilisez l\'outil de zoom en bas à gauche de l\'ecran. Le pinch est également disponible sur les terminaux tactiles.',
      'Les personnes proposant un covoiturage sont représentées par une icone moto ou voiture.',
      'La fiche profil d\'une personne est visible via un click / tap sur une icone de la carte.',
      'Si vous ne souhaitez plus voir les astuces, cliquez sur "Ne plus afficher".'
    ]);

})();