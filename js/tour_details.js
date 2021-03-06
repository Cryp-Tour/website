// overwrite contract paths of library
CrypTourWeb.contractJSONPaths = [
"../contracts/BPool.json",
"../contracts/BFactory.json",
"../contracts/BToken.json",
"../contracts/TourTokenFactory.json",
"../contracts/TourTokenTemplate.json",
"../contracts/TToken.json",
"../contracts/IERC20.json"]

// get tour id from query parameter
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});


// Tour dynamisch laden je nach query parameter
const tourID = params.tourID;
console.log("Tour ID von Query Parameter: ", tourID);

// always use OCEAN Token as swap token
const ocean_rinkeby = "0x8967BCF84170c91B0d24D4302C2376283b0B3a07";
CrypTourWeb.erc20TokenIn = ocean_rinkeby;

var tour = null;
var priceWei = 0;
var maxPrice = 0;
var maxAmountIn = 0;
var cryptoWorking = false;


async function init_crypto() {
    try{
        await CrypTourWeb.init();
        console.log("Inited Web Lib")
        await CrypTourWeb.initWallet();
        console.log("Connected wallet!");
        cryptoWorking = true;
    } catch {
        cryptoWorking = false;
    }

    if(!cryptoWorking){
        tokenToMaskButton.style.display = "none";
    } else {
        tokenToMaskButton.style.display = "block";
    }

    // Tour von Backend laden
    var response = await fetch(`${window.BASEURL}/tours/${tourID}`);
    if (response.status == 200) {
        tour = await response.json();
        await populateSite();

        var owns_tour = await checkOwnsTour();

        if(!owns_tour && tour.bpoolAddress && tour.tokenAddress) {
            if(cryptoWorking){
                await getPriceAndParams();
            }
        }
    }

    loadGPX();
}

//Populate content of tour items
async function populateSite() {
    tour_name.innerHTML = tour.title;
    tour_description.innerHTML = tour.description;
    let difficulty;
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
    infos.innerHTML = "<b>Dauer:</b> "+tour.duration+" Minuten <br> <b>L??nge:</b> "+tour.distance+" km <br> <b>Schwierigkeit:</b> "+difficulty;

    // Images
    var images = tour.tourImages;
    if (images.length >= 3) {
        $(".mainimage").attr("src", buildImgUrl(tour.tID, images[0].tiID));
        $(".img1").attr("src", buildImgUrl(tour.tID, images[1].tiID));
        $(".img2").attr("src", buildImgUrl(tour.tID, images[2].tiID));
    }

    //rating
    var response = await fetch(`${window.BASEURL}/tours/${tourID}/rating`);
    var rating;
    if (response.status == 200) {
        rating = (await response.json()).tourRating;
    } else {
        rating = "-";
    }
    console.log("Rating:", rating);
    $("#ratings")[0].innerHTML = rating;

    // Infos f??r Crypto Nerds
    var tokenAddrLi = document.createElement("li");
    tokenAddrLi.appendChild(document.createTextNode(`Token-Adresse: ${tour.tokenAddress}`));
    address_ul.appendChild(tokenAddrLi);

    var poolAddrLi = document.createElement("li");
    poolAddrLi.appendChild(document.createTextNode(`Balancer Pool-Adresse: ${tour.bpoolAddress}`));
    address_ul.appendChild(poolAddrLi);

    // Autor username
    var creator_name = await fetch(`${window.BASEURL}/tours/${tourID}/creator`)
    tour_author.innerHTML = "Erstellt von " + await creator_name.text();

    // enable rating if signed in
    fetch(window.BASEURL+"/user/loggedin", {
            method: 'get',
            credentials: 'include',
        }).then(response => {
            if(!response.ok && response.status == 401) {
                console.log("not logged in");
                own_rating_div.style.display = "none";
            } else {
                console.log("logged in");
                own_rating_div.style.display = "flex";
            }
        });
}

// Get Url of images specified by their tour ID and image ID
function buildImgUrl(tourID, imageID) {
    return `${window.BASEURL}/tours/${tourID}/image/${imageID}`;
}

async function getPriceAndParams() {
    // Get Price of Contract
    var result = await CrypTourWeb.getSpotPrice(tour.bpoolAddress, tour.tokenAddress);
    var conversion_result = await (await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ocean-protocol&vs_currencies=EUR")).json();
    var conversion_rate = conversion_result["ocean-protocol"]["eur"];
    console.log("Using conversion rate: 1 Ocean ??? EUR", conversion_rate);
    var ocean_price = parseFloat(result.result.spotPrice.main).toFixed(3);
    var euro_price = parseFloat(ocean_price * conversion_rate).toFixed(2);
    tour_price[0].innerHTML = `<b>${ocean_price} OCEAN</b> ??? ${euro_price} ???`;

    // Get Parameters of Tour
    var res = await CrypTourWeb.recommParamsForGetTT(tour.bpoolAddress, tour.tokenAddress, CrypTourWeb.web3Provider.utils.toWei("1"));
    priceWei = res.result.spotPrice.wei;
    maxAmountIn = res.result.maxAmountIn.wei;
    maxPrice = res.result.maxPrice.wei;
}

//Check wether user owns the tour and set items accordingly
async function checkOwnsTour() {
    var result = await fetch(`${window.BASEURL}/tours/${tourID}/gpx`, {credentials: 'include'});
    var owns = result.status == 200;
    console.log("current user owns tour:", owns);
        if (owns) {
            map_group.style.display = "block";
            price_box.style.display = "none";
            download_box.style.display = "block";
            error_box.style.display = "none";
        } else {
            if (cryptoWorking){
                map_group.style.display = "none";
                price_box.style.display = "block";
                download_box.style.display = "none";
                error_box.style.display = "none";
            } else {
                map_group.style.display = "none";
                price_box.style.display = "none";
                download_box.style.display = "none";
                error_box.style.display = "block";
            }
        }
    return owns;
}

async function buyToken() {
    // status turn on
    status_container.classList.remove("status-hidden");
    buying_status.classList.remove("status-error");
    buy_spinner.style.display = "inline-block";

    buying_status.innerHTML = "TourToken in MetaMaks hinzuf??gen...";
    addTokenToWallet();

    // check ob der user schon tour token besitzt
    var can_consume_result = await CrypTourWeb.canConsumeTTat(tour.tokenAddress)
    console.log("User already owns TourToken?", can_consume_result.result.canConsume);

    // user does not own tour, initiate tour buying
    if (!can_consume_result.result.canConsume) {
        buying_status.innerHTML = "Kaufe TourToken...";
        try {
            var buy_result = await CrypTourWeb.getTT(tour.bpoolAddress, maxAmountIn, tour.tokenAddress, CrypTourWeb.web3Provider.utils.toWei("1"), maxPrice);
            console.log("Finished tourToken buying process", buy_result);
        } catch (error) {
            console.error("Error buying tour Token:", error);
            buying_status.innerHTML = "Etwas ist schief gelaufen :(";
            buying_status.classList.add("status-error");
            buy_spinner.style.display = "none";
            return;
        }
    }

    // user owns tour token -> send to tour creator
    buying_status.innerHTML = "??bertrage TourToken...";
    sendToken();
}

// Load the gpx file and set map leaflet map
function loadGPX(){
    let opts = {
        map: {
            center: [41.4583, 12.7059],
            zoom: 5,
            fullscreenControl: false,
            resizerControl: true,
            preferCanvas: false,
            rotate: true,
            // bearing: 45,
            rotateControl: {
                closeOnZeroBearing: true
            },
        },
        layersControl: {
            options: {
                collapsed: false,
            },
        },
    };
    
    let map = L.map('map', opts.map);
    let gpx = `${window.BASEURL}/tours/${tourID}/gpx`;
    let controlLayer = L.control.layers(null, null, opts.layersControl.options);
    new L.GPX(gpx, {async: true}).on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());
      }).addTo(map);
}

// Send Token and process result
function sendToken() {
    CrypTourWeb.consumeTT(tour.tokenAddress, tour.tID)
        .then((res) => {
            console.log("Sent Token to initial creator");
            // GPX-Download Button anzeigen
            checkOwnsTour();
        })
        .catch(err => {
            console.log("Error sending token to creator", err);
            buying_status.innerHTML = "Etwas ist schief gelaufen :(";
            buying_status.classList.add("status-error");
            buy_spinner.style.display = "none";
        })
}

// Download the specified GPX file
function downloadGpx() {
    fetch(`${window.BASEURL}/tours/${tourID}/gpx`, {credentials: 'include'})
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "tour.gpx";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //afterwards we remove the element again         
        });
}

// Add the token to the specified wallet
function addTokenToWallet() {
    try {
      ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tour.tokenAddress,
            symbol: "CT-" + tour.tID,
            decimals: 18,
            image: "https://cryptour.dullmer.de/images/icons/logo.ico"
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
}

// Send rating for a tour
function send_rating() {
    var rating_numer = document.querySelector('input[name="rating"]:checked').value;;
    var rating_obj =
    {
        rating: parseInt(rating_numer)
    };

    fetch(`${window.BASEURL}/tours/${tourID}/rating`,
        {credentials: 'include', method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(rating_obj)});
}
