# spo-yt-heure-fin

Extension pour Brave / Edge (et tout navigateur Chromium) qui affiche dans le lecteur YouTube, à droite du timer, l'**heure de fin estimée** de la vidéo :

```
12:34 / 45:00   Fin ≈ 21:47:12
```

- Tient compte de la **vitesse de lecture** (1.5x, 2x…) : fin = maintenant + temps restant ÷ vitesse.
- Se met à jour immédiatement après un **saut** dans la vidéo ou un changement de vitesse.
- En **pause**, l'heure de fin avance avec l'horloge.
- Masquée pendant les **pubs** et les **directs**.
- Affiche `(+1j)` si la fin tombe le lendemain.

## Installation (Brave ou Edge)

1. Récupérer le dossier : `git clone https://github.com/StephPo/spo-yt-heure-fin.git`
2. Ouvrir `brave://extensions` (Brave) ou `edge://extensions` (Edge).
3. Activer le **Mode développeur**.
4. Cliquer **Charger l'extension non empaquetée** et choisir le dossier `spo-yt-heure-fin`.
5. Recharger les onglets YouTube déjà ouverts.

## Mise à jour

```
git pull
```

puis cliquer **Recharger** (flèche circulaire) sur la carte de l'extension dans `brave://extensions` / `edge://extensions`.

## Publication sur GitHub (première fois)

```
gh repo create spo-yt-heure-fin --private --source . --push
```

(après un premier `git add -A` et `git commit`).
