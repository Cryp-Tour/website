document.addEventListener('DOMContentLoaded', async function () {
    await getCreatedTours().then(
        async (result) => {
            console.log(result)
            
            
            for(i=0; i<result.length; i++) {
                
                AddTourToList(result[i])
                
                //await getTourImage().then((result)=> console.log(result))
            }
            CreateNewTour()

        }
    )

    document.getElementById("cancel-delete").addEventListener("click", function(){
        document.getElementById("modal-background").style.display = "none";
        document.getElementById("delete-error-message").style.display = "none";
        document.body.classList.remove('disable-scroll');
    });

    document.getElementById("delete-submit-button").addEventListener("click", deleteTour);
    
}, false);

function buildImgUrl(tourID, imageID) {
    return `https://backend.cryptour.dullmer.de/tours/${tourID}/image/${imageID}`;
}

async function getCreatedTours () {
    let endpoint = 'https://backend.cryptour.dullmer.de/user/createdTours'
    const response =  await fetch(endpoint, {method:'GET',
        headers: {'Content-Type':'application/json'},
        credentials: 'include'
        //credentials: 'user:passwd'
       })
    return response.json()
}


function CreateNewTour() {
    var grid = document.getElementById("SearchGrid");
    console.log(grid);

    grid.appendChild(CreateTourArticlePreviw());
    
    return;
}
function CreateTourArticlePreviw() {
    var container = document.createElement('div');
    var div = document.createElement('div');
    var button = document.createElement('button');
    container.classList.add("tour-container")
    div.classList.add("create-card")
    button.classList.add("create-button")
    button.innerHTML = "+"
    //button.onclick = function() {document.getElementById('contactForm').style.display='block'}
    button.onclick = function() {location.href='createTour.html'}
    div.appendChild(button)
    container.appendChild(div)

    return container
}


function AddTourToList(tour) 
{
    var grid = document.getElementById("SearchGrid");
    console.log(grid);

    if (tour.tourImages.length > 0) {
        image = buildImgUrl(tour.tID, tour.tourImages[0].tiID)
    }
    else {
        image = "/images/Berg.jpg";
    }

    grid.appendChild(CreateTourArticle(image, tour.title, tour.difficulty, tour.distance, tour.duration, tour.location, tour.tID));
    
    return;
}

function CreateTourArticle(image, name, difficulty, distance, duration, location, tid) {

    var container = document.createElement('div');
    var div_card = document.createElement('div');
    var div_card_header = document.createElement('div');
    var img = document.createElement('img');
    var div_card_body = document.createElement('div');
    var h3 = document.createElement('h3');
    var h4 = document.createElement('h4');
    var p = document.createElement('p');
    var button = document.createElement('button');
    var deleteButton = document.createElement('div');

   
    img.src = image;
    container.classList.add("tour-container")
    div_card.classList.add("tour-card")
    div_card_header.classList.add("tour-card-header")
    div_card_body.classList.add("tour-card-body")
    deleteButton.classList.add("delete-button")
    deleteButton.innerText = "x"
    button.classList.add("detail-button")

    button.addEventListener("click", function(){
        window.location.href = "/tour.html?tourID="+tid;
    });

    deleteButton.addEventListener("click", function(){
        document.getElementById("modal-background").style.display = "flex";
        document.getElementById("delete-submit-button").dataset.tourID = tid;
        document.getElementById("delete-error-message").style.display = "none";
        document.body.classList.add('disable-scroll');
    })

    p.innerHTML = "Dauer: " + duration + " Minuten<br>Länge: " + distance + " km<br>Schwierigkeit: " + difficulty;
    h4.innerHTML = name
    h3.innerHTML = location
    button.innerHTML = "Details"
    //a.href = "javascript:goToTour(" + Tour + ");";
    container.dataset.tourID = tid;
    div_card_body.appendChild(h3)
    div_card_body.appendChild(h4)
    div_card_body.appendChild(p)
    div_card_body.appendChild(button)

    div_card_header.append(img)
    div_card.appendChild(div_card_header)
    div_card.appendChild(div_card_body)
    div_card.appendChild(deleteButton)
    container.appendChild(div_card)

    return container;    
}

async function deleteTour(){
    tour_id = this.dataset.tourID;

    let endpoint = 'https://backend.cryptour.dullmer.de/tours/'+tour_id;

    const response =  await fetch(endpoint, {method:'delete',
		credentials: 'include'
   	});

    if(response.status == 204){
        let tours = document.getElementsByClassName("tour-container");
        for (let i = 0; i < tours.length; i++){
            if(tours[i].dataset.tourID == tour_id){
                tours[i].remove();
                break;
            }
        }
        document.getElementById("cancel-delete").click();
    } else {
        document.getElementById("delete-error-message").style.display = "block";
    }
}

function click() {
    console.log("click");
    return;
}

function goToTour(Tour) {
    console.log("go to: " + Tour);
    return;
}

