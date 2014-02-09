var patient_list = null;

function addText(target,text) {

    var myTarget = document.getElementById(target);
    myTarget.innerText = text;

} 

function searchById(id)
{
  for (var i = 0; i < patient_list.length; i+=4) {
    if(patient_list[i] === id)
      {
        return i;
      } 
  }
  return 'error';
}

function clickId(patient) {


  var i = searchById(patient.id);

  if (i != 'error')
  {
  localStorage.setItem("patientId", patient_list[i]);
  localStorage.setItem("name", patient_list[i+1]);
  localStorage.setItem("dob", patient_list[i+2]);
  localStorage.setItem("address", patient_list[i+3]);
  }

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
     str += result[i];
      
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
      patient_list = patientList;
      var table = document.getElementById("responseTextA");
      table.innerHTML = createTable(patientList);
    });

}

function loadPatientDetails() {

  var patientId = localStorage.getItem("patientId");
  var name = localStorage.getItem("name");
  var dob = localStorage.getItem("dob");
  var address = localStorage.getItem("address");

  
  var detail = 'ID: /' + patientId + '/Name: /' + name + '/Date Of Birth: /' + dob + '/Address: /' + address;
  var detailList = detail.split('/');
  var patientDetails = document.getElementById("responseTextB");
  patientDetails.innerHTML =  createPatientDetails(detailList);

  drawGraph1();

}

  
function drawGraph1() {
  
  var data = [],
      totalPoints = 720;

  var currentTime = Math.round(new Date().getTime()/1000);



  var username = localStorage.getItem("username");
  var password = localStorage.getItem("password");
  var start = currentTime - 3600;
  var end = currentTime;
  var article = localStorage.getItem("patientId");
  var taxonomy = 'health-cardio-heartrate';
  var y = '';

  function getData() {

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
      for (var i = 0; i < readValues.length/2; i++) {
          data[i] = readValues[i*2];
        };   
      var dataReceive = document.getElementById("dataReceive");
      dataReceive.innerText = data ;
    }
    );


    // Zip the generated y values with the x values

    var res = [];
    for (var i = 0; i < data.length; i++) {
      res.push([i, data[i]])
    }

    return res;
  }

    // Set up the control widget

    var updateInterval = 500;
    

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
