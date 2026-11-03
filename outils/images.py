#!/usr/bin/env python3
"""Convertit les images reçues en WebP, en plusieurs tailles, avec une version téléphone recadrée.

Usage, depuis la racine du projet :
  python3 outils/images.py lot.json

lot.json :
  [
    {"source": "recu/IMG_2041.jpg", "nom": "ouverture", "cadrage": [50, 35], "mobile": true},
    {"source": "recu/grok-salle.png", "nom": "grok/salle", "cadrage": [40, 50]}
  ]

- Écrit assets/images/<nom>-<largeur>.webp pour 640, 1280 et 1920 px, sans jamais agrandir l'original.
- Qualité réduite par paliers (jusqu’à 48) pour rester sous 300 Ko.
- "largeurs": [640, 1280] limite les tailles produites (vignettes, cartes).
- "mobile": true ajoute <nom>-mobile-<largeur>.webp en 9:16, recadré autour du point de cadrage (en %).
- Le point de cadrage se reporte dans la page : c.media({ nom, cadrage: '50% 35%' }).
- Les images Grok vont dans le dossier grok/ : la mention « Illustration générée » est alors ajoutée seule.
- "source_mobile": "recu/x-9x16.png" fabrique la version téléphone depuis une image verticale à part.
- "ratio": [16, 9] recadre l'image principale à ce format autour du point de cadrage.
- "etalonnage": true applique un étalonnage doux (saturation et contraste légèrement baissés), pour que
  les images générées se fondent avec les vraies photos.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

RACINE = Path(__file__).resolve().parent.parent
LARGEURS = [640, 1280, 1920]
LARGEURS_MOBILE = [640, 1080]


def enregistrer(img, chemin, largeur):
    if img.width > largeur:
        img = img.resize((largeur, round(img.height * largeur / img.width)), Image.LANCZOS)
    chemin.parent.mkdir(parents=True, exist_ok=True)
    q = 78
    img.save(chemin, "WEBP", quality=q, method=6)
    while chemin.stat().st_size > 300_000 and q > 48:
        q -= 5
        img.save(chemin, "WEBP", quality=q, method=6)
    return chemin.stat().st_size


def recadrer(img, ratio, cx, cy):
    """Recadre img au ratio (largeur/hauteur) autour du point (cx, cy) en %."""
    w, h = img.size
    if w / h > ratio:
        nw, nh = round(h * ratio), h
    else:
        nw, nh = w, round(w / ratio)
    x = min(max(round(w * cx / 100 - nw / 2), 0), w - nw)
    y = min(max(round(h * cy / 100 - nh / 2), 0), h - nh)
    return img.crop((x, y, x + nw, y + nh))


def adoucir(img):
    img = ImageEnhance.Color(img).enhance(0.88)
    return ImageEnhance.Contrast(img).enhance(0.96)


def tailles(liste, largeur):
    """Tailles prévues jamais agrandies, plus la largeur d'origine si elle tombe entre deux paliers."""
    t = [x for x in liste if x <= largeur]
    if not t or (largeur > t[-1] and largeur < (liste[len(t)] if len(t) < len(liste) else 0)):
        t.append(largeur)
    return t


def ouvrir(chemin, e):
    img = ImageOps.exif_transpose(Image.open(RACINE / chemin)).convert("RGB")
    return adoucir(img) if e.get("etalonnage") else img


def traiter(e):
    img = ouvrir(e["source"], e)
    nom = e["nom"]
    cx, cy = e.get("cadrage", [50, 50])
    if e.get("ratio"):
        img = recadrer(img, e["ratio"][0] / e["ratio"][1], cx, cy)
    sorties = []
    largeurs = e.get("largeurs", LARGEURS)
    for l in tailles(largeurs, img.width):
        p = RACINE / "assets/images" / f"{nom}-{l}.webp"
        sorties.append((p, enregistrer(img, p, l)))
    if e.get("mobile") or e.get("source_mobile"):
        base = ouvrir(e["source_mobile"], e) if e.get("source_mobile") else img
        m = recadrer(base, 9 / 16, *e.get("cadrage_mobile", [cx, cy]))
        for l in tailles(LARGEURS_MOBILE, m.width):
            p = RACINE / "assets/images" / f"{nom}-mobile-{l}.webp"
            sorties.append((p, enregistrer(m, p, l)))
    for p, taille in sorties:
        alerte = "  (plus de 300 Ko)" if taille > 300_000 else ""
        print(f"OK {p.relative_to(RACINE)} {taille // 1024} Ko{alerte}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    for entree in json.loads(Path(sys.argv[1]).read_text()):
        traiter(entree)
