
const hostname = "https://backend.cryptour.dullmer.de/"

document.addEventListener('DOMContentLoaded', async function () {
    await getCreatedTours().then(
        async (result) => {
            console.log(result)
            
            
            for(i=0; i<result.length; i++) {
                image = "/images/Berg.jpg";
                AddTourToList(image, result[i])
                
                //await getTourImage().then((result)=> console.log(result))
            }
            CreateNewTour()

        }
    )
    
}, false);

async function getCreatedTours () {
    let endpoint = 'https://backend.cryptour.dullmer.de/user/createdTours'
    //username = 'user1'
    //password = 'user1'
    
    //let headers = new Headers();
    //headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
    const response =  await fetch(endpoint, {method:'GET',
        headers: {'Content-Type':'application/json'},
        credentials: 'include'
        //credentials: 'user:passwd'
       })
    return response.json()
}

async function getTourImage () {
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
    // $.ajax({
    //     url: endpoint,
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
    //     },
    //     contentType: "application/json",
    //     dataType: 'json',
    //     success: function(result){
    //         console.log(result);
    //         //tours = result
    //         response =  result

    //     }
        
    // })
}

function getUserInput() {
    console.log("function")
    var difficulty = document.getElementsByName("form-title")[0].value;
    console.log(difficulty)
    document.getElementById('contactForm').style.display='none'
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


function AddTourToList(image, tour) 
{
    var grid = document.getElementById("SearchGrid");
    console.log(grid);

    grid.appendChild(CreateTourArticle(image, tour.title, tour.difficulty, tour.distance, tour.duration, tour.location, tour.tid));
    
    return;
}

function CreateTourArticle(image, name, difficulty, distance, duration, location, Tour) {

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

function closeForm() {
    document.getElementById("contactForm").style.display = "none";
  }
  function openForm() {
    document.getElementById("contactForm").style.display = "block";
  }

function CreateTourArticleOld(image, name, difficulty, distance, duration, location, Tour) {


    var p = document.createElement('p');
    var a = document.createElement('a');
    var img = document.createElement('img');
    var div = document.createElement('div');
    var article = document.createElement('article');
    
    img.src = image;
    img.classList.add("SearchElementImage")

    p.innerHTML = "Bezeichnung: " + name + "<br>Strecke: " + duration + "<br>Länge: " + distance + "<br>Schwierigkeit: " + difficulty;
    
    a.href = "javascript:goToTour(" + Tour + ");";

    div.appendChild(p);
    a.appendChild(img);
    a.appendChild(div);
    article.appendChild(a);
    article.classList.add("SearchElement");

    return article;    
}

function click() {
    console.log("click");
    return;
}

function goToTour(Tour) {
    console.log("go to: " + Tour);
    return;
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }

$(function() {
  
    // contact form animations
    $('#contact').on("click", function() {
      $('#contactForm').fadeToggle();
    })
    $(document).mouseup(function (e) {
      var container = $("#contactForm");
  
      if (!container.is(e.target) // if the target of the click isn't the container...
          && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
          container.fadeOut();
      }
    });
    
  });