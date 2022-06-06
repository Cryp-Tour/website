
$( ".detail-button" ).on('click', async function( event ) {
	var inputs = $('.validate-tour-input .tour-input');
	let registerData = {};

	for(var i=0; i<inputs.length; i++) {
		switch($(inputs[i]).attr('name')) {
			case 'name':
				registerData.title = $(inputs[i]).val();
				break;
			case 'difficulty':
				registerData.difficulty = $(inputs[i]).val();
				if (registerData.difficulty=="leicht"){
					registerData.difficulty = 1
				}
				else if (registerData.difficulty=="mittel"){
					registerData.difficulty = 2
				}
				else if (registerData.difficulty=="schwer"){
					registerData.difficulty = 3
				}
				else {
					registerData.difficulty = 1
				}

				break;
			case 'location':
				registerData.location = $(inputs[i]).val();
				break;
			case 'distance':
				registerData.distance = $(inputs[i]).val();
				break;
			case 'duration':
				registerData.duration = $(inputs[i]).val();
				break;
			case 'description':
				registerData.description = $(inputs[i]).val();
				break;
			default:
		}
	}
	var tour_id = await createTour(registerData);
	// TODO: create images

	await createCrypto(tour_id);

	// redirect to tour page
	window.location.href = `/tour.html?tourID=${tour_id}`;
});

async function createTour(tourdata) {
	let endpoint = 'https://backend.cryptour.dullmer.de/tours'

	let postTourData = {};
	postTourData.title = tourdata.title
	postTourData.difficulty = tourdata.difficulty
	postTourData.location = tourdata.location
	postTourData.distance = tourdata.distance
	postTourData.duration = tourdata.duration
	postTourData.description = tourdata.description
	postTourData.creatorID = await getCreatorId();
	console.log(postTourData)

	var response = await fetch(endpoint, { method:'POST',
		headers: {'Content-Type': 'application/json'},
	 	credentials: 'include',
		body: JSON.stringify(postTourData)
	})

	return (await response.json()).tID;
}

async function getCreatorId() {
	let endpoint = 'https://backend.cryptour.dullmer.de/user'
	const response =  await fetch(endpoint, {method:'GET',
		credentials: 'include'
   	});
	var json = await response.json()
	console.log("current User ID: " + json.id)
	return json.id
}

async function createCrypto(tour_id) {
	// status anschalten
    status_container.classList.remove("status-hidden");
    buying_status.classList.remove("status-error");
    buy_spinner.style.display = "inline-block";

	const ocean_rinkeby = "0x8967BCF84170c91B0d24D4302C2376283b0B3a07";
	try {
		setCurrentStatus("MetaMask aktivieren...");
		await CrypTourWeb.init();
		await CrypTourWeb.initWallet();

		// always use OCEAN Token as swap token
		CrypTourWeb.erc20TokenIn = ocean_rinkeby;

		// create dataset (with empty blob)
		// mint 25000 tokens and allow a maximum of 25000 tokens to exist
		setCurrentStatus("Tour Token erstellen...");
		var token_symbol = `CT-${tour_id}`;
		var dataset_result = await CrypTourWeb.createTokenForDataset("", `Cryptour-ID:${tour_id}`, token_symbol, "25000", "25000");
		var tour_token_addr = dataset_result[0].events['TokenRegistered'].returnValues.tokenAddress;
		addTokenToWallet(tour_token_addr, token_symbol);
		
		// create balancer pool
		setCurrentStatus("Balancing Pool erstellen...");
		var pool_result = await CrypTourWeb.createLP();
		var bpool_addr = pool_result[0].events['LOG_NEW_POOL'].returnValues['pool'];

		// put 100 Ocean and 100 Tour Tokens in the BPool and start it
		setCurrentStatus("Balancing Pool starten. Dies kann eine Weile dauern...");
		await CrypTourWeb.startLP("100", "100", tour_token_addr, bpool_addr);
	} catch (error) {
		console.log("Error creating Crypto Token", error);
		setCurrentStatus("Fehler beim Crypto erstellen! Diese Tour ist jetzt kaputt. Bitte wende dich an den Support");
		buying_status.classList.add("status-error");
		buy_spinner.style.display = "none";
		throw "Fehler beim Crypto erstellen! Diese Tour ist jetzt kaputt. Bitte wende dich an den Support";
	}
}

async function addTokenToWallet(token_addr, symbol) {
	try {
		ethereum.request({
		  method: 'wallet_watchAsset',
		  params: {
			type: 'ERC20',
			options: {
			  address: token_addr,
			  symbol: symbol,
			  decimals: 18,
			  image: "https://cryptour.dullmer.de/images/icons/logo.ico"
			},
		  },
		});
	  } catch (error) {
		console.log(error);
	  }
}

function setCurrentStatus(text) {
	buying_status.innerHTML = text;
	console.log("Current Crypto Status: ", text);
}
