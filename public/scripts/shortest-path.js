function shortestPath() {
  console.log('shortestPath');
  getProductZones(groupProductZones);
}

function groupProductZones(productZones){
  debugger;
  console.log('productZones: ', productZones);
  var zoneMap = new Object();
  for(var i=0; i<productZones.length; i++) {
    if(typeof zoneMap[productZones[i].zone] !== "undefined") {
      zoneMap[productZones[i].zone].push(productZones[i]);
    } else {
      zoneMap[productZones[i].zone] = new Array();
      zoneMap[productZones[i].zone].push(productZones[i]);
    }
  }
  findShortestPath(zoneMap);
}

function findShortestPath(zoneMap) {
  console.log('zone map:',zoneMap);
  debugger;

  // {"2":[{"product":"Tomato","zone":2},{"product":"Onion","zone":2}],"3":[{"product":"Milk","zone":3}]}

  var currentMarker = sessionStorage.getItem('current-marker');
  var zones = Object.keys(zoneMap);
  var distanceMap = new Object();
  var distanceMapByValue = new Object();

  $.get("./distance.json", function(data, status){
    for(var i=0;i<zones.length;i++) {
      for(var j=0;j<data.length;j++) {
        if(zones[i]==data[j].zone && data[j].marker == parseInt(currentMarker,10)) {
          distanceMap[zones[i]] = data[j].distance;
          distanceMapByValue[data[j].distance] = zones[i];
        }
      }
    }
    debugger;
    console.log('distanceMap: ', distanceMap);
    console.log('distanceMap with distanceKey:', distanceMapByValue);
    console.log('Zones sorted by distance: ', Object.keys(distanceMapByValue).sort());

    var nearestZone = distanceMapByValue[Object.keys(distanceMapByValue).sort()[0]];
    console.log('Nearest zone: ', nearestZone);

    //get arrow
    var arrow;
    $.get("./arrows.json", function(data, status){
      console.log('arrow: ', data);
        for(var i=0;i<data.length;i++) {
          if(data[i].zone == nearestZone && currentMarker == data[i].marker) {
            arrow = data[i].arrow;
          }
        }
        console.log('direction: ', arrow);
        console.log('items to pick up: ', zoneMap[nearestZone]);
        var productStr = '';
        for(i=0; i<zoneMap[nearestZone].length; i++) {
          productStr += zoneMap[nearestZone][i].product + ',';
        }
        $('#selfieMsg').html('Please pick up '+productStr.substring(0,productStr.length-1));
        setTimeout(function() {$('#shoppingList').html('<img class="arrow-image" src="img/'+arrow+'.png"/>');}, 2000);
        $('#preview').show();


    });

  });
}

function getProductZones(cb) {
  var shoppingList = JSON.parse(sessionStorage.getItem('shopping-list-data'));
  var productZones = new Array();
  $.get("./products.json", function(data, status){
      for(var i=0; i<shoppingList.length; i++) {
        for(var j=0; j<data.length; j++) {
          if(data[j].product.toLowerCase() == shoppingList[i]) {
            productZones.push(data[j]);
          }
        }
      }
      cb(productZones);
  });
}