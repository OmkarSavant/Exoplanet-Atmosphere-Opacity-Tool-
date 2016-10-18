
// 2-17-15
// 5:00 PM
// Problems: starts at 1.6 instead of 0.8 but if that is adjusted, then all the correct peaks show

var myPressure;
var myTemp;
var opacityBoolean; 

/*
    Upon opening of webpage, calls the makeChart and graphAbunds to have blank graphs. Also sets the commands
    for each button press action. 
*/
$(document).ready(function() {
    makeChart();
    graphAbunds();
    $('#refreshbutton').click(function() {
        location.reload();
    }); 

    $('#interpolatebutton').click(function() {
        myPressure = $("input[name=bar]").val();
        myTemp = $("input[name=kelvin]").val();

    if (myPressure > 10 || myPressure < 0.000001) {
       window.alert("Error: Your pressure is out of our data set range. Please enter another pressure.");
        //say if its too high or too low
        // Find another way to present the data besides window which they can close 
                $('#pressure').removeClass('green');
                $('#pressure').addClass('red');
    
    } 
    else {
        var xcoordinate = myPressure;
                $('#pressure').removeClass('red');
                $('#pressure').addClass('green');


    }
    if (myTemp > 4000 || myTemp < 75) {
        window.alert("Error: Your temperature is out of our data set range. Please enter another temperature.");
                $('#temperature').removeClass('green');
                $('#temperature').addClass('red');

        }
    else {
        var ycoordinate = myTemp;
                $('#temperature').removeClass('red');
                $('#temperature').addClass('green');
    }

//If all of the parameters entered are within an acceptable range, the charts are re-created. 
if ((myPressure <= 10) && (myPressure >= 0.000001) && (myTemp <= 4000) && (myTemp >= 75)) 
        {
           //opacityBoolean = false; 
            makeChart();
            graphAbunds(); 

            //The four nearest PT points are found, which then calls subsequent methods. The returned values are used in the data plotting methods
            findFourNear(myPressure, myTemp);

            //Splits list of all temperatures and abundances from online database and calls getElements method to plot dataa
            $.get("http://www.ucolick.org/~cmorley/sipwebsite/CombinedNumPTandAbundsRaw.txt",function(data)
                {
                    var abundsData = data.toString().split(",");
                    getElements(abundsData, opacityBoolean);

                });
        };
});

/*$('#opacitybutton').click(function() {   
        myPressure = $("input[name=bar]").val();
        myTemp = $("input[name=kelvin]").val();
        findFourNear(myPressure, myTemp);

    }); */
});

var firstX; 
var secondX;
var firstY; 
var secondY;

//sets the firstX, secondX, firstY, and secondY values based on the point entered to find the four nearest points. 
function findFourNear(xcoordinate, ycoordinate){

var xpressures = [0.000001, 0.000003, 0.00001, 0.00003 , 0.0001, 0.0003, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3, 10];
//include higher temperatures and pressures 

var ytemperatures = [75, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 275, 300, 400, 500, 575, 650, 725, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2300, 2600, 3000, 3500, 4000];


//Sets the first X and second X in case the entered data is the first pressure value if the values are exact the preset array values 
for (i = 0; i<= xpressures.length -1; i++) {
    if (xcoordinate == xpressures[i]) {
        if (i != 0 && i!=14) {
            firstX = xpressures[i];
            secondX = xpressures[i+1];
            break;
        }
        else if (i == 0){
            secondX = 0.000003;
            firstX = 0.000001;
            break;
        }
        else{
            firstX = 3;
            secondX = 10;
            break;
        }
    }

    // If the value is between the first and second values, the firstX and secondX are set to the first two values
    if (xpressures[i] < xcoordinate && xpressures[i+1] > xcoordinate) {
        firstX = xpressures[i];
        secondX = xpressures [i+1];
        break;
    }
};

//Sets the first Y and second Y in case the entered data is the first temperature value if the values are exact
for (i = 0; i<= ytemperatures.length -1; i++) {
    if (ycoordinate == ytemperatures[i]) {
        if (i != 0 && i!=41) {
            firstY = ytemperatures[i];
            secondY = ytemperatures[i+1];
            break;
        }
        else if (i == 0) {
            secondY = 100;
            firstY = 75;
            break;
        }
        else {
            firstY = 3500;
            secondY = 4000;
            break;
        }
    }

    // If the entered temp value is between the first and second array values, the firstY and secondY are set to the first two values
    if (ytemperatures[i] < ycoordinate && ytemperatures[i+1] > ycoordinate) {
        firstY = ytemperatures[i];
        secondY = ytemperatures [i+1];
        break;
    }
};

}; // end of findFourNear

//These represent the four points around the entered point
var w;
var x;
var y; 
var z; 


// these values contain the PT values for the points w, x, y, z for use in the opacity file fetching.
var wPoint;
var xPoint; 
var yPoint;
var zPoint; 


function getElements(abundsData){

var abundsArray = abundsData.toString().split(","); 

var numberOfElementsInAbunds = 30740; 
var numberOfElementsInRow = 29; 

for(var i = 3; i < 29; i++) 
{
        
    for (var j = 0; j < numberOfElementsInAbunds; j+= numberOfElementsInRow) 
    {

        var numTester0Array = (abundsArray[j + 1]).split("e-");  

        if(numTester0Array[1])
        {   
            var numTester0 = parseFloat(numTester0Array[0]) * (Math.pow(10, (-1) * parseFloat(numTester0Array[1])));    
        }
        else{
            var numTester0 = numTester0Array[0]; 
        }
        

        var numTester1Array = (abundsArray[j + 2]).split("e-");         
        if(numTester1Array[1])
        {   
            var numTester1 = parseFloat(numTester1Array[0]) * (Math.pow(10, (-1) * parseFloat(numTester1Array[1]))); 
        }
        else
        {
           var numTester1 = numTester1Array[0]; 
        }
        
        //window.alert("j: " + j + "numTester0: " + numTester0 + "\n" + "numTester1:" + numTester1 + "firstX:" + firstX + "\n" + "firstY:" + firstY + "secondX: " + secondX + "secondY: " + secondY); 
        // this is where the split happens

        if (numTester0 == firstX && numTester1  == secondY) 
        {
            
            var numTesterWArray = (abundsArray[j+ i]).split("E-");  
            w = parseFloat(numTesterWArray[0]) * (Math.pow(10, (-1) * parseFloat(numTesterWArray[1])));
            wPoint = abundsArray[j+ 0].toString(); 
            continue; 
            //w = numTesterW;
            
        }

        if (numTester0 == secondX && numTester1  == secondY) 
        {
            var numTesterXArray = (abundsArray[j + i]).split("E-");  
            x = parseFloat(numTesterXArray[0]) * (Math.pow(10, (-1) * parseFloat(numTesterXArray[1])));
            xPoint = abundsArray[j+ 0].toString(); 
            continue; 
            //x = numTesterX;
            
        }

        if (numTester0 == firstX && numTester1  == firstY) 
        {
            var numTesterYArray = (abundsArray[j + i]).split("E-");  
            y = parseFloat(numTesterYArray[0]) * (Math.pow(10, (-1) * parseFloat(numTesterYArray[1])));
            yPoint = abundsArray[j+ 0].toString(); 
            continue; 
            //y = numTesterY;
            
        }
        if (numTester0 == secondX && numTester1  == firstY) 
        {
            var numTesterZArray = (abundsArray[j + i]).split("E-");  
            z = parseFloat(numTesterZArray[0]) * (Math.pow(10, (-1) * parseFloat(numTesterZArray[1])));
            zPoint = abundsArray[j+ 0].toString();
            continue; 
            //z = numTesterZ;
           
        }
        if( w > 0 && x > 0 && y > 0 && z > 0){
            //window.alert( w + " " + x + " " + y + " " + z + "j: " + j + "\n" + "numTester0: " + numTester0 + "\n" + "numTester1: " + numTester1 + "\n" + "firstX: " + firstX + "\n" + "firstY: " + firstY + "\n" + "secondX: " + secondX + "\n" + "secondY: " + secondY);
            j = 0; 
            interpolate(w, x, y, z); 
            //opacityFetch(wPoint, xPoint ,yPoint, zPoint); 
           if(((i-3) >= 9 && (i-3) <= 12) || ((i-3) >= 14 && (i-3) <= 17) || (i-3) == 19 || (i-3) == 25){
                opacityCalculate( (i-3), wPoint, xPoint ,yPoint, zPoint);
            }   
            
            w = 0; 
            x = 0; 
            y = 0; 
            z = 0; 
            break;  
        }

        else {
          continue; 
          //  window.alert("Nothing to see here"); 
        }
    }   


} //end of for loop
}// end of getElements 


var arrayToPlot = new Array();
var abundsTableArray = new Array();
//var abundsPercent = new Array();

var r1; 
var r2;

function interpolate(w, x, y, z){
   
   r1 = (((secondX - myPressure)/(secondX  - firstX )) * (w) + ((myPressure - firstX)/(secondX - firstX)) * (x)); 
        
   r2 =  (((secondX - myPressure)/(secondX -  firstX)) * (y) + ((myPressure - firstX)/(secondX - firstX)) * (z)); 
        
   var numElemPlot = (((secondY - myTemp)/(secondY - firstY)) * (r1) + ((myTemp - firstY)/(secondY - firstY)) * (r2)); 

   arrayToPlot.push(numElemPlot); 

   if(arrayToPlot[25])
   {
       for(var i = 0; i < 26; i++){
            abundsTableArray[i] = (arrayToPlot[i] * 100).toString();
            //abundsPercent[i] = (arrayToPlot[i] * 100);
       }
      // abundsChart.series[0].setData(abundsPercent); 
       makeTable(abundsTableArray);

   }
};

/*
function opacityFetch(aPoint, bPoint, cPoint, dPoint)
{
    window.alert(aPoint + " " + bPoint + " " + cPoint + " " + dPoint);
} 
*/
 var tableList = ['e-', 'H2', 'H', 'H+', 'H-', 'H2-', 'H2+', 'H3+', 'He', 'H2O', 'CH4', 'CO', 'NH3', 'N2', 'PH3', 'H2S', 'TiO', 'VO', 'Fe', 'FeH', 'CrH', 'Na', 'K', 'Rb', 'Cs', 'CO2'];

function makeTable(tablePlottingArray){

var splitArrayToPlot = new Array();

var x; 

for (var i = 0; i < 26; i++) {
        var newArrayToPlot = (tablePlottingArray[i]).split("e-");  

        if(newArrayToPlot[1])
        {   
            x = parseFloat(newArrayToPlot[0]) * (Math.pow(10, (-1) * parseFloat(newArrayToPlot[1])));

        }
        //If statement that goes through newArrayToPlot[1] and compares which is higher or lower and orders it
        else{
            x = parseFloat(newArrayToPlot[0]);

        }
        splitArrayToPlot[i] = x; 

       }

var doubleArray = new Array(26);

for (var i=0; i<26; i++) {
    doubleArray[i] = [tableList[i], splitArrayToPlot[i]];
}

doubleArray = doubleArray.sort(compareSecondColumn);


// sorts the second column of any two dimentional array when called 
function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}

var tableRef;
var newRow;
var newCell;
var new1Cell;
var newText;
var new1Text;

// an array for the ordered name of the molecules
var categoriesArray = new Array();

//an array for the ordered molecular abundances 
var orderedData = new Array();

for (var i=0; i<5; i++) {

    tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];

    newRow   = tableRef.insertRow(tableRef.rows.length);

    newCell  = newRow.insertCell(0);
    new1Cell  = newRow.insertCell(1);
    newText  = document.createTextNode(doubleArray[i][0]);
    new1Text  = document.createTextNode(doubleArray[i][1]);

    newCell.appendChild(newText);
    new1Cell.appendChild(new1Text);

}

//adds names into the first column of double array, and corresponding values into the second column.
for (var i = 2; i<26; i++) {
    if(doubleArray[i][1] > 0.000001){
        categoriesArray.push(doubleArray[i][0]);
        orderedData.push(doubleArray[i][1]);
    }
    else continue; 
}

//Changes the categories of the highChart to be molecule names in order of descending abundance
abundsChart.xAxis[0].update({categories:categoriesArray}, true);

//For each of these categories, set data to be the ordered abundances
abundsChart.series[0].setData(orderedData); 
abundsChart.setTitle({text: "Abundances of Various Molecules in Planetary Atmospheres at " + myPressure + " bar and " + myTemp + "K"});

var clicked = 0;


$('#five').click(function() {
     
    if (clicked ==1) {
        for(var i=5; i<10; i+0.5){
            document.getElementById('tbody').deleteRow(i);
            clicked=0;
        }
    }
    else if(clicked == 2) {
         for(var i=5; i<doubleArray.length; i+0.5) {
            document.getElementById('tbody').deleteRow(i);
            clicked = 0;
        }
    }
    else {
        clicked=0;
    }
});

$('#ten').click(function() {

    if (clicked == 0) {

          for (var i=5; i<10; i++) {
                tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];

                newRow   = tableRef.insertRow(tableRef.rows.length);

                newCell  = newRow.insertCell(0);
                new1Cell  = newRow.insertCell(1);
                newText  = document.createTextNode(doubleArray[i][0]);
                new1Text  = document.createTextNode(doubleArray[i][1]);

            newCell.appendChild(newText);
            new1Cell.appendChild(new1Text);

                clicked =1;
    }  
}

else if (clicked === 2) {
    for(var i=10; i<doubleArray.length; i+0.5) {
            document.getElementById('tbody').deleteRow(i);
            clicked = 1;
        }   
    }

else {
      clicked = 1;   
    }


});

$('#twentysix').click(function() {

   //if(document.getElementById('#five') === false) {
    if (clicked == 0) {
            for (var i=5; i<26; i++) {

                tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];

                newRow   = tableRef.insertRow(tableRef.rows.length);

                newCell  = newRow.insertCell(0);
                new1Cell  = newRow.insertCell(1);
                newText  = document.createTextNode(doubleArray[i][0]);
                new1Text  = document.createTextNode(doubleArray[i][1]);

            newCell.appendChild(newText);
            new1Cell.appendChild(new1Text);
            clicked =2;    

    }   
}

    else if (clicked == 1) {
        for (var i=10; i<26; i++) {

                tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];

                newRow   = tableRef.insertRow(tableRef.rows.length);

                newCell  = newRow.insertCell(0);
                new1Cell  = newRow.insertCell(1);
                newText  = document.createTextNode(doubleArray[i][0]);
                new1Text  = document.createTextNode(doubleArray[i][1]);

            newCell.appendChild(newText);
            new1Cell.appendChild(new1Text);
            clicked = 2; 
        }
    }

    else {
         clicked = 2;
    }
});


}// end of makeTable()
var abundsChart;

function graphAbunds(){
    
    abundsChart = new Highcharts.Chart({

            chart: {
            renderTo: 'abundsContainer',
            zoomType: 'x',
            type: 'column'
            },
            title: {
                text: 'Abundances for Various Elements in Planetary Atmospheres'
            },
            subtitle: {
                text: 'Top two molecules (vast majority of atmosphere) not displayed. Abundances greater than 0.000001% are shown'
            },
            xAxis: {
                categories: [
                    'e',
                    'H2',
                    'H',
                    'H+',
                    'H-',
                    'H2-',
                    'H2+',
                    'H3+',
                    'He',
                    'H2O',
                    'CH4',
                    'CO',
                    'NH3',
                    'N2',
                    'PH3',
                    'H2S',
                    'TiO',
                    'VO',
                    'Fe',
                    'FeH',
                    'CrH',
                    'Na',
                    'K',
                    'Rb',
                    'Cs',
                    'CO2'
                ]
            },
            yAxis: {
                title: {
                    text: 'Abundance in Percent of Atmosphere'
                },
                //type: 'logarithmic',
                min: 0,
                labels: {
                formatter:function() {
                    return (this.value).toString()
                }
                },
            },
            tooltip: {
                formatter:function() {
                    return ((this.y).toString() + " %"); 
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Molecules',

                data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            }]
        });
}


var chemicalList = ['e-', 'h2', 'h', 'h+', 'h-', 'Hh2-', 'h2+', 'h3+', 'he', 'h2o', 'ch4', 'co', 'nh3', 'n2', 'ph3', 'h2s', 'tio', 'vo', 'fe', 'feh', 'crh', 'na', 'k', 'rb', 'cs', 'co2'];

var plotXAxis = new Array(); 

var elemOpacityPlot = new Array(); 

function opacityCalculate(element, aPoint, bPoint, cPoint, dPoint){

if((element >= 9 && element <= 12) || (element >= 14 && element <= 17) || element == 19 || element == 25)
    {

        var alinkToGet = "http://www.ucolick.org/~cmorley/sipwebsite/opacities/"; 
        var blinkToGet = "http://www.ucolick.org/~cmorley/sipwebsite/opacities/";
        var clinkToGet = "http://www.ucolick.org/~cmorley/sipwebsite/opacities/";
        var dlinkToGet = "http://www.ucolick.org/~cmorley/sipwebsite/opacities/";

        var aPointArray = ["1.01"]; 
        var bPointArray = ["1.01"]; 
        var cPointArray = ["1.01"]; 
        var dPointArray = ["1.01"]; 

        alinkToGet += (chemicalList[element] + "/fort." + aPoint.substring(1)); 

        $.get(alinkToGet,function(data)
                {
                        aPointArray = data.toString().split(" "); 
                        
                        blinkToGet += (chemicalList[element] + "/fort." + bPoint.substring(1));

                    $.get(blinkToGet,function(data)
                     {
                        
                        bPointArray = data.toString().split(" "); 
                        
                        clinkToGet += (chemicalList[element] + "/fort." + cPoint.substring(1)); 
                         
                         $.get(clinkToGet,function(data)
                         {
                    
                           cPointArray = data.toString().split(" "); 

                           dlinkToGet += (chemicalList[element] + "/fort." + dPoint.substring(1));   

                            $.get(dlinkToGet,function(data)
                           {

                                dPointArray = data.toString().split(" "); 

                                if(aPointArray[0] != "1.01" && bPointArray[0] != "1.01" && cPointArray[0] != "1.01" && dPointArray[0] != "1.01")
                                {
                                    //window.alert("Prize!" + element);
                                    for(var i = 1; i < 7680; i+=2)
                                    {
                                      opacityInterpolator(element, aPointArray[i], bPointArray[i], cPointArray[i], dPointArray[i]);
                                     // if(element == 10 && (aPointArray[i-1] >= 2.2) ){
                                       //     window.alert(i + " " + aPoint + " " + aPointArray[i-1] + " " + aPointArray[i] + " " + bPoint + " " + bPointArray[i-1]  + " " + bPointArray[i]  + " " + cPoint + " "  +  cPointArray[i-1] + " " + cPointArray[i] + " " + dPoint + " " + dPointArray[i-1] + " " + dPointArray[i]);
                                        //}
                                      }
                                }   
                            
                                else{
                                   window.alert("here's the problem");
                                    }
                            });
                            });
                        });
                     }); 
               

    }
    
else{
    window.alert("No data for this molecule. Please press OK" + element); 
}

}

var h2oArray = new Array();
var ch4Array = new Array();
var coArray = new Array();
var nh3Array = new Array();
var ph3Array = new Array();
var h2sArray = new Array();
var tioArray = new Array();
var voArray = new Array();
var feHArray = new Array();
var co2Array = new Array();

var h2oArrayAbunds = new Array();
var ch4ArrayAbunds = new Array();
var coArrayAbunds = new Array();
var nh3ArrayAbunds = new Array();
var ph3ArrayAbunds = new Array();
var h2sArrayAbunds = new Array();
var tioArrayAbunds = new Array();
var voArrayAbunds = new Array();
var feHArrayAbunds = new Array();
var co2ArrayAbunds = new Array();

var x1; //used for interpolation
var x2; //used for interpolation

function opacityInterpolator(element, w, x, y, z){

    var wArray = (w).split("e-");  

        if(wArray[1])
        {   
            var wOpacity = parseFloat(wArray[0]) * (Math.pow(10, (-1) * parseFloat(wArray[1])));    
        }
        else{
            var wOpacity = parseFloat(wArray[0]); 
        }

    var xArray = (x).split("e-");  

        if(xArray[1])
        {   
            var xOpacity = parseFloat(xArray[0]) * (Math.pow(10, (-1) * parseFloat(xArray[1])));    
        }
        else{
            var xOpacity = parseFloat(xArray[0]); 
        }

    var yArray = (y).split("e-");  

        if(yArray[1])
        {   
            var yOpacity = parseFloat(yArray[0]) * (Math.pow(10, (-1) * parseFloat(yArray[1])));    
        }
        else{
            var yOpacity = parseFloat(yArray[0]); 
        }

    var zArray = (z).split("e-");  

        if(zArray[1])
        {   
            var zOpacity = parseFloat(zArray[0]) * (Math.pow(10, (-1) * parseFloat(zArray[1])));    
        }
        else{
            var zOpacity = parseFloat(zArray[0]); 
        }
   
   x1 = (((secondX - myPressure)/(secondX  - firstX )) * (wOpacity) + ((myPressure - firstX)/(secondX - firstX)) * (xOpacity)); 
        
   x2 =  (((secondX - myPressure)/(secondX -  firstX)) * (yOpacity) + ((myPressure - firstX)/(secondX - firstX)) * (zOpacity)); 
        
   var numElemOpac = (((secondY - myTemp)/(secondY - firstY)) * (x1) + ((myTemp - firstY)/(secondY - firstY)) * (x2)); 

    switch(element){
        case 9: 
            h2oArray.push(numElemOpac);
            if(h2oArray[3839])
            {
                for(var i = 0; i <= 3839; i++){
                    h2oArrayAbunds[i] = (h2oArray[i] * arrayToPlot[element]); 
                }
                chart.series[0].setData(h2oArrayAbunds);
            } 
            break;
        case 10: 
            ch4Array.push(numElemOpac);
            if(ch4Array[3839])
            {
                for(var i = 0; i <= 3839; i++){
                   ch4ArrayAbunds[i] = (ch4Array[i] * arrayToPlot[element]); 
                }
                chart.series[1].setData(ch4ArrayAbunds);

            } 
            break;
        case 11: 
            coArray.push(numElemOpac);
            if(coArray[3839])
            {
                for(var i = 0; i <= 3839; i++){
                    coArrayAbunds[i] = (coArray[i] * arrayToPlot[element]); 
                }
                chart.series[2].setData(coArrayAbunds);
            } 
            break;
        case 12: 
            nh3Array.push(numElemOpac);
            if(nh3Array[3839])
            {
                for(var i = 0; i <= 3839; i++){
                    nh3ArrayAbunds[i] = (nh3Array[i] * arrayToPlot[element]); 
                }
                chart.series[3].setData(nh3ArrayAbunds);
            } 
            break;
        case 14: 
            ph3Array.push(numElemOpac);
            if(ph3Array[3839])
            {
                for(var i = 0; i <= 3839; i++){
                    ph3ArrayAbunds[i] = (ph3Array[i] * arrayToPlot[element]); 
                }
                chart.series[4].setData(ph3ArrayAbunds);
            } 
            break;
        case 15:
            h2sArray.push(numElemOpac);
            if(h2sArray[3839])
            {
                for(var i = 0; i <= 3839; i++){
                    h2sArrayAbunds[i] = (h2sArray[i] * arrayToPlot[element]); 
                }
                chart.series[5].setData(h2sArrayAbunds);
            } 
            break;
        case 16: 
            tioArray.push(numElemOpac);
            if(tioArray[3839])
            {
                for(var i = 0; i <= 3839; i++){
                    tioArrayAbunds[i] = (tioArray[i] * arrayToPlot[element]); 
                }
                chart.series[6].setData(tioArrayAbunds);
            } 
            break;
        case 17: 
            voArray.push(numElemOpac);
            if(voArray[3839])
            {
                for(var i = 0; i <= 3839; i++){
                    voArrayAbunds[i] = (voArray[i] * arrayToPlot[element]); 
                }
                chart.series[7].setData(voArrayAbunds);
            } 
            break;
        case 19: 
            feHArray.push(numElemOpac);
            if(feHArray[3839])
            {
                for(var i = 0; i <= 3839; i++){
                    feHArrayAbunds[i] = (feHArray[i] * arrayToPlot[element]); 
                }
                chart.series[8].setData(feHArrayAbunds);
            } 
            break;
        case 25: 
            co2Array.push(numElemOpac);
            if(co2Array[3839])
            {
                for(var i = 0; i <= 3839; i++){
                    co2ArrayAbunds[i] = (co2Array[i] * arrayToPlot[element]); 
                }
                chart.series[9].setData(co2ArrayAbunds);
            } 
            break;
        default:
            window.alert("switch statement broken! " + element);
            break;
        }

};

var chart; 
     
function makeChart(){

chart = new Highcharts.Chart({

        chart: {
        renderTo: 'container',
        zoomType: 'x'
        },
        title: {
            text: 'Opacity of Molecules at ' + myPressure + ' bar and ' + myTemp + 'K',
            x: -20 //center
        },
        subtitle: {
            text: 'Wavelength (microns) \n - Click and drag in the plot area to zoom in',
            x: -20
        },
        xAxis: {
            min:  0.8,
            max: 19.995,
            labels: {
                formatter:function() {
                    return (this.value)+0.8
                    //return "10e-" + numE;
                }
            },
        },
        yAxis: {
            type: 'logarithmic',
            title: {
                text: 'Opacity  - Cross section/volume (cm^2/cm^3)'
            },
            labels: {
                formatter:function() {
                    return (this.value).toString()
                    //return "10e-" + numE;
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter:function() {
              return (((this.x)+0.8) + "," + (this.y).toString());  
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 1
        },
        plotOptions: {
                line: {
                    marker: {
                        enabled: false
                    }
                }
        },
        series: [{
            name: 'h2o',
            pointInterval: 0.005,
            data: [1,2,3,4]
        }, {
            name: 'ch4',
            pointInterval: 0.005,
            data: [1,2,3,4]
        }, {
            name: 'co',
            pointInterval: 0.005,
            data: [1,2,3,4]
        }, {
            name: 'nh3',
            pointInterval: 0.005,
            data: [1,2,3,4]
        }, {
            name: 'ph3',
            pointInterval: 0.005,
            data: [1,2,3,4]
        }, {
            name: 'h2s',
            pointInterval: 0.005,
            data: [1,2,3,4]
        }, {
            name: 'tio',
            pointInterval: 0.005,
            data: [1,2,3,4]
        }, {
            name: 'vo',
            pointInterval: 0.005,
            data: [1,2,3,4]
        }, {
            name: 'feH',
            pointInterval: 0.005,
            data: [1,2,3,4]
        }, {
            name: 'co2',
            pointInterval: 0.005,
            data: [1,2,3,4]
        }]
      });// end of highChart
} // end of function

        
     