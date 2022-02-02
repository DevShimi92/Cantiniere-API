<p align="center">
<h1 align="center">Cantiniere_API</h1>
<h4 align="center">API du projet d'école "Cantinière"</h4>
</p>

<p align="center">
<a href="https://github.com/DevShimi92/Cantiniere-API/blob/main/LICENSE"><img alt="GitHub LICENCE" src="https://img.shields.io/github/license/DevShimi92/Cantiniere-API?style=flat-square"></a>
<img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/DevShimi92/Cantiniere-API?style=flat-square">
<a href="https://github.com/DevShimi92/Cantiniere-API/actions?query=workflow%3A%22Check+Code+Quality%22"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/DevShimi92/Cantiniere-API/Check%20Code%20Quality?style=flat-square"></a>
<a href="https://cantiniere-api.herokuapp.com/" target="_blank">
<img alt="Heroku" src="https://img.shields.io/badge/%E2%86%91_Deploy_to-Heroku-7056bf.svg?style=flat-square"></a>
<a href="https://sonarcloud.io/dashboard?id=DevShimi92_Cantiniere-API"><br>
<img alt="Sonarcloud QGS" src="https://sonarcloud.io/api/project_badges/measure?project=DevShimi92_Cantiniere-API&metric=alert_status"></a>
<a href="https://sonarcloud.io/dashboard?id=DevShimi92_Cantiniere-API">
<img alt="Sonarcloud maintainability" src="https://sonarcloud.io/api/project_badges/measure?project=DevShimi92_Cantiniere-API&metric=sqale_rating"></a>
<a href="https://sonarcloud.io/dashboard?id=DevShimi92_Cantiniere-API">
<img alt="Sonarcloud Coverage" src="https://sonarcloud.io/api/project_badges/measure?project=DevShimi92_Cantiniere-API&metric=coverage"></a>
</p>
<br>

[English version](https://github.com/DevShimi92/Cantiniere-API/blob/main/README.md)

## Description

Cantiniere_API est comme son nom l'indique, une api-rest. Créer dans le cadre d'un projet de formation, cette api est héberger sur [Heroku](https://cantiniere-api.herokuapp.com/). 
Celui-ci est utilisable via le [site](https://cantiniere-website.herokuapp.com/home) du même projet (Voir son [git](https://github.com/DevShimi92/Cantiniere-website) pour plus d'info). 

## Installation & Configuration

Vous aurez besoin de Node.js 16 et de Postgresql 13 minimum.

Un compte [Cloudinary](https://cloudinary.com/) (pour utiliser l'espace de stockage d'image ) sera également requis.

Pour l'installation, il suffit de :

```console
npm install
npm run build
```

Puis allez dans le fichier `.env` afin de configurer l'api.

### Obligatoire

```Shell
# URL de la bass de donnée postgres. Exemple : postgresql://user:password@localhost:port/dbname
DATABASE_URL= 

# Adresse du site
SITE_URL=

# Identifiant par défaut de l'admin
COOKER_DEFAUT_EMAIL=  
COOKER_DEFAUT_PASSWORD=

# Clé secrete pour les tokens
SECRET_KEY=
SECRET_KEY_REFRESH=

#Lien vers CLOUDINARY Exemple : cloudinary://000000000000:chaine_de_caractère
CLOUDINARY_URL=
```
Pour les envois des mails, remplir les champs correspondants :
```Shell
SECRET_KEY_REST=
HOST_SMTP_URL_TEST=
SMTP_PORT_TEST=
EMAIL_SUPPORT_TEST=
PASSWORD_SUPPORT_TEST=
```

### Autres paramètres

Voir les commentaires dans le fichier [.env](https://github.com/DevShimi92/Cantiniere-API/blob/main/.env) pour plus de détails sur les autres paramètres. 

## Utilisation

Pour voir comment utiliser l'api, voir la [documentation](https://cantiniere-api.herokuapp.com/doc). (Doc en anglais uniquement)

## License
[MIT](https://github.com/DevShimi92/Cantiniere-API/blob/main/LICENSE)