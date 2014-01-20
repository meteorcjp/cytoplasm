function addText(target,text) {

    var myTarget = document.getElementById(target);
    myTarget.innerText = text;

} 

function clickId(patient) {

  localStorage.setItem("patientId", patient.id);
  window.location = "patientDetails.html";

}


function createTable(result) {

  var str = '<table><tr><td>ID</td><td>Name</td><td>Date of birth</td><td>Address</td></tr>';
  for (var i = 0; i < result.length; i++) 
  {
    if(i%4 === 0){
      if (result[i] === 'ID')
        {
          str += '<tr><td>'+ result[i] + '</td>';
        }
      else
        {
        str += '<tr><td>'+ '<button id='+ result[i] + ' onclick = clickId(this)> ' + result[i] +'</button></td>';
        }
    }
    else{
      if(i%4 === 3){
        str += '<td>'+ result[i] + '</td></tr>';
      }
      else
      {
        str += '<td>'+ result[i] + '</td>';
      }
    }
  }
  str += '</table>';
  return str;

}

function createPatientDetails(result) {

  var str ='';
  for (var i = 0; i < result.length; i++) {
      if(result[i] === "Heart Rate Sensor")
      {
        str += '<button id='+ result[i] + ' onclick = drawSensorGraph()> ' + result[i] +'</button></td>';
      }
      else
      {
      str += result[i];
      }
      if(i%2 === 1)
      {
        str += '<br>';
      } 
    }
    return str;

}


function submitForm() {

   $.post("http://comp2013.hyperspacedesign.co.uk/api/login/index.php" ,
   {
    username : $('#username').val(),
    password : $('#password').val()
  },
  function(data)
  {
    if( data == "LOGIN_SUCCESSFUL")
    {
      localStorage.setItem("username", $('#username').val());
      localStorage.setItem("password", $('#password').val());
      window.location = "patientList.html";
    }
    else
    {
      addText('responseText',data);
    } 
  });

}

function loadPatientList() {

  var username = localStorage.getItem("username");
  var password = localStorage.getItem("password");
  
  $.post("http://comp2013.hyperspacedesign.co.uk/api/articles/index.php" ,
    {
      username : username,
      password : password
    },
    function(data)
    {
      var patientList = data.split('/');
      var table = document.getElementById("responseTextA");
      table.innerHTML = createTable(patientList);
    });

}

function loadPatientDetails() {

  var patientId = localStorage.getItem("patientId");

  $.post("patientDetails.php" ,
   {
    userId : patientId
  },
  function(data)
  {
    var detail = data.split('/');
    var patientDetails = document.getElementById("responseTextB");
    patientDetails.innerHTML =  createPatientDetails(detail);
  });

}

function drawSensorGraph() {
  
  var data = [],
      totalPoints = 300;

    function getRandomData() {

      if (data.length > 0)
        data = data.slice(1);

      // Do a random walk

      while (data.length < totalPoints) {

        var prev = data.length > 0 ? data[data.length - 1] : 50,
          y = prev + Math.random() * 10 - 5;

        if (y < 0) {
          y = 0;
        } else if (y > 100) {
          y = 100;
        }

        data.push(y);
      }

      // Zip the generated y values with the x values

      var res = [];
      for (var i = 0; i < data.length; ++i) {
        res.push([i, data[i]])
      }

      return res;
    }

    // Set up the control widget

    var updateInterval = 30;
    $("#updateInterval").val(updateInterval).change(function () {
      var v = $(this).val();
      if (v && !isNaN(+v)) {
        updateInterval = +v;
        if (updateInterval < 1) {
          updateInterval = 1;
        } else if (updateInterval > 2000) {
          updateInterval = 2000;
        }
        $(this).val("" + updateInterval);
      }
    });

    var plot = $.plot("#placeholder", [ getRandomData() ], {
      series: {
        shadowSize: 0 // Drawing is faster without shadows
      },
      yaxis: {
        min: 0,
        max: 100
      },
      xaxis: {
        show: false
      }
    });

    function update() {

      plot.setData([getRandomData()]);

      // Since the axes don't change, we don't need to call plot.setupGrid()

      plot.draw();
      setTimeout(update, updateInterval);
    }

    update();


  
}