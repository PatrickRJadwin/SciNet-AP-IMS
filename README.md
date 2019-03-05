# SciNet AP Inventory Management System

Inventory tracker for network access points for the SciNet Super Computing Conference in Denver, CO.  This inventory tracker tracks over 300 AP's that handle over 6100 clients across the conference via a floor plan that depicts where each access point is.  Technologies used are Angular 7, and Firebase.

## Getting Started

You will need node/npm installed

in src/app/assets create a file called CONFIG.ts and structure it as so
```
export default
{
    "apiKey": "",
    "authDomain": "",
    "databaseURL": "",
    "projectId": "",
    "storageBucket": "",
    "messagingSenderId": ""
}

// fill empty quotes w/ firebase credentials
```

### Installing

```
npm install
```
```
ng serve -o
```

## Authors

* **Patrick Jadwin** - [PatrickRJadwin](https://github.com/PatrickRJadwin)
* **Cory Merrick** - [Cmerrick02](https://github.com/Cmerrick02)
* **Josh McMahan** - [JGMacs](https://github.com/JGMacs)


