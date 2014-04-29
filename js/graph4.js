var printData4 = [];
var storedData4 = [];
var totalPoints4 = 60;
var print4_end = 3600;
var jump4 = 60;
var start4 = Math.round(new Date().getTime() / 1000)-3600;
var end4 = Math.round(new Date().getTime() / 1000);


function increaseScope4() {
  if(totalPoints4*2 <= 3600)
  {
    totalPoints4 = totalPoints4*2; 
    printData4 = getPrintData(storedData4,printData4,totalPoints4);
    $.plot("#placeholder4",[printData4],graphSettings);
  }
}


function decreaseScope4() {
  if(totalPoints4/2 >= 4)
  {
    totalPoints4 = totalPoints4/2;
    printData4 = getPrintData(storedData4,printData4,totalPoints4);
    $.plot("#placeholder4",[printData4],graphSettings);
  }
}


function getPreData4() {
  print4_end = print4_end - jump4;

  printData4 = getPrintData(storedData4,print4_end,totalPoints4);
  $.plot("#placeholder4",[printData4],graphSettings);
}


function getFwData4() {

  if(print4_end + 5 > storedData4.length - 1)
  {
    print4_end = storedData4.length -1;
  }
  else{
  print4_end = print4_end + jump4;
  }

   printData4 = getPrintData(storedData4,print4_end,totalPoints4);
  $.plot("#placeholder4",[printData4],graphSettings);
}


function showData4() {
  var newestData = document.getElementById("dataReceive4");
  if (printData4[printData4.length - 1][1] != null) 
  {
    newestData.innerText = printData4[printData4.length - 1][1];
  }
  else
  {
    newestData.innerText = "no data";
  }
  var newestTime = document.getElementById("timeReceive4");
  newestTime.innerText = unixTimeToDate(printData4[printData4.length - 1][0]/1000);
}


function drawGraph4() {

  var m = end4 + 1;
  while(end4 < m)
  {
    end4 = Math.round(new Date().getTime() / 1000);
  } 

  if(storedData4.length > 0) {
    var lastValue = storedData4[storedData4.length - 1][1];
  }
  else{
    var lastValue = null;
  }
  

  $.post("http://uclcytoplasm.cloudapp.net/api/data/", 
    {      
      authkey: authkey,
      article: article,
      taxonomy: taxonomy,
      start: start4,
      end: end4,
      username: username
    },
    function (data) 
    {

      if(data.error != null)
      {
        alert(data.error);
      }
      else{

      var newData = zipNewData(data);
      storedData4 = storedData4.concat(fillInBlank(start4,end4,lastValue,newData));

      print4_end += 1;
      printData4 = getPrintData(storedData4,print4_end,totalPoints4);
      $.plot("#placeholder4",[printData4],graphSettings);
      
      start4 = end4 + 1;
      showData4();
      drawGraph4();
      }
    });

}