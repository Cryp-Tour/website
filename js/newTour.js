
$( ".validate-tour-form" ).on('submit', async function( event ) {

	var input = $('.validate-tour-input .tour-input');
	
		event.preventDefault();
		var check = true;
		let registerData = {};

		for(var i=0; i<input.length; i++) {
				switch($(input[i]).attr('name')) {
					case 'name':
						registerData.title = $(input[i]).val();
						break;
					case 'difficulty':
						registerData.difficulty = $(input[i]).val();
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
						registerData.location = $(input[i]).val();
						break;
					case 'distance':
						registerData.distance = $(input[i]).val();
						break;
					case 'duration':
						registerData.duration = $(input[i]).val();
						break;
					case 'description':
						registerData.description = $(input[i]).val();
						break;
					default:
				}
		}
		var tour = await createTour(registerData)
		
		document.getElementById('contactForm').submit()
		
		return true;
	});

  async function createTour(tourdata) {
	let endpoint = 'https://backend.cryptour.dullmer.de/tours'

	let registerData = {};
	registerData.title = tourdata.title
	registerData.difficulty = tourdata.difficulty
	registerData.location = tourdata.location
	registerData.distance = tourdata.distance
	registerData.duration = tourdata.duration
	registerData.description = tourdata.description
	// TODO get correcr user id
	registerData.creatorID = 8
	console.log(registerData)

	const response =  await fetch(endpoint, {method:'POST',
		headers: {'Content-Type': 'application/json'},
	 	credentials: 'include',
		body: JSON.stringify(registerData)
	 	
	})
	console.log("success")
	

}

// TODO 
async function getCreatorId() {
	let endpoint = 'https://backend.cryptour.dullmer.de/user'
	const response =  await fetch(endpoint, {method:'GET',
		headers: {'Content-Type':'application/json'},
		credentials: 'include'
	
   })
	var json = response.json()
	console.log("User ID: " + json.id)
	return json.id

}

