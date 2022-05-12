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


// TODO: nutzen wir den Ocean token auf rinkeby oder was ganz anderes?
const ocean_rinkeby = "0x8967BCF84170c91B0d24D4302C2376283b0B3a07";
// aktuell der Demo Token den ich erstellt habe
CrypTourWeb.erc20TokenIn = "0x1c325FeC9FDAb6a788B67B93079c05d9fB9D0c62";

var tour = null;
var priceWei = 0;
var maxPrice = 0;
var maxAmountIn = 0;


async function init_crypto() {
    // TODO: auskommentieren sobald crypto auf einer öffentlichen Blockchain ist

    // await CrypTourWeb.init();
    // console.log("Inited Web Lib")
    // await CrypTourWeb.initWallet();
    // console.log("Connected wallet!");

    // Tour von Backend laden
    var response = await fetch(`https://backend.cryptour.dullmer.de/tours/${tourID}`);
    if (response.status == 200) {
        tour = await response.json();
        await populateSite();

        if(await checkOwnsTour()) {
            // enable Map and disable buying
            map_group.style.visibility = "visible";
            buy_buttons.style.display = "none";
        } else {
            if (tour.bpoolAddress && tour.tokenAddress) {
                // Crypto Parameter und Preis abrufen
                await getPriceAndParams();
            }
        }
    }
}

async function populateSite() {
    tour_name.innerHTML = tour.title;
    tour_description.innerHTML = tour.description;

    // Images
    var images = tour.tourImages;
    console.log(images);

    $(".mainimage").attr("src", buildImgUrl(tour.tID, images[0].tiID));
    $(".img1").attr("src", buildImgUrl(tour.tID, images[1].tiID));
    $(".img2").attr("src", buildImgUrl(tour.tID, images[2].tiID));

    //rating
    var response = await fetch(`https://backend.cryptour.dullmer.de/tours/${tourID}/rating`);
    var rating = (await response.json()).tourRating;
    console.log("Rating:", rating);
    $("#ratings")[0].innerHTML = rating;
}

function buildImgUrl(tourID, imageID) {
    return `https://backend.cryptour.dullmer.de/tours/${tourID}/image/${imageID}`;
}

async function getPriceAndParams() {
    console.log("Getting Price and Params for Tour Token at", tour.tokenAddress, "and BPool Address at", tour.bpoolAddress);
    // Preis von Contract abrufen
    var result = await CrypTourWeb.getSpotPrice(tour.bpoolAddress, tour.tokenAddress);
    tour_price.innerHTML = `${result.result.spotPrice.main} Ocean Token`;

    // get recommended params for kauf???
    // TODO: was macht die 1 in .toWei??
    var res = await CrypTourWeb.recommParamsForGetTT(tour.bpoolAddress, tour.tokenAddress, CrypTourWeb.web3Provider.utils.toWei("1"));
    priceWei = res.result.spotPrice.wei;
    maxAmountIn = res.result.maxAmountIn.wei;
    maxPrice = res.result.maxPrice.wei;
    
    CrypTourWeb.canConsumeTTat(tour.tokenAddress)
        .then((result) => {
            if (result.result.canConsume) {
                console.log("User already owns Tokens for this Tour. Enabling send button");
                button_send.disabled = false;
            }
        });
}

async function checkOwnsTour() {
    // TODO: GPX download und testen ob erfolgreich
    return false;
}

function buyToken() {
    console.log(`Buying Tour: Price in Wei: ${priceWei}; maxAmountIn: ${maxAmountIn}; maxPrice: ${maxPrice}`);
    // TODO: was macht die 1 in .toWei??
    CrypTourWeb.getTT(tour.bpoolAddress, maxAmountIn, tour.tokenAddress, CrypTourWeb.web3Provider.utils.toWei("1"), maxPrice)
    .then(res => {
        console.log("Finished tourToken buying process", res);
        // TODO: GPX runterladen mit checkOwnsTour()
    })
    .catch((err) => {
        console.log("Error buying tourToken", err);
    })
}

function sendToken() {
    CrypTourWeb.consumeTT(tour.tokenAddress, tour.tID)
        .then((res) => {
            console.log("Sent Token to initial creator");
        })
        .catch(err => {
            console.log("Error sending token to creator", err);
        })
}
