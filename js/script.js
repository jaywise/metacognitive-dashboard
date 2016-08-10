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

    // TODO -- aligning checkbox with respective progress bar doesn't work with below getBoundingClinetRect function. is some CSS overriding it? simpler way through inline html elements? eliminate containers?
    //var rect = event.srcElement.getBoundingClientRect();
    // console.log(rect.top, rect.right, rect.bottom, rect.left);
    console.log(event);

    if (event.target.checked == true) {
        numOfSliders++;
        adjustExistingSliderValuesDown();

        sliderObj.value = (100 / numOfSliders);
        sliderObj.color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'; //generates random color
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

        //sends values and color styling to inputs and value bars
        document.querySelector("#value-bar-" + allSliders[i].id).innerHTML = sliderValueToDisplay;
        document.querySelector("#value-bar-" + allSliders[i].id).style.width = sliderValueToDisplay * 2 + 'px'; //multiply value by two to create longer, but proportionate progress bar
        document.querySelector("#value-bar-" + allSliders[i].id).style.backgroundColor = allSliders[i].color; 
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
    document.querySelector("#pieChart").innerHTML = "";
    var data = [];
    /*TODO -- create tailor-made array here that plug directly into JSON */

    //identifies id in arry and assigns color for graph
    for (var i = 0; i < allSliders.length; i++) {
        data.push({label: allSliders[i].id, value: allSliders[i].value, color: allSliders[i].color});
    };
    console.log("data array is " + data); 

    var pie = new d3pie("pieChart", {
        "header": {
            "title": {
                "fontSize": 24,
                "font": "open sans"
            },
            "subtitle": {
                "color": "#999999",
                "fontSize": 12,
                "font": "open sans"
            },
            "titleSubtitlePadding": 9
        },
        "footer": {
            "color": "#999999",
            "fontSize": 10,
            "font": "open sans",
            "location": "bottom-left"
        },
        "size": {
            "canvasWidth": 450,
            "pieInnerRadius": "44%",
            "pieOuterRadius": "95%"
        },
        "data": {
            "sortOrder": "value-desc",
            "content": data
        },
        "labels": {
            "outer": {
                "format": null
            },
            "inner": {
                "format": "label-percentage2",
                "hideWhenLessThanPercentage": null

            },
            "mainLabel": {
                "fontSize": 14,
                "color": "#d3d3d3"
            },
            "percentage": {
                "color": "#d3d3d3",
                "decimalPlaces": 0,
                "fontSize": 14
            },
            "value": {
                "color": "#adadad",
                "fontSize": 11
            },
            "lines": {
                "enabled": false, 
                "style": "straight"
            },
            "truncation": {
                "enabled": true
            }
        },
        "tooltips": {
            "enabled": true,
            "type": "placeholder",
            "string": "Click to learn more",
            "styles": {
                "fadeInSpeed": 260,
                "font": "verdana"
            }
        },
        "effects": {
            "pullOutSegmentOnClick": {
                "effect": "elastic",
                "speed": 400,
                "size": 25
            },
            "highlightLuminosity": 0
        },
        "misc": {
            "gradient": {
                "enabled": true,
                "percentage": 100
            }
        }
    });
});

//listens for click on pie chart piece that triggers pop-up modal
document.querySelector("#pieChart").addEventListener('click', function(event) {
    var myID = event.srcElement.__data__.label;
    $("#" + myID +"Modal").modal();
});


