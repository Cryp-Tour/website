let gpxInput = document.getElementById("gpx-file");
gpxInput.addEventListener("change", function(e){
	if(e.target.files.length == 0){
		gpxInput.previousElementSibling.innerHTML = "GPX-Datei auswählen";
	} else {
		gpxInput.previousElementSibling.innerHTML = "GPX-Datei: "+e.target.files[0].name;
	}
});

let imgInputs = document.getElementsByClassName("img-file-input");
for(let i = 0; i < imgInputs.length; i++){
	imgInputs[i].addEventListener("change", function(e){
		if(e.target.length == 0){
			imgInputs[i].previousElementSibling.innerHTML = "Bild auswählen";
		} else {
			imgInputs[i].previousElementSibling.innerHTML = "Bild: "+e.target.files[0].name;
		}
	});
}


$( ".detail-button" ).on('click', async function( event ) {
	var inputs = $('.validate-tour-input .tour-input');
	let registerData = {};
	let gpxFile;
	let img_file_1, img_file_2, img_file_3;

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
			case 'gpx-file':
				gpxFile = $(inputs[i]).prop('files')[0];
				break;
			case 'img-file-1':
				img_file_1 = $(inputs[i]).prop('files')[0];
				break;
			case 'img-file-2':
				img_file_2 = $(inputs[i]).prop('files')[0];
				break;
			case 'img-file-3':
				img_file_3 = $(inputs[i]).prop('files')[0];
				break;
			default:
		}
	}

	let fileparts = gpxFile.name.split('.');
	if(fileparts[fileparts.length - 1] != "gpx"){
		$('#gpx-error').text("Ungültiger Dateityp der Tourendatei.");
	} else {
		if(img_file_1.type !== undefined && img_file_2.type !== undefined && img_file_3.type !== undefined){
			const img_mimetypes = ["image/jpeg", "image/svg+xml", "image/png"];
			if(!img_mimetypes.includes(img_file_1.type) || !img_mimetypes.includes(img_file_2.type) || !img_mimetypes.includes(img_file_3.type)){
				$('#img-error').text("Alle Dateien müssen Bilder sein.");
			} else {
				var tour_id = await createTour(registerData);
	
				//upload tour-gpx
				$('#gpx-error').text("");
				await uploadGPXFile(tour_id,gpxFile);
				
				//upload images
				$('#img-error').text("");
				await uploadImage(tour_id, img_file_1);
				await uploadImage(tour_id, img_file_2);
				await uploadImage(tour_id, img_file_3);
	
				await createCrypto(tour_id);
	
				// redirect to tour page
				window.location.href = `/tour.html?tourID=${tour_id}`;
			}
		} else {
			$('#img-error').text("Es müssen 3 Bilder hochgeladen werden.");
		}
	}
});

async function createTour(tourdata) {
	let endpoint = window.BASEURL+'/tours'

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
	let endpoint = window.BASEURL+'/user'
	const response =  await fetch(endpoint, {method:'GET',
		credentials: 'include'
   	});
	var json = await response.json()
	console.log("current User ID: " + json.id)
	return json.id
}

async function uploadGPXFile(tid,file){
	let updatedFile = new File([file], file.name, {type: "application/gpx+xml"});
	let endpoint = window.BASEURL+'/tours/'+tid+'/gpx';
	let formData = new FormData(); 
    formData.append("file", updatedFile);
	const response =  await fetch(endpoint, {method:'POST',
		credentials: 'include',
		body: formData
   	});
}

async function uploadImage(tid,file){
	let endpoint = window.BASEURL+'/tours/'+tid+'/image';
	let formData = new FormData();
    formData.append("file", file);
	const response =  await fetch(endpoint, {method:'POST',
		credentials: 'include',
		body: formData
   	});
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
