  const map = L.map("map").setView([53.88 , 27.52 ], 12);
  const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  ).addTo(map);

async function getData  () {
  const response = await fetch('./objects.json');
  const data = await response.json();

  const geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };

  let setDivIcon = function(feature) {
    return {
      className: getClassName(feature.properties.type)
    };
  }

  function getClassName(x) {
    switch(x) {
      case "task":
        return 'task mark' ;
        break;
      case "request":
        return 'request mark';
        break;
      case "accident":
        return 'accident mark';
        break;
      default:
        return 'default';
        break;
    }
  };


  const lightData = L.geoJSON(data , {
    onEachFeature: function (feature, layer) {

      const popupContent =  '<h4 class = "text-primary">FeatureCollection</h4>' +
        '<div class="container"><table class="table table-striped">' +
        "<thead><tr><th>Properties</th><th>Type</th></tr></thead>" +
        "<tbody><tr><td> Type </td><td>" +
        feature.properties.type +
        "</td></tr>"
      layer.bindPopup(popupContent);

    },
    // pointToLayer: function (feature, latlng) {
    //   return L.circleMarker(latlng, geojsonMarkerOptions);
    // },

    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: L.divIcon(setDivIcon(feature)) });
    }
  });



  const markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      const clustArr = cluster.getAllChildMarkers()
      let request = clustArr.find(x=> x.feature.properties.type === 'request');
      let task = clustArr.find(x=> x.feature.properties.type === 'task');
      let accident = clustArr.find(x=> x.feature.properties.type === 'accident');
      if (request !== undefined && task !== undefined && accident !== undefined ){
         return L.divIcon({className: 'gradient cluster', iconSize: 30, html: `<div class="count">${cluster.getChildCount()}</div> `  });
      }
      else  if (request === undefined && task !== undefined && accident !== undefined){

        return L.divIcon({className: 'gradient2 cluster', iconSize: 30, html: `<div class="count">${cluster.getChildCount()}</div> `    });
      }
      else  if (request !== undefined && task === undefined && accident !== undefined){
        return L.divIcon({className: 'gradient3 cluster', iconSize: 30, html: `<div class="count">${cluster.getChildCount()}</div> `    });

      }
      else  if (request !== undefined && task !== undefined && accident === undefined){
        return L.divIcon({className: 'gradient4 cluster', iconSize: 30, html: `<div class="count">${cluster.getChildCount()}</div> `    });
      }
      else  if (request !== undefined && task === undefined && accident === undefined){
        return L.divIcon({className: 'request cluster', iconSize: 30, html: `<div class="count">${cluster.getChildCount()}</div> `    });
      }
      else  if (request === undefined && task === undefined && accident !== undefined){
        return L.divIcon({className: 'accident cluster', iconSize: 30, html: `<div class="count">${cluster.getChildCount()}</div> `    });
      }
      else  if (request === undefined && task !== undefined && accident == undefined){

        return L.divIcon({className: 'task cluster', iconSize: 30, html: `<div class="count">${cluster.getChildCount()}</div> `    });
      }
    }
  }).addLayer(lightData);

  map.addLayer(markers)

}

getData()