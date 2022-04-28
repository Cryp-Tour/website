function SearchTours()
{
    console.log("searching tours");
    AddTourToList("/images/Berg.jpg", "Mount Everest", "Radweg", "100km", "schwer", 1);
    AddTourToList("/images/Berg.jpg", "Alpen", "Ski", "200km", "mittel", 2);
    AddTourToList("/images/Berg.jpg", "Bodensee", "Wasserski", "100m", "schwer", 3);
    return;
}

function AddTourToList(image, name, type, length, difficulty, Tour) 
{
    var grid = document.getElementById("SearchGrid");
    console.log(grid);

    grid.appendChild(CreateTourArticle(image, name, type, length, difficulty, Tour));
    
    return;
}

function CreateTourArticle(image, name, type, length, difficulty, Tour) {


    var p = document.createElement('p');
    var a = document.createElement('a');
    var img = document.createElement('img');
    var div = document.createElement('div');
    var article = document.createElement('article');
    
    img.src = image;
    img.classList.add("SearchElementImage")

    p.innerHTML = "Bezeichnung: " + name + "<br>Strecke: " + type + "<br>Länge: " + length + "<br>Schwierigkeit: " + difficulty;
    
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