# `aurelia-three`

Le projet Aurelia-Three est une implémentation du moteur de ThreeJS avec des modules complémentaire orienté pour le BIM.

Ce plugin fait partie d'un ensemble disponible sur [github.com/bimaps](https://github.com/bimaps)

Pour plus d'information concernant l'implémentation d'un plugin Aurelia voir la documentation :  [Aurelia plugin guide](https://aurelia.io/docs/plugins/write-new-plugin).


<br>

## Viewer structure

Le viewer Three contient plusieurs zone :
1. Zone d'objet 3D : contient la vue ThreeJS
2. Side bar :  implémenter et personaliser depuis l'application cliente (chaque zone périphérique à sa propre Sidebar)
3. Three Cube : Permet la vision et la navigation dans les plans 3D et 2D

<br>

 ![bimaps-view.jpg](/images/bimaps-view.jpg)


<br>
<br>
<br>


## Structure du plugin

- components : regroupe les composants utilisé dans le viewer
  - sidebar : définit les composants pour le chargement d'outils dans toute les zones de l'espace du viewer
  - three-admin : gestion du sites
  - three-cube : cube d'orientation 3D
  - three-object-list : listing des objets (pour la sélection)
  - three-object-property-explorer : affichage des propriétés des objets 3D
  - three-object-property-list : listing des objets 3D
  - three-rule : editeur des règles pour les thèmes
  - three-style : editeur des styles pour les thèmes
- dialogs : boite de dialogue (admin, exportation, checker)
- helpers : fonction partagé des composants (navigation, loader, pointcloud, utils)
- models : définition des modèles clients (site, object, material, geometry, checker, theme, style)
- themes : fonction des thèmes visuels du viewer
- tools : outil utilisé dans la Toolbar et à l'importation (mesure, rotation, translationn, selection, slice)
