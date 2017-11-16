
var username = "67c64b98-fe29-4e97-90de-5c65855f7726";

function dateDiff(date1, date2){
    var diff = {}                           // Initialisation du retour
    var tmp = date2 - date1;
 
    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes
 
    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes
 
    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures
     
    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
    diff.day = tmp;

	return diff;
}
function display(){
	$.ajax({
		url: "https://api.sncf.com/v1/coverage/sncf/stop_areas/stop_area%3AOCE%3ASA%3A87723197/departures?count=15",
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", "Basic " + btoa(username));
		},

	})
	.done(function( data ) {
		for(var i=0; i<15; i++){
			var classHeure = ".heure" + i.toString();
			var classGare = ".gare" + i.toString();
			var classTrain = ".train" + i.toString();
			var classInfo = ".info" + i.toString();
			var departureTime = data.departures[i].stop_date_time.departure_date_time.substring(9, 11) + "H" + data.departures[i].stop_date_time.departure_date_time.substring(11, 13);
			var baseDepartureTime = data.departures[i].stop_date_time.base_departure_date_time.substring(9, 11) + "H" + data.departures[i].stop_date_time.base_departure_date_time.substring(11, 13);
			var destination = data.departures[i].display_informations.direction.replace(/ *\([^)]*\) */g, "");
			var trainType = data.departures[i].display_informations.commercial_mode
			var trainNumber = data.departures[i].display_informations.headsign;	
			var train =  trainType + "  " + trainNumber;
			var info= "";
			var links = data.departures[i].display_informations.links;
			if (links.length == 0){
				info = "A l'heure";
				$( classHeure ).empty().append( departureTime);
			}
			else{
				var idDisruption = links[0].id;	

				console.log(destination+ " retard id : "+ idDisruption);
				var disruption = data.disruptions;	

				function getDisruption(id) {
					return disruption.filter(
						function(disruption){return disruption.disruption_id == id}
						);
				}				
				var found = getDisruption(idDisruption);
				console.log(found[0]);
				if(found[0].severity.name == "trip delayed"){
					var min =""; 
					var baseTime = data.departures[i].stop_date_time.base_departure_date_time.substring(9,14);
					var amendedTime = data.departures[i].stop_date_time.departure_date_time.substring(9,14);
					console.log("basetime = " + baseTime + " amendedTime " + amendedTime );
					var date1 = baseTime.substring(0,2) + ":" + baseTime.substring(2,4) + ":" + baseTime.substring(4,6);
					var date2 = amendedTime.substring(0,2) + ":" + amendedTime.substring(2,4) + ":" + amendedTime.substring(4,6);
					date1 = new Date("2012-12-20 " + date1);
					date2 = new Date("2012-12-20 " + date2);
					var diff = dateDiff(date1, date2);
					var min = diff.min;
					console.log(min);
					info = "Retard " + min + " minutes";
				}
				else{
					info = found[0].severity.name;
				}
				$( classHeure ).empty().append("<del>" + baseDepartureTime + "</del>" + "  " + departureTime);

			}


			
			$( classGare ).empty().append( destination);
			$( classTrain ).empty().append( train);
			$( classInfo ).empty().append( info);
		}


	});
}

setInterval(display, 40000);	
//display();
