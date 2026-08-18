# La Maison du Carac

Site vitrine d'une page pour la confiserie Gremion, boulevard du Pont-d'Arve 6, 1205 Genève.

## En ligne

<https://timoteoadrogue.github.io/maison-du-carac/>

La page est publiée en `noindex, nofollow` et porte une mention en pied de page
(« projet de site, non officiel, visuels générés par IA »). C'est volontaire : le site
reprend le nom, l'adresse, le téléphone et les balises JSON-LD d'un commerce réel, et ne
doit pas être confondu avec son site officiel ni apparaître dans les résultats de
recherche à sa place. Retirer ces deux garde-fous seulement avec l'accord du commerce :
la balise `robots` dans `index.html` et le paragraphe `.pied__note` du pied de page.

Un `git push` sur `main` republie automatiquement.

## Ouvrir en local

Double-cliquer sur `index.html` suffit. Pour un contexte plus proche de la production
(en-têtes corrects, pas de restrictions `file://`) :

```bash
cd ~/Documents/PROJECTS/maison-du-carac && python3 -m http.server 8080
```

## À remplacer avant mise en ligne

**Toutes les images et vidéos sont générées par IA.** Elles sont fidèles au produit
(le carac : sablé, ganache, fondant vert pomme, pastille de chocolat) mais ne montrent
ni la vraie boutique, ni les vraies personnes, ni les vrais produits. Il faut les
remplacer par de vraies photos avant toute publication.

| Fichier | Sert à | Format visé |
|---|---|---|
| `assets/video/hero.mp4` + `assets/img/hero-wide.jpg` | fond du hero | 16:9, espace vide à gauche pour le titre |
| `assets/video/fondant.mp4` + `assets/img/fondant.jpg` | section « Trois couches » | 16:9 |
| `assets/video/vitrine.mp4` + `assets/img/vitrine.jpg` | 1re carte de la vitrine | paysage |
| `assets/img/chocolats.jpg` | carte chocolaterie | portrait ou carré |
| `assets/img/sorbets.jpg` | carte sorbets | carré |
| `assets/img/patisserie.jpg` | carte pâtisserie | carré |
| `assets/img/boutique.jpg` | bandeau « Nous trouver » | paysage |

`assets/img/caracs-hero.jpg` et `carac-coupe.jpg` ne sont plus référencés ; ils restent
disponibles comme variantes.

Les vidéos sont des boucles sans raccord : `hero.mp4` est un aller-retour, les deux
autres se referment par un fondu croisé. Si vous les remplacez, refaites la boucle,
sinon le saut sera visible.

## Informations à faire confirmer par le commerçant

Reprises de sources publiques, à valider :

- horaires **lundi au vendredi 07:30 à 18:15**, fermé samedi et dimanche
  ([search.ch](https://search.ch/tel/geneve/boulevard-du-pont-darve-6/la-maison-du-carac.fr.html))
- « vingt-six parfums », chocolat d'Amérique latine et d'Afrique, tea-room sur place
  ([Petit Futé](https://www.petitfute.co.uk/v53406-geneve/c650-produits-gourmands-vins/c1107-pains-gateaux-chocolats-glaces/c667-boulangerie/374721-la-maison-du-carac.html))
- note 4,6/5 sur Google, citations de Loyse Lanz et du Petit Futé
- l'adresse, le téléphone et les horaires sont aussi déclarés en JSON-LD dans `index.html`,
  à corriger au même endroit en cas de changement

## Structure

```
index.html            page unique, sprite d'icônes Phosphor intégré, JSON-LD
assets/css/fonts.css  Bricolage Grotesque + Instrument Sans, auto-hébergées (OFL 1.1)
assets/css/styles.css thème clair, bascule auto en sombre
assets/js/main.js     apparitions, barre de navigation, travelling, parallaxe
assets/fonts/         6 woff2, variables, sous-ensembles latin et latin-ext
assets/img/           images et affiches de vidéo
assets/video/         3 boucles muettes, H.264
```

Aucune dépendance, aucune étape de compilation, aucun appel réseau externe.
Poids total : environ 4 Mo, dont 3 Mo de vidéo.

## Choix techniques

- **Palette tirée du produit** : le vert du fondant (`#7FB335`) est l'unique couleur
  d'accent, sur une porcelaine froide. Un seul thème pour toute la page, avec bascule
  automatique en sombre via `prefers-color-scheme`.
- **Aucun écouteur de `scroll`.** Les apparitions passent par `IntersectionObserver`.
  Les effets continus (parallaxe du hero, travelling de la vitrine) tournent dans une
  seule boucle `requestAnimationFrame` ouverte uniquement pendant que la section
  concernée est à l'écran.
- **Pas d'animations pilotées par le scroll en CSS** : Firefox 153 ne supporte pas
  encore `animation-timeline`. Le travelling est donc calculé en JS.
- **Dégradations** : sans JS, tout le contenu est visible et la vitrine devient un
  carrousel à défilement tactile. Sous `prefers-reduced-motion`, les vidéos ne
  démarrent pas, l'épinglage est désactivé et les apparitions sont immédiates.
- **Contrastes** vérifiés au niveau AA, y compris le texte sur aplat vert
  (7,5:1 pour les titres, 5,5:1 pour le texte courant) et le texte du hero,
  posé sur un voile dégradé.
