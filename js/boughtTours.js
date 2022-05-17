


document.addEventListener('DOMContentLoaded', async function () {
    await getBoughtTours().then(
        async (result) => {
            console.log(result)
            
            
            for(i=0; i<result.length; i++) {
                image = "/images/Berg.jpg";
                AddBoughtTourToList(image, result[i])
                //await getTourImage().then((result)=> console.log(result))
            }
            if (result.length==0) {
                AddPlaceholder()
            }
        }
    )
}, false);

function AddPlaceholder() {
    var grid = document.getElementById("SearchGridBought");
    var image = document.createElement("img")
    image.src = "../images/placeholder.png";
    image.classList.add("placeholder-image")
    
    var container = document.createElement("div")
    
    container.appendChild(image)
    grid.appendChild(container)

}

async function getBoughtTours () {
    let endpoint = 'https://backend.cryptour.dullmer.de/user/boughtTours'
    const response =  await fetch(endpoint, {method:'GET',
        headers: {'Content-Type':'application/json'},
        credentials: 'include'
        //credentials: 'user:passwd'
       })
    return response.json()
}

// TODO
async function getBoughtTourImage () {
    let endpoint = 'https://backend.cryptour.dullmer.de/tours/1/image/1'
    username = 'user1'
    password = 'user1'
    
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
    const response =  await fetch(endpoint, {method:'GET',
        headers: headers,
        //credentials: 'user:passwd'
       })
    return response.json()
}


function AddBoughtTourToList(image, tour) 
{
    var grid = document.getElementById("SearchGridBought");
    
    console.log(grid);

    grid.appendChild(CreateBoughtTourArticle(image, tour.title, tour.difficulty, tour.distance, tour.duration, tour.location, tour.tid));
    
    return;
}

function CreateBoughtTourArticle(image, name, difficulty, distance, duration, location, Tour) {

    var container = document.createElement('div');
    var div_card = document.createElement('div');
    var div_card_header = document.createElement('div');
    var img = document.createElement('img');
    var div_card_body = document.createElement('div');
    var h3 = document.createElement('h3');
    var h4 = document.createElement('h4');
    var p = document.createElement('p');
    var button = document.createElement('button');

   
    
    
    img.src = image;
    container.classList.add("tour-container")
    div_card.classList.add("tour-card")
    div_card_header.classList.add("tour-card-header")
    div_card_body.classList.add("tour-card-body")
    button.classList.add("detail-button")

    p.innerHTML = "Dauer: " + duration + " Minuten<br>Länge: " + distance + " km<br>Schwierigkeit: " + difficulty;
    h4.innerHTML = name
    h3.innerHTML = location
    button.innerHTML = "Details"
    //a.href = "javascript:goToTour(" + Tour + ");";
    div_card_body.appendChild(h3)
    div_card_body.appendChild(h4)
    div_card_body.appendChild(p)
    div_card_body.appendChild(button)

    div_card_header.append(img)
    div_card.appendChild(div_card_header)
    div_card.appendChild(div_card_body)
    container.appendChild(div_card)

    return container;    
}


function click() {
    console.log("click");
    return;
}

function goToTour(Tour) {
    console.log("go to: " + Tour);
    return;
}

