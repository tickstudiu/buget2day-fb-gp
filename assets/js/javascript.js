// Global variable
var tableDataFood = $('#tableDataFood');
var elementNicePayment = $('#elementNicePayment');
var elementMookPayment = $('#elementMookPayment');
var elementpayment = $('#elementpayment');
var elementfood = $('#elementfood');
var elementwares = $('#elementwares');
var elementanother = $('#elementanother');

var tableDateBugetNice = $('#tableDateBugetNice');
var elementtotalFoodNice = $('#elementtotalFoodNice');
var elementtotalWaresNice = $('#elementtotalWaresNice');
var elementtotalAnotherNice = $('#elementtotalAnotherNice');
var elementtotalNice = $('#elementtotalNice');
var elementlistFoodNice = $('#elementlistFoodNice');
var elementlistWaresNice = $('#elementlistWaresNice');
var elementlistAnotherNice = $('#elementlistAnotherNice');

var tableDateBugetMook = $('#tableDateBugetMook');
var elementtotalFoodMook = $('#elementtotalFoodMook');
var elementtotalWaresMook = $('#elementtotalWaresMook');
var elementtotalAnotherMook = $('#elementtotalAnotherMook');
var elementtotalMook = $('#elementtotalMook');
var elementlistFoodMook = $('#elementlistFoodMook');
var elementlistWaresMook = $('#elementlistWaresMook');
var elementlistAnotherMook = $('#elementlistAnotherMook');

// when website on loading will query database at firebase
window.onload = function() {
  // Get datebase of Bugget
  getDataBuget();

  // Get database of Infomation
  getDataInfomation();

  // Get database of Buget's nice
  getDataBugetNice();

  // Get database of Buget's mook
  getDataBugetMook();

  // Show chart/
  showChart();
}

function showChart(){
  // Find where chart
  var ctx = document.getElementById("myChart").getContext('2d');

  // Create chart
  var myChart = new Chart(ctx, {

    // What type you want to do
      type: 'line',

    // what data you have
      data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },

      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
}

function getDataBuget(){
  // On Buget
  var dbFoodRef = firebase.database().ref("Buget").orderByChild('date').limitToLast(10);

  dbFoodRef.once('value').then(function(dataSnap){
    // On Buget -> (key)

    dataSnap.forEach(function(dataChildSnap) {
      // On Buget -> (key) -> Child

      // Get key and value at child node
      var keyValue = dataChildSnap.key;
      var allValue = dataChildSnap.val();

      // Extend value object to get infomation
      var date = allValue.date;
      var name = allValue.name;
      var orderId = allValue.orderId;
      var price = allValue.price;
      var whose = allValue.whose;
      var type = allValue.type;

      // log to see what happen when website on loading
      console.log(date, name, orderId, price, whose);

      // Push data to table
      tableDataFood.append("<tr>")
      tableDataFood.append("<th scope='row'>" + orderId + "</th>");
      tableDataFood.append("<td>" + date + "</td>");
      tableDataFood.append("<td>" + name + "</td>");
      tableDataFood.append("<td>" + price + "</td>");
      tableDataFood.append("<td>" + whose + "</td>");
      tableDataFood.append("</tr>");

    });
  });
}

function getDataInfomation() {
  // On Infomation
  var dbInfoRef = firebase.database().ref("Infomation");

  dbInfoRef.once('value').then(function(dataChildSnap){
    // On Infobation -> child

    // Get key and value at child node
    var keyValue = dataChildSnap.key;
    var allValue = dataChildSnap.val();

    // Extend value object to get infomation
    var MookPayment = allValue.MookPayment;
    var NicePayment = allValue.NicePayment;
    var payment = allValue.payment;
    var food = allValue.food;
    var wares = allValue.wares;
    var another = allValue.another;

    // log to see what happen when website on loading
    console.log(NicePayment, MookPayment, payment, food, wares, another);

    // Push data to elements
    elementNicePayment.append(NicePayment);
    elementMookPayment.append(MookPayment);
    elementpayment.append(payment);
    elementfood.append(food);
    elementwares.append(wares);
    elementanother.append(another);

  });
}

function handleSave(){
  // Clear table
  tableDataFood.empty();
  elementNicePayment.empty();
  elementMookPayment.empty();
  elementpayment.empty();
  elementfood.empty();
  elementwares.empty();
  elementanother.empty();

  // Get all elements
  var date = document.getElementById('date');
  var name = document.getElementById('name');
  var price = document.getElementById('price');
  var whose = document.getElementById('whose');
  var type = document.getElementById('type');
  var orderId = 0;

  // On Infomation
  var dbInfoRef = firebase.database().ref("Infomation");

  dbInfoRef.once('value').then(function(dataChildSnap){
    // On Infobation -> child

    // Get key and value at child node
    var keyValue = dataChildSnap.key;
    var allValue = dataChildSnap.val();

    // Extend value object to get infomation
    var orderId = allValue.lastId;

    // Change type ot value
    orderId = parseInt(orderId);

    // Plus 1
    orderId = orderId + 1;

    // Set lastId in infomation
    setLastId(orderId);
    setPayment(parseInt(price.value));

    // Chack who payment
    if(whose.value == '1') {
      whose = '@nice';
      setNicePayment(parseInt(price.value));
    }
    else if (whose.value == '2') {
      whose = '@mook';
      setMookPayment(parseInt(price.value));
    }
    else {
      alert("select whose payment");
      return;
    }

    // Chack type of payment
    if(type.value == '1') {
      setFood(parseInt(price.value));
    }
    else if (type.value == '2') {
      setWares(parseInt(price.value));
    }
    else if (type.value == '3') {
      setAnother(parseInt(price.value));
    }
    else {
      alert("select type");
      return;
    }

    getDataInfomation();

    // Send value to another function
    setBuggetDate(date.value, name.value, orderId, parseInt(price.value), whose, type.value);
  })
}

function setBuggetDate(date, name, orderId, price, whose, type){
  // On Buget
  var dbFoodRef = firebase.database().ref("Buget");

  // Push all data to firebase
  dbFoodRef.push({
    date: date,
    name: name,
    orderId: orderId,
    price: price,
    whose: whose,
    type: type,
  })

  // Affter send date will show data at log again
  getDataBuget();
}

function setLastId(lastId){
  // On Infomation
  var dbInfodRef = firebase.database().ref("Infomation");

  // Update Lastid
  dbInfodRef.update({
    lastId: lastId,
  })
}

function setPayment(price){
  // On Infomation
  var dbInfodRef = firebase.database().ref("Infomation");

  dbInfodRef.once('value').then(function(dataChildSnap){
    // On Infomation --> Child

    // Get current payment
    var payment = dataChildSnap.val().payment;

    // Update payment
    dbInfodRef.update({
      payment: payment + price,
    })

  });
}

function setNicePayment(price){
  // On Infomation
  var dbInfodRef = firebase.database().ref("Infomation");

  dbInfodRef.once('value').then(function(dataChildSnap){
    // On Infomation --> Child

    // Get current NicePayment
    var NicePayment = dataChildSnap.val().NicePayment;

    // Update NicePayment
    dbInfodRef.update({
      NicePayment: NicePayment + price,
    })

  });
}

function setMookPayment(price){
  // On Infomation
  var dbInfodRef = firebase.database().ref("Infomation");

  dbInfodRef.once('value').then(function(dataChildSnap){
    // On Infomation --> Child

    // Get current MookPayment
    var MookPayment = dataChildSnap.val().MookPayment;

    // Update MookPayment
    dbInfodRef.update({
      MookPayment: MookPayment + price,
    })

  });
}

function setFood(price){
  // On Infomation
  var dbInfodRef = firebase.database().ref("Infomation");

  dbInfodRef.once('value').then(function(dataChildSnap){
    // On Infomation --> Child

    // Get current food
    var food = dataChildSnap.val().food;

    // Update food
    dbInfodRef.update({
      food: food + price,
    })

  });
}

function setWares(price){
  // On Infomation
  var dbInfodRef = firebase.database().ref("Infomation");

  dbInfodRef.once('value').then(function(dataChildSnap){
    // On Infomation --> Child

    // Get current wares
    var wares = dataChildSnap.val().wares;

    // Update food
    dbInfodRef.update({
      wares: wares + price,
    })

  });
}

function setAnother(price){
  // On Infomation
  var dbInfodRef = firebase.database().ref("Infomation");

  dbInfodRef.once('value').then(function(dataChildSnap){
    // On Infomation --> Child

    // Get current another
    var another = dataChildSnap.val().another;

    // Update food
    dbInfodRef.update({
      another: another + price,
    })

  });
}

function getDataBugetNice(){
  // On Buget
  var dbBugetRef = firebase.database().ref("Buget").orderByChild('whose').equalTo('@nice');

  var totalFood = 0;
  var totalWares = 0;
  var totalAnother = 0;
  var total = 0;

  var listFood = '';
  var listWares = '';
  var listAnother = '';

  dbBugetRef.once('value').then(function(dataSnap){
    // On Buget --> (key)

    dataSnap.forEach(function(dataChildSnap){
      // On Buget -> (key) -> Child

      // Get key and value at child node
      var keyValue = dataChildSnap.key;
      var allValue = dataChildSnap.val();

      // Extend value object to get infomation
      var date = allValue.date;
      var name = allValue.name;
      var orderId = allValue.orderId;
      var price = allValue.price;
      var whose = allValue.whose;
      var type = allValue.type;

      // Check what type of order
      if(type == '1') {
        totalFood = totalFood + price;
        total = total + price;
        listFood += name + ', ';
      }
      else if (type == '2') {
        totalWares = totalWares + price;
        total = total + price;
        listWares += name + ', ';
      }
      else if (type == '3') {
        totalAnother = totalAnother + price;
        total = total + price;
        listAnother += name + ', ';
      }

      // log to see what happen when website on loading
      console.log(date, name, orderId, price, whose);
      console.log(totalFood, totalWares, totalAnother, total);

      // Push data to table
      tableDateBugetNice.append("<tr>")
      tableDateBugetNice.append("<th scope='row'>" + orderId + "</th>");
      tableDateBugetNice.append("<td>" + date + "</td>");
      tableDateBugetNice.append("<td>" + name + "</td>");
      tableDateBugetNice.append("<td>" + price + "</td>");
      tableDateBugetNice.append("<td>" + whose + "</td>");
      tableDateBugetNice.append("</tr>");

      elementtotalAnotherNice.html(totalAnother);
      elementtotalFoodNice.html(totalFood);
      elementtotalWaresNice.html(totalWares);
      elementtotalNice.html(total);

      elementlistFoodNice.html(listFood);
      elementlistWaresNice.html(listWares);
      elementlistAnotherNice.html(listAnother);

    });
  });
}

function getDataBugetMook(){
  // On Buget
  var dbBugetRef = firebase.database().ref("Buget").orderByChild('whose').equalTo('@mook');

  var totalFood = 0;
  var totalWares = 0;
  var totalAnother = 0;
  var total = 0;

  var listFood = '';
  var listWares = '';
  var listAnother = '';

  dbBugetRef.once('value').then(function(dataSnap){
    // On Buget --> (key)

    dataSnap.forEach(function(dataChildSnap){
      // On Buget -> (key) -> Child

      // Get key and value at child node
      var keyValue = dataChildSnap.key;
      var allValue = dataChildSnap.val();

      // Extend value object to get infomation
      var date = allValue.date;
      var name = allValue.name;
      var orderId = allValue.orderId;
      var price = allValue.price;
      var whose = allValue.whose;
      var type = allValue.type;

      // Check what type of order
      if(type == '1') {
        totalFood = totalFood + price;
        total = total + price;
        listFood += name + ', ';
      }
      else if (type == '2') {
        totalWares = totalWares + price;
        total = total + price;
        listWares += name + ', ';
      }
      else if (type == '3') {
        totalAnother = totalAnother + price;
        total = total + price;
        listAnother += name + ', ';
      }

      // log to see what happen when website on loading
      console.log(date, name, orderId, price, whose);
      console.log(totalFood, totalWares, totalAnother, total);

      // Push data to table
      tableDateBugetMook.append("<tr>")
      tableDateBugetMook.append("<th scope='row'>" + orderId + "</th>");
      tableDateBugetMook.append("<td>" + date + "</td>");
      tableDateBugetMook.append("<td>" + name + "</td>");
      tableDateBugetMook.append("<td>" + price + "</td>");
      tableDateBugetMook.append("<td>" + whose + "</td>");
      tableDateBugetMook.append("</tr>");

      elementtotalAnotherMook.html(totalAnother);
      elementtotalFoodMook.html(totalFood);
      elementtotalWaresMook.html(totalWares);
      elementtotalMook.html(total);

      elementlistFoodMook.html(listFood);
      elementlistWaresMook.html(listWares);
      elementlistAnotherMook.html(listAnother);

    });
  });
}
