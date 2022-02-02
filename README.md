<p align="center">
<h1 align="center">Cantiniere_API</h1>
<h4 align="center">API of the School project "Cantinière"</h4>
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

[Version Française](https://github.com/DevShimi92/Cantiniere-API/blob/main/README_fr.md)

## Description

Cantiniere_API is as its name suggests, an api-rest. Created as part of a school project, this API is hosted on [Heroku](https://cantiniere-api.herokuapp.com/). This one can be used via the [site](https://cantiniere-website.herokuapp.com/home) of the same project (See the [git](https://github.com/DevShimi92/Cantiniere-website) for more info).

## Installation & Setup

You will need Node.js 16 and Postgresql 13 minimum.

A [Cloudinary](https://cloudinary.com/) account (to use image storage space) will also be required.

To install, all you need is:

```console
npm install
npm run build
```

Then go to the `.env` file to configure the api.

### Required

```Shell
# Url of database postgres. Example : postgresql://user:password@localhost:port/dbname
DATABASE_URL=

# Site address
SITE_URL=

# Identifiant of admin (cooker)
COOKER_DEFAUT_EMAIL=  
COOKER_DEFAUT_PASSWORD=

# Secret key for token and rest token of api
SECRET_KEY=
SECRET_KEY_REFRESH=

# Link to Cloudinary Storage. Example : cloudinary://000000000000:string_of_characters
CLOUDINARY_URL=
```
For sending emails, fill in the corresponding fields :
```Shell
SECRET_KEY_REST=
HOST_SMTP_URL_TEST=
SMTP_PORT_TEST=
EMAIL_SUPPORT_TEST=
PASSWORD_SUPPORT_TEST=
```


### Other settings

See comments in [.env](https://github.com/DevShimi92/Cantiniere-API/blob/main/.env) file for details on other settings.

## Usage

To see how to use the api, see the [documentation](https://cantiniere-api.herokuapp.com/doc).

## License
[MIT](https://github.com/DevShimi92/Cantiniere-API/blob/main/LICENSE)