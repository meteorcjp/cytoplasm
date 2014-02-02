function addText(target,text) {

    var myTarget = document.getElementById(target);
    myTarget.innerText = text;

} 

function searchById(id,result)
{
  for (var i = 0; i < result.length; i+=4) {
    if(result[i] === id)
      {
        return i;
      } 
  }
  return 'error';
}

function clickId(patient) {


  //var i = searchById(patient.id,result);

 // if (i != 'error')
  //{
  localStorage.setItem("patientId", "result[i]");
  localStorage.setItem("name", "result[i+1]");
  localStorage.setItem("dob", "result[i+2]");
  localStorage.setItem("address", "result[i+3]");
  //}

  window.location = "patientDetails.html";

}


function createTable(result) {

  var str = '<table><tr><th>ID</th><th>Name</th><th>Date of birth</th><th>Address</th></tr>';
  
  for (var i = 0; i < result.length; i++) 
  {
    if(i%4 === 0){
      if (result[i] === '')
        {
          str = str;
        }
      else
        {
          if(i%8 === 4)
          {str += '<tr class=even id='+ result[i] + ' onclick = clickId(this) ><td>' + result[i] + '</td>';}
        else
          {str += '<tr id='+ result[i] + ' onclick = clickId(this) ><td>' + result[i] + '</td>';}
        
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
      if(result[i] === "HeartRateSensor")
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
  var name = localStorage.getItem("name");
  alert(name);
  var dob = localStorage.getItem("dob");
  var address = localStorage.getItem("address");

  
 /* var detail = 'patientID:/' + patientID + '/Name:/' + name + '/DateOfBirth:/' + dob + '/Address:/' + address + '/Sensor:/HeartRateSensor';
  var detailList = detail.split('/');
  var patientDetails = document.getElementById("responseTextB");
  patientDetails.innerHTML =  createPatientDetails(detailList);*/

}

  
function drawSensorGraph() {
  
  var data = [],
      totalPoints = 300;

  var username = localStorage.getItem("username");
  var password = localStorage.getItem("password");
  var start = '';
  var end = '';
  var article = '40';
  var taxonomy = 'health-cardio-heartrate';
  var y = '';

    function getData() {

      if (data.length > 0)
        data = data.slice(1);

      // Do a random walk

      while (data.length < totalPoints) {

        $.post("http://comp2013.hyperspacedesign.co.uk/api/data/index.php" ,
        {
          start : start,
          end  : end,
          username : username,
          password : password,
          article : article,
          taxonomy : taxonomy
        },
        function(data_rec)
        {
          var readValues = data_rec.split('/');
          y = readValues[0];
      
        });

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

    var updateInterval = 1000;
    

    var plot = $.plot("#placeholder", [ getData() ], {
      series: {
        shadowSize: 0 // Drawing is faster without shadows
      },
      yaxis: {
        min: 0,
        max: 200
      },
      xaxis: {
        show: false
      }
    });

    function update() {

      plot.setData([getData()]);

      // Since the axes don't change, we don't need to call plot.setupGrid()

      plot.draw();
      setTimeout(update, updateInterval);
    }

    update();


  
}

/*function testRec() {

  var username = localStorage.getItem("username");
  var password = localStorage.getItem("password");
  var start = '';
  var end = '';
  var article = '40';
  var taxonomy = 'health-cardio-heartrate';


  $.post("http://comp2013.hyperspacedesign.co.uk/api/data/index.php" ,
  {
    start : start,
    end  : end,
    username : username,
    password : password,
    article : article,
    taxonomy : taxonomy
  },
  function(data_rec)
  {
    if(data_rec == 'null')
      {addText(dataRecieve,'CAN NOT RECEIVE DATA');}
    else{
    addText(dataRecieve,data_rec);}

  });

}*/