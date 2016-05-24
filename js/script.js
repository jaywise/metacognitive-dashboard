var showHideSlider = function(event) {
    var sliderId = event.target.id + '-slider';
    var slider = document.querySelector('#' + sliderId);
    if (event.target.checked) {
        slider.classList.remove('disappear');
    } else {
        slider.classList.add('disappear');
    }
};

var linguisticCheck = document.querySelector('#linguistic');
linguisticCheck.addEventListener('change', showHideSlider);

var logicalMathematicalCheck = document.querySelector('#logical');
logicalMathematicalCheck.addEventListener('change', showHideSlider);

var musicalCheck = document.querySelector('#musical');
musicalCheck.addEventListener('change', showHideSlider);

var interpersonalCheck = document.querySelector('#interpersonal');
interpersonalCheck.addEventListener('change', showHideSlider);

var intrapersonalCheck = document.querySelector('#intrapersonal');
intrapersonalCheck.addEventListener('change', showHideSlider);

var spatialVisualCheck = document.querySelector('#spatial');
spatialVisualCheck.addEventListener('change', showHideSlider);

var naturalistCheck = document.querySelector('#naturalist');
naturalistCheck.addEventListener('change', showHideSlider);

var bodilyKinestheticCheck = document.querySelector('#bodily');
bodilyKinestheticCheck.addEventListener('change', showHideSlider);


var numOfSliders = 0;
var allSliders = [];

// upon add/remove of slider, calculates and implements new value of all sliders
document.querySelector('#modalityList').addEventListener('change', function(event) {

    var sliderObj = {};
    sliderObj.id = event.target.id;

    if (event.target.checked == true) {
        numOfSliders++;
        adjustExistingSliderValuesDown();

        sliderObj.value = (100 / numOfSliders);
        allSliders.push(sliderObj);

        console.log("array values when checked: " + JSON.stringify(allSliders));
    } else {
        redistributeValue(sliderObj);
        removeSliderFromArray(sliderObj);

        console.log("array values when unchecked: " + JSON.stringify(allSliders));
    }

    displayAllSliderValues();
});

var removeSliderFromArray = function(sliderName) {
    for (var i = 0; i < allSliders.length; i++) {
        if (allSliders[i].id == sliderName.id) {
            allSliders.splice(i, 1);
        }
    }
    numOfSliders--;
};

var redistributeValue = function(myObject) {
    var removedValue = document.querySelector("#" + myObject.id + "-input").value; //TODO -- find value of toggled slider
    for (var i = 0; i < allSliders.length; i++) {
        if (allSliders[i].id !== myObject.id) {
            allSliders[i].value += removedValue / (numOfSliders - 1);
        }
    }
};

var adjustExistingSliderValuesDown = function() {
    if (numOfSliders != 1) {
        for (var i = 0; i < allSliders.length; i++) {
            allSliders[i].value -= (allSliders[i].value / numOfSliders);
        }
    }
};

//at end of event-driven calculations, sends values to respective input and progress bar divs
var displayAllSliderValues = function() {
    var sum = 0;
    for (var i = allSliders.length - 1; i >= 0; i--) { //doesn't cycle through last value in array for rounding hack below, i.e., attribute it the remainder of 100 total 

        var sliderValueToDisplay = allSliders[i].value;

        //rounds to 100 total by giving remainder of 100 total to first value in array 
        if (i == 0) {
            sliderValueToDisplay = 100 - sum;
        };

        if (sliderValueToDisplay < 0) { //sets min value sent to divs/inputs
            sliderValueToDisplay = 0;
        };
        if (sliderValueToDisplay > 100) { //sets max value sent to divs/inputs
            sliderValueToDisplay = 100;
        };
        sliderValueToDisplay = Math.round(sliderValueToDisplay);

        //sends values to inputs and value bars
        document.querySelector("#value-bar-" + allSliders[i].id).innerHTML = sliderValueToDisplay;
        document.querySelector("#value-bar-" + allSliders[i].id).style.width = sliderValueToDisplay * 2 + 'px'; //multiply value by two to create longer, but proportionate progress bar
        document.querySelector("#" + allSliders[i].id + "-input").value = sliderValueToDisplay;
        sum += sliderValueToDisplay;
    }
};

//listens for and changes values when slider is toggled
document.querySelector('#slider-window').addEventListener('input', function(event) {

    console.log(event);
    console.log(JSON.stringify(allSliders));

    //builds temporary object with new clicked input info, to be later mapped on global array of input values
    var clickedSlider = {};
    clickedSlider.id = event.target.id.replace('-input', ''); //modified to match id of object stored in allSliders[]
    clickedSlider.value = parseFloat(document.querySelector("#" + clickedSlider.id + "-input").value);

    console.log("clickedSlider is " + clickedSlider.id + clickedSlider.value);

    //grabs object from array that matches id of clicked input, then assigns value to variable to be compared later with new values
    var oldValue = 0;
    for (var i = 0; i < allSliders.length; i++) {
        if (allSliders[i].id == clickedSlider.id.replace('-input', '')) {
            oldValue = allSliders[i].value;
        }
    };

    console.log("oldvalue is " + oldValue);

    //adjust values of sliders not manipulated by mouse
    if (clickedSlider.value > oldValue) {
        var sumOfNonClickedSliders = 0;
        for (var i = 0; i < allSliders.length; i++) {
            if (allSliders[i].id !== clickedSlider.id) {
                allSliders[i].value = parseFloat(allSliders[i].value) - parseFloat(1 / (numOfSliders - 1));
                if (allSliders[i].value < 0) {
                    allSliders[i].value = 0;
                }
                sumOfNonClickedSliders += allSliders[i].value;
            }
            clickedSlider.value = parseFloat(100 - sumOfNonClickedSliders);
        };

    };
    if (clickedSlider.value < oldValue) {
        var sumOfNonClickedSliders = 0;
        for (var i = 0; i < allSliders.length; i++) {
            if (allSliders[i].id !== clickedSlider.id) {
                allSliders[i].value = parseFloat(allSliders[i].value) + parseFloat(1 / (numOfSliders - 1));
                sumOfNonClickedSliders += allSliders[i].value;
            } //TODO -- first value in array never receives 1 / (numOfSliders - 1). why?
            clickedSlider.value = parseFloat(100 - sumOfNonClickedSliders);
        };
        console.log("first array value is " + allSliders[0].value);
    };

    //replaces stored global object value with new input value
    for (var i = 0; i < allSliders.length; i++) {
        if (allSliders[i].id == clickedSlider.id) {
            allSliders[i].value = clickedSlider.value;
        }
    };

    displayAllSliderValues();


});


// Generates and populates graph div
document.querySelector('#submit-button').addEventListener('click', function(event) {
    var data = [];
    /*TODO -- create tailor-made array here that plug directly into JSON
    for (var i = 0; i < allSliders.length; i++) {
                data.push(allSliders[i].id + ", " + allSliders[i].value);
                }
        console.log(data);
    */
    $('#learner-modality-graph').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        title: {
            text: '',
            align: 'center',
            verticalAlign: 'middle',
            y: 40
        },

        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            }
        },
        series: [{
            type: 'pie',
            name: 'Proportion',
            innerSize: '50%',
            data: [
                /*TODO -- fix console message: Uncaught SyntaxError: Unexpected token for
                for (var i = 0; i < allSliders.length; i++) {
                    "[" + allSliders[i].id + ", " + allSliders[i].value + "],"
                }
                */
                /*TODO -- only works with 3 items in array. breaks with 2 or 4 items*/
                [allSliders[0].id, allSliders[0].value],
                [allSliders[1].id, allSliders[1].value],
                [allSliders[2].id, allSliders[2].value], {
                    name: 'Proprietary or Undetectable',
                    y: 0.2,
                    dataLabels: {
                        enabled: false
                    }
                }
            ]
        }]
    });
});
