window.onload = function(){
    //define Eventlistener
    document.getElementById("search_filter_button").addEventListener("click", toggleFilter);
    document.getElementById("filter-reset").addEventListener("click", resetFilter);
    
    document.getElementById("minDist").addEventListener("keyup", function(e){
        checkNumberFilter(this, e);
    });
    document.getElementById("minDist").addEventListener("change", function(e){
        lessThanRange(this, document.getElementById("maxDist"));
    });
    document.getElementById("maxDist").addEventListener("keyup", function(e){
        checkNumberFilter(this, e);
    });
    document.getElementById("maxDist").addEventListener("change", function(e){
        moreThanRange(this, document.getElementById("minDist"));
    });
    document.getElementById("minDur").addEventListener("keyup", function(e){
        checkNumberFilter(this, e);
    });
    document.getElementById("maxDur").addEventListener("keyup", function(e){
        checkNumberFilter(this, e);
    });
    document.getElementById("minDur").addEventListener("change", function(e){
        lessThanRange(this, document.getElementById("maxDur"));
    });
    document.getElementById("maxDur").addEventListener("change", function(e){
        moreThanRange(this, document.getElementById("minDur"));
    });

    document.getElementById("search_submit_button").addEventListener("click", function(){
        let popup = document.getElementById("popup-filter-elements");
        if (popup.style.display == "flex"){
            popup.style.display = "none";
        }
        subSetTour();
    });

    document.getElementById("difficulty-min").addEventListener("change", function(){
        let other = document.getElementById("difficulty-max");
        if (this.selectedIndex > other.selectedIndex){
            other.selectedIndex = 0;
        }
    });

    document.getElementById("difficulty-max").addEventListener("change", function(){
        let other = document.getElementById("difficulty-min");
        if (this.selectedIndex < other.selectedIndex){
            other.selectedIndex = 0;
        }
    });

    //load all tours
    subSetTour();
};

// Function toggle the popup that displays search filters
function toggleFilter(){
    let popup = document.getElementById("popup-filter-elements");
    if (popup.style.display == "none"){
        popup.style.display = "flex";
    } else {
        popup.style.display = "none";
    }
}

// Function to reset all set search filters
function resetFilter(){
    document.getElementById("difficulty").selectedIndex = 0;
    document.getElementById("minDist").value = "";
    document.getElementById("maxDist").value = "";
    document.getElementById("minDur").value = "";
    document.getElementById("maxDur").value = "";
    document.getElementById("location").value = "";
}

// Regex to only allow numberss
function checkNumberFilter(element, e){
    let re = /^(0|[1-9][0-9]*)$/;
    if (re.test(element.value) == false) {
        console.log(e.target.selectionStart);
        element.value = element.value.slice(0, e.target.selectionStart-1) + element.value.slice(e.target.selectionStart);
    }
}

// Only allow values below upper value
function lessThanRange(element, upper){
    if(upper.value != ""){
        if(parseInt(element.value) > parseInt(upper.value)){
            upper.value = "";
        }
    }
}

// Only allow values abovew lower value
function moreThanRange(element, lower){
    if(lower.value != ""){
        if(parseInt(element.value) < parseInt(lower.value)){
            lower.value = "";
        }
    }
}

// Process filters and get subset of tours
function subSetTour(){
    clearTours();
    let elements = {"difficulty-min" : "minDifficulty", "difficulty-max" : "maxDifficulty", "minDist" : "minDistance", "maxDist" : "maxDistance", "minDur" : "minDuration", "maxDur" : "maxDuration", "location" : "location", "search_input" : "searchQuery"};
    let params = {};
    for(var key in elements){
        let element = document.getElementById(key);
        if(key == "difficulty-min" || key == "difficulty-max"){
            if(element.selectedIndex != 0){
                params[elements[key]] = element.selectedIndex;
            }
        } else {
            if(element.value.trim() != ""){
                params[elements[key]] = element.value.trim();
            }
        }
    }
    fetch(window.BASEURL+"/tours?" + new URLSearchParams(params), {
        method: 'GET',
    }).then(response => {
        response.text().then(function (text) {
            let tours = JSON.parse(text);
            for(let i = 0; i < tours.length; i++){
                AddTourToList(tours[i]);
            }
        });
    });
}

function buildImgUrl(tourID, imageID) {
    return `${window.BASEURL}/tours/${tourID}/image/${imageID}`;
}

// Function to add tour to a list
function AddTourToList(tour) 
{
    var grid = document.getElementById("SearchGrid");

    if (tour.tourImages.length > 0) {
        image = buildImgUrl(tour.tID, tour.tourImages[0].tiID)
    }
    else {
        image = "/images/Berg.jpg";
    }

    let difficulty = "";
    switch(tour.difficulty){
        case(1):
            difficulty = "leicht";
            break;
        case(2):
            difficulty = "mittel";
            break;
        case(3):
            difficulty = "schwer";
            break;
        default:
            difficulty = "unbekannt";
    }

    grid.appendChild(CreateTourArticle(image, tour.title, difficulty, tour.distance, tour.duration, tour.location, tour.tID));
    
    return;
}

function clearTours(){
    var grid = document.getElementById("SearchGrid");
    grid.innerHTML = '';
}

// set html elements for a tour
function CreateTourArticle(image, name, difficulty, distance, duration, location, tid) {
    var container = document.createElement('div');
    var div_card = document.createElement('div');
    var div_card_header = document.createElement('div');
    var img = document.createElement('img');
    var div_card_body = document.createElement('div');
    var h3 = document.createElement('h3');
    var h4 = document.createElement('h4');
    var p = document.createElement('p');
    var button = document.createElement('button')
   
    img.src = image;
    container.classList.add("tour-container");
    div_card.classList.add("tour-card");
    div_card_header.classList.add("tour-card-header");
    div_card_body.classList.add("tour-card-body");
    button.classList.add("detail-button");

    button.addEventListener("click", function(){
        window.location.href = "/tour.html?tourID="+tid;
    });

    p.innerHTML = "Dauer: " + duration + " Minuten<br>L??nge: " + distance + " km<br>Schwierigkeit: " + difficulty;
    h4.innerHTML = name;
    h3.innerHTML = location;
    button.innerHTML = "Details";
    //a.href = "javascript:goToTour(" + Tour + ");";
    div_card_body.appendChild(h3);
    div_card_body.appendChild(h4);
    div_card_body.appendChild(p);
    div_card_body.appendChild(button);

    div_card_header.append(img);
    div_card.appendChild(div_card_header);
    div_card.appendChild(div_card_body);
    container.appendChild(div_card);

    return container;    
}
