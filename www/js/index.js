/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);

let pres = false;
let resultJson;
let latitude = undefined;
let longitude = undefined;
let newMarks = [];
let testMarks = [];
let rayon = 1;
// new lat permet d'eviter les doublons:
let mapZoom = 10;
let newLat;
// menu :
let homeButtons = 1;
// file :
let imgURI;

function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  console.log("Fais ton readme !!!");

  // affiche accueil :
  /* accueil(); */
  document.getElementById("accueil").addEventListener("click", setAccueil, false);
  document.getElementById("culture").addEventListener("click", setCulture, false);
  document.getElementById("picture").addEventListener("click", setPicture, false);

  // presentation :
  document.getElementById("buttonPres").addEventListener("click", presentation, false);

  // Autour de moi ?
  document.getElementById("buttonAutour").addEventListener("click", getMMMData, false);

  // Camera :
  document.getElementById("camera").addEventListener("click", openCamera, false);

  // file Camera :
  document.getElementById("savePic").addEventListener("click", moveFile, false);

  // géoloc :
  getPosition();
}

function setAccueil() {
  if (homeButtons !== 1) {
    let element1 = document.getElementById("accueil");
    element1.classList.add("btn-success");
    element1.classList.remove("btn-primary");

    let element2 = document.getElementById("culture");
    element2.classList.add("btn-primary");
    element2.classList.remove("btn-success");

    let element3 = document.getElementById("picture");
    element3.classList.add("btn-primary");
    element3.classList.remove("btn-success");

    homeButtons = 1;
    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    let div3 = document.getElementById("div3");
    if (div1.style.display === "none") {
      div2.style.display = "none";
      div3.style.display = "none";
      div1.style.display = "block";
    }
  }
}

function setCulture() {
  if (homeButtons !== 2) {
    let element1 = document.getElementById("accueil");
    element1.classList.add("btn-primary");
    element1.classList.remove("btn-success");

    let element2 = document.getElementById("culture");
    element2.classList.add("btn-success");
    element2.classList.remove("btn-primary");

    let element3 = document.getElementById("picture");
    element3.classList.add("btn-primary");
    element3.classList.remove("btn-success");

    homeButtons = 2;
    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    let div3 = document.getElementById("div3");
    if (div2.style.display === "none") {
      div1.style.display = "none";
      div3.style.display = "none";
      div2.style.display = "block";
    }
  }
}

function setPicture() {
  if (homeButtons !== 3) {
    let element1 = document.getElementById("accueil");
    element1.classList.add("btn-primary");
    element1.classList.remove("btn-success");

    let element2 = document.getElementById("culture");
    element2.classList.add("btn-primary");
    element2.classList.remove("btn-success");

    let element3 = document.getElementById("picture");
    element3.classList.add("btn-success");
    element3.classList.remove("btn-primary");

    homeButtons = 3;
    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    let div3 = document.getElementById("div3");
    if (div3.style.display === "none") {
      div1.style.display = "none";
      div2.style.display = "none";
      div3.style.display = "block";
    }
  }
}

function showHide() {
  // pas tres utile
  let x = document.getElementById("div1");
  let y = document.getElementById("div2");
  if (x.style.display === "none") {
    y.style.display = "none";
    x.style.display = "block";
  } else {
    x.style.display = "none";
    y.style.display = "block";
  }
}

// Présentation
function presentation() {
  if (!pres) {
    document.getElementById("presentation").innerHTML = `
    <div class="card">
      <div class="card-body">
          Le but de cette application
          est de mettre en oeuvre ce que nous
          avons appris sur ce module Cordova. <br>
          Vous trouverez : <br>
          - Une carte GoogleMaps vous donnant les points de
          culture autour de vous dans Montpellier,<br>
          - Une page permettant de prendre une photo, de l'afficher sur votre écran et de la sauvegarder dans votre gallerie.<br>
          Merci Olivier ! <br>
          Vous pouvez fermer la fenetre en rappuyant sur le bouton ci-dessus.<br>
      </div>
    </div>`;
    pres = !pres;
  } else {
    document.getElementById("presentation").innerHTML = ``;
    pres = !pres;
  }
}

// get positions
function getPosition() {
  var onSuccess = function (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    newLat = latitude;
  };

  // onError Callback receives a PositionError object
  function onError(error) {
    console.log("code: " + error.code + "\n" + "message: " + error.message + "\n");
  }

  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: true,
  });
}

// Get MMM data and filter by distance
function getMMMData() {
  // récupere le rayon d'action
  rayon = parseInt(document.getElementById("Output1").value);

  //console.log("if resultJson", (resultJson === undefined));

  // latitude et longitude ne servent pas pour le momment, elles seront utiles pour trier ensuite.
  const request =
    "https://data.montpellier3m.fr/sites/default/files/ressources/MMM_MMM_Culture.json";

  if (resultJson === undefined) {
    fetch(
      request,
      {
        method: "GET",
        mode: "no-cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
      5000
    )
      .then((result) => {
        if (!result.ok) {
          throw Error(result.status);
        }
        return result.json();
      })
      .then((result) => {
        resultJson = result; //// extrait les résultats dans variable resultJson permettra de retrier sans faire de nouveau fetch !
        FilterMarkers();
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    FilterMarkers();
  }
}

// define Map Zoom
function getZoom(y) {
  let mz = Math.floor(Math.log(40000 / y) / Math.log(2)) - 1;
  if (mapZoom > 20) {
    mz = 20;
  }
  if (mapZoom < 1) {
    mz = 1;
  }
  return mz;
}

// filtre les markeurs Maps
function FilterMarkers() {
  mapZoom = getZoom(rayon);
  //console.log(resultJson);
  let newLat = 0;
  newMarks = [];
  newMarks.push({
    nom: "Vous êtes",
    type: "",
    adresse: "ici",
    ville: "",
    lat: latitude,
    lon: longitude,
  });
  resultJson.features.filter((elem) => {
    if (
      distance(elem.properties.latitude, elem.properties.longitude) <= rayon &&
      newLat !== Number(elem.properties.latitude)
    ) {
      newLat = Number(elem.properties.latitude);
      newMarks.push({
        nom: elem.properties.nom,
        type: elem.properties.theme,
        adresse: elem.properties.adresse,
        ville: elem.properties.ville,
        lat: Number(elem.properties.latitude),
        lon: Number(elem.properties.longitude),
      });
      return newMarks;
    }
  });
  console.log(newMarks.length);
  getMap();
}

// distance from Lat/long :
function distance(lat, lon) {
  let p = 0.017453292519943295; // Math.PI / 180
  let c = Math.cos;
  let a =
    0.5 -
    c((lat - latitude) * p) / 2 +
    (c(latitude * p) * c(lat * p) * (1 - c((lon - longitude) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

// Get GMap  :
function getMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: mapZoom,
    center: new google.maps.LatLng(newMarks[0].lat, newMarks[0].lon),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: false,
  });

  var infowindow = new google.maps.InfoWindow();

  var marker;

  for (let i = 0; i < newMarks.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(newMarks[i].lat, newMarks[i].lon),
      map: map,
    });

    let ContentString = `<div>${newMarks[i].nom}</div>
<div>${newMarks[i].type}</div>
<div>${newMarks[i].adresse}</div>
<div>${newMarks[i].ville}</div>`;

    google.maps.event.addListener(
      marker,
      "click",
      ((marker) => {
        return () => {
          infowindow.setContent(ContentString);
          infowindow.open(map, marker);
        };
      })(marker, i)
    );
  }
  //marker.setMap(map);
}

//function accueil() {}
function setOptions(srcType) {
  var options = {
    // Some common settings are 20, 50, and 100
    quality: 80,
    destinationType: Camera.DestinationType.FILE_URI,
    // In this app, dynamically set the picture source, Camera or photo gallery
    sourceType: srcType,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    allowEdit: false,
    correctOrientation: true, //Corrects Android orientation quirks
  };
  return options;
}

function openCamera() {
  let srcType = Camera.PictureSourceType.CAMERA;
  let options = setOptions(srcType);

  navigator.camera.getPicture(
    function cameraSuccess(imageUri) {
      imgURI = imageUri;
      displayImage(imageUri);
      // You may choose to copy the picture, save it somewhere, or upload.
      //func(imageUri);
    },
    function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    options
  );
}

function displayImage(imgUri) {
  // affiche l'image dans la page
  let elem = document.getElementById("camResult");
  elem.setAttribute("src", imgUri);
  displaySave();
}

function displaySave() {
  // affiche le bouton save picture
  let savePic = document.getElementById("savePic");
  if (savePic.style.display === "none") {
    savePic.style.display = "block";
  }
}

function moveFile() {
  window.resolveLocalFileSystemURL(
    imgURI,
    function (fileEntry) {
      //console.log(cordova.file);
      //console.log("fileEntry :",fileEntry);
      newFileUri = cordova.file.externalRootDirectory + "DCIM/Camera/";
      //console.log("newfileUri :",newFileUri);
      oldFileUri = imgURI;
      //console.log("oldFileUri :",oldFileUri);
      fileExt = "." + oldFileUri.split(".").pop();
      //console.log("fileExt :",fileExt);
      newFileName = fileEntry.name;
      //console.log("newFileName :",newFileName);

      window.resolveLocalFileSystemURL(
        newFileUri,
        function (dirEntry) {
          // move the file to a new directory and rename it
          //console.log(dirEntry);
          fileEntry.moveTo(dirEntry, newFileName, successCallback, errorCallback);
        },
        errorCallback
      );
    },
    errorCallback
  );

  function successCallback(entry) {
    console.log("New Path: " + entry.fullPath);
    document.getElementById("success").innerHTML = "Saved to " + entry.fullPath;
    //directoryFadeOut();
    //alert("Success. New Path: " + entry.fullPath);
  }

  function errorCallback(error) {
    console.log("Error:" + error.code);
    console.log(error);
  }
}
