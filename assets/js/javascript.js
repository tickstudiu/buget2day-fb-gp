// Global variable
var tableDataFood = $('#tableDataFood');
var elementNicePayment = $('#elementNicePayment');
var elementMookPayment = $('#elementMookPayment');
var elementpayment = $('#elementpayment');
var elementbalance = $('#elementbalance');

// when website on loading will query database at firebase
window.onload = function() {
  // Get datebase of Bugget
  getDataBuget();

  // Get database of Infomation
  getDataInfomation();

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
  var dbFoodRef = firebase.database().ref("Buget").limitToLast(10);

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
      //////////////////////////////////////
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
    var balance = allValue.balance;

    // log to see what happen when website on loading
    console.log(NicePayment, MookPayment, payment);

    // Push data to elements
    elementNicePayment.append(NicePayment);
    elementMookPayment.append(MookPayment);
    elementpayment.append(payment);
    elementbalance.append(balance);

  });
}

function handleSave(){
  // Clear table
  tableDataFood.empty();
  elementNicePayment.empty();
  elementMookPayment.empty();
  elementpayment.empty();
  elementbalance.empty();

  // Get all elements
  var date = document.getElementById('date');
  var name = document.getElementById('name');
  var price = document.getElementById('price');
  var whose = document.getElementById('whose');
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
    setBalance(parseInt(price.value));

    // Change value whose to string
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
    }

    getDataInfomation();

    // Send value to another function
    setBuggetDate(date.value, name.value, orderId, parseInt(price.value), whose);
  })
}

function setBuggetDate(date, name, orderId, price, whose){
  // On Buget
  var dbFoodRef = firebase.database().ref("Buget");

  // Push all data to firebase
  dbFoodRef.push({
    date: date,
    name: name,
    orderId: orderId,
    price: price,
    whose: whose,
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

function setBalance(price){
  // On Infomation
  var dbInfodRef = firebase.database().ref("Infomation");

  dbInfodRef.once('value').then(function(dataChildSnap){
    // On Infomation --> Child

    // Get current balance
    var balance = dataChildSnap.val().balance;

    // Update balance
    dbInfodRef.update({
      balance: balance - price,
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
