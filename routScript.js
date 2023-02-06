function getFormatDate(dateTimestamp) {
  const dat = new Date(dateTimestamp*1000);

  return (
    String(dat.getDate()) +
    "-" +
    String(dat.getMonth() + 1) +
    "-" +
    String(dat.getFullYear())
  );
}

async function getRoutsData  () {
  const response = await fetch('./route.json');
  const dataRoutes = await response.json();

  const map = L.map("mapRout").setView([53.88 , 27.52 ], 12);
  const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  ).addTo(map);

  // let markerRout = L.marker([53.88 , 27.52]).addTo(map)

    let waypoints = [];

  const routeControl = L.Routing.control({
    plan: L.Routing.plan(waypoints, {
      createMarker: function(i, wp ) {
        const data = dataRoutes.route.find((el, index)=> index === i)
        const popupContent =  '<h4 class = "text-primary">Title</h4>' +
          '<div class="container"><table class="table table-striped">' +
          "<thead><tr><th>Properties</th><th>Type</th></tr></thead>" +
          "<tbody><tr><td> Время</td><td>" +
           getFormatDate(data.time)  +
          "</td></tr>"+`<tr><td>Скорость</td><td> ${data.speed}</td></tr></thead>`
        return L.marker(wp.latLng, {
            draggable: false
          }).bindPopup(popupContent)
            .openPopup();
      }
    }),
    addWaypoints: false,
    routeWhileDragging: false,
    show:false,
  }).addTo(map);
  routeControl.setWaypoints(dataRoutes.route);

}

getRoutsData()