# Config : GitHub Pages + Cloudflare + Hostinger

Ce fichier décrit comment tout est câblé et **où configurer les redirections** pour éviter les erreurs dans Google Search Console.

## Ta stack

| Élément | Rôle |
|--------|------|
| **Hostinger** | Enregistrement du nom de domaine (jbdevweb.fr) |
| **Cloudflare** | Proxy / CDN devant le site (trafic passe par Cloudflare) |
| **GitHub Pages** | Hébergement des fichiers du site (repo → site statique) |

**Important :** GitHub Pages **ne lit pas** de fichier `_redirects`. Les redirections doivent être faites dans **Cloudflare**.

---

## 1. DNS (Hostinger ou Cloudflare)

Le domaine peut être géré soit chez **Hostinger**, soit chez **Cloudflare** (si les nameservers pointent vers Cloudflare).

### Si les nameservers sont chez **Hostinger**
Dans la zone DNS Hostinger, tu dois avoir par exemple :

| Type | Nom | Valeur | Proxy |
|------|-----|--------|-------|
| **A** ou **CNAME** | `@` | Vers GitHub Pages ou vers Cloudflare (voir ci‑dessous) | - |
| **CNAME** | `www` | `votrepseudo.github.io` ou l’URL Cloudflare/Pages | - |

Pour que les **Redirect Rules** Cloudflare fonctionnent, le trafic doit passer par Cloudflare. Donc soit :
- les nameservers du domaine sont ceux de **Cloudflare** (recommandé), et la zone DNS est gérée dans Cloudflare avec les enregistrements pointant vers GitHub Pages,  
- soit chez Hostinger tu pointes `@` et `www` vers les **IP/URL Cloudflare** (selon ce qu’Hostinger propose), pas directement vers GitHub.

### Si les nameservers sont chez **Cloudflare**
Dans **Cloudflare** → **DNS** → **Records** :

- **CNAME** `www` → `votrepseudo.github.io` (ou le custom domain configuré dans GitHub Pages), proxy **activé** (nuage orange).
- **CNAME** `@` (apex) → soit un CNAME vers GitHub (si ton hébergeur le permet), soit des **A** vers les IP de GitHub Pages (voir la doc GitHub Pages “Custom domain”).

L’essentiel : **www** et **apex** doivent être **proxiés par Cloudflare** (nuage orange) pour que les règles de redirection s’appliquent.

---

## 2. Redirections dans Cloudflare (à faire ici)

Pour corriger les erreurs “Erreur liée à des redirections” et uniformiser www / trailing slash :

1. Va sur [Cloudflare Dashboard](https://dash.cloudflare.com) → ton domaine **jbdevweb.fr**.
2. **Règles** → **Redirect Rules** (ou **Rules** → **Redirect rules**).
3. **Create rule** → **Redirect rule**.

### Règle 1 : www → sans www (301)

- **Rule name :** `www vers non-www`
- **When incoming requests match :** Wildcard pattern  
  - **Request URL :** `http://www.jbdevweb.fr/*`
- **Then :**
  - **Target URL :** `https://jbdevweb.fr/${1}`  
    (le `${1}` reprend tout après `http://www.jbdevweb.fr/`)
  - **Status code :** 301
  - **Preserve query string :** Oui (recommandé)

Ajoute une 2ᵉ règle pour **https** :

- **Request URL :** `https://www.jbdevweb.fr/*`
- **Target URL :** `https://jbdevweb.fr/${1}`
- **Status code :** 301

(À adapter si l’interface propose une seule règle avec `http*://www.jbdevweb.fr/*`.)

### Règle 2 : trailing slash (optionnel mais recommandé)

Pour que `/contact` redirige vers `/contact/` (et idem pour les autres pages) :

- **Rule name :** `trailing slash`
- **When :** Custom filter expression (Expression Editor), par exemple :

  - Pour une seule URL :  
    `(http.host eq "jbdevweb.fr" and http.request.uri.path eq "/contact")`
  - Pour plusieurs chemins sans slash, tu peux créer plusieurs règles ou une expression avec `or` (ex. `uri.path eq "/contact" or uri.path eq "/shopify"` …).

- **Then :**
  - **Target URL :** `https://jbdevweb.fr/contact/` (ou version dynamique si ton plan le permet)
  - **Status code :** 301

Sur les plans avec support d’expressions avancées, tu peux cibler “chemin sans slash et sans query” et rediriger vers `https://jbdevweb.fr${uri.path}/`.

4. **Deploy** la règle.

---

## 3. GitHub Pages

- Le **custom domain** dans **Settings** → **Pages** doit être **jbdevweb.fr** (sans www), pour rester cohérent avec la canonical et la règle www → non-www.
- Aucun fichier `_redirects` n’est pris en compte ; tout se fait côté Cloudflare.

---

## 4. Google Search Console

- Ajouter si possible la propriété **domaine** : `jbdevweb.fr` (vérification par enregistrement DNS).
- Après avoir mis en place les redirections Cloudflare, réinspecter les URL en erreur (ex. `https://www.jbdevweb.fr/contact/`) et demander une indexation.

---

## 6. En-têtes de sécurité (HSTS, X-Content-Type-Options)

GitHub Pages ne permet pas d’ajouter des en-têtes HTTP personnalisés depuis le dépôt. Comme le trafic passe par **Cloudflare**, c’est là qu’il faut les configurer.

### HSTS (Strict-Transport-Security)

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **jbdevweb.fr**
2. **SSL/TLS** → **Edge Certificates**
3. Section **HTTP Strict Transport Security (HSTS)** → **Enable HSTS**
4. Paramètres recommandés :
   - **Max Age** : `31536000` (12 mois)
   - **Include subdomains** : activé
   - **Preload** : optionnel (à activer seulement si tu es sûr de garder HTTPS partout longtemps)

### X-Content-Type-Options (et autres en-têtes utiles)

1. **Rules** → **Transform Rules** → **Modify Response Header** → **Create rule**
2. **Rule name :** `Security headers`
3. **When :** `All incoming requests` (ou filtre `http.host eq "jbdevweb.fr" or http.host eq "www.jbdevweb.fr"`)
4. **Then** — ajouter ces en-têtes (action **Set static**) :

| Header | Valeur |
|--------|--------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

5. **Deploy**

Vérification après déploiement (PowerShell ou terminal) :

```bash
curl -sI https://jbdevweb.fr/ | findstr /i "strict-transport-security x-content-type-options"
```

Tu dois voir les deux en-têtes dans la réponse.

---

## Récap

| Où | Quoi |
|----|------|
| **Hostinger** | Domaine + DNS : nameservers ou enregistrements pour que le trafic passe par Cloudflare. |
| **Cloudflare** | Redirect Rules : www → non-www (301) et éventuellement trailing slash (301). |
| **Cloudflare** | HSTS (SSL/TLS) + en-têtes de sécurité (Transform Rules). |
| **GitHub Pages** | Custom domain = jbdevweb.fr ; pas de _redirects. |
| **GSC** | Propriété domaine + réinspection des URL après redirections. |

Les liens internes du site pointent déjà vers `/contact/` (avec slash) pour rester alignés avec le sitemap et les canonical.

---

## 5. Après publication (SEO)

- Vérifier que `https://jbdevweb.fr/sitemap.xml` liste bien `/blog/` et chaque article :
  - `/blog/stock-transfert-pro-shopify/`
  - `/blog/tarif-site-shopify-2026/`
  - `/blog/comparatif-shopify-wix-prestashop-2026/`
  - `/blog/magasin-physique-boutique-en-ligne/`
- **Google Search Console** (propriété domaine `jbdevweb.fr`) : menu **Sitemaps** → saisir `sitemap.xml` et envoyer (ou renvoyer si le fichier a changé).
- Pour chaque nouvelle URL importante : **Inspection de l’URL** → **Demander une indexation**.
- Les pages du blog incluent des balises **Open Graph** / **Twitter Card** et du **JSON-LD** (Article, FAQ, fil d’Ariane). Pour un aperçu social plus lisible, tu peux plus tard remplacer `og:image` (actuellement le favicon) par une image dédiée 1200×630 px hébergée sur le site.
- Pas de règle Cloudflare obligatoire pour les chemins `/blog/...` tant que l’URL publique ne change pas. En cas de **renommage** d’article plus tard, ajouter une **301** vers la nouvelle URL pour ne pas perdre le référencement.
