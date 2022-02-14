$(document).ready(function () {

    let apikey = "24bc798bee9f91567cfc69a72e40c1ad";
    let html = "";
    var jour = new Date();
    var heure = jour.getHours()

    $("#recherche").submit(function (e) {
        e.preventDefault();
        let ville = $("#ville").val();
        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${apikey}&units=metric&lang=fr`,
            success: function (data) {
                html = `<h1>${data.name}</h1>
                    <h6><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="" width="40" height="40">${data.weather[0].description}</h6>
                    <h1>${temperature(data.main.temp)}°</h1>`;
                $.ajax({
                    type: "GET",
                    url: `https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=24bc798bee9f91567cfc69a72e40c1ad`,
                    success: function (data) {
                        switch (data.list[0].main.aqi) {
                            case 1 :
                                html += `<h6>Niveau de polution d'air est très bon</h6>` 
                            break;
                            case 2 :
                                html += `<h6>Niveau de polution d'air est bon</h6>` 
                            break;
                            case 3 :
                                html += `<h6>Niveau de polution d'air est moyen</h6>` 
                            break;
                            case 4 :
                                html += `<h6>Niveau de polution d'air est mauvais</h6>` 
                            break;
                            case 5 :
                                html += `<h6>Niveau de polution d'air est très mauvais</h6>` 
                            break;
                        }
                        $("#entete").html(html); 
                        $("#erreur").html("");   
                        $("#ville").val(""); 
                    },
                    error: function () {
                        console.log("erreur")
                    },
                });
                
            },
            error: function () {
              console.log("erreur")
            },
        });

        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${apikey}&units=metric&lang=fr`,
            success: function (data) {
                $("#aujourdhui").html(`<h3>aujourd'hui : </h3>
                <table id="tableau">
                    
                </table>`);
                let html2 = "";
                for (i=0; i<8-Math.trunc(heure/3); i++){
                    html2 += `<th>
                            <h6> ${data.list[i].dt_txt[11]}${data.list[i].dt_txt[12]}h : <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="" width="40" height="40">${data.list[i].weather[0].description}</h6>
                            <h1>${temperature(data.list[i].main.temp)}°</h1>
                            </th>`;
                }
                $("#tableau").html(html2); 
                let html3 = "";
                let list_temperature = [];
                for (i=8-Math.trunc(heure/3)-1; i<data.list.length; i++){
                    list_temperature.push(data.list[i].main.temp);
                }
                let n = 1;
                let temp_min = [];
                let temp_max = [];
                temp_min.push(list_temperature[0]);
                temp_max.push(list_temperature[0]);

                for(t of list_temperature){

                    if(t>temp_max[temp_max.length - 1]){
                        temp_max.pop();
                        temp_max.push(t);
                    }
                    if(t<temp_min[temp_min.length - 1]){
                        temp_min.pop();
                        temp_min.push(t);
                    }
                    if (n>8){
                        n = 1;
                        temp_max.push(t)
                        temp_min.push(t)
                    }
                    n += 1;
                }
                n = 0;
                //html3 += `<marquee scrollamount="2" width="200">`
                for (i=8-Math.trunc(heure/3)+3; i<data.list.length; i+=8){
                    html3 += `<div class="droite">
                            <h6> ${jour_de_la_semaine(new Date(jour).getDay()+1+n)} : <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="" width="40" height="40">${data.list[i].weather[0].description}</h6>
                            <h1>${temperature(temp_max[n])}°/${temperature(temp_min[n])}°</h1>
                            </div>`;
                   
                }
                //html3 += `</marquee>`
                $("#prochain_jour").html(html3); 
                

            },
            error: function () {
                $("#prochain_jour").html("");
                $("#tableau").html("");
                $("#entete").html("");  
                $("#aujourdhui").html("");
                $("#ville").val("");
                $("#erreur").html(`<div class="erreur">Ville introuvable</div>`); 
            },
        });
    });
    

    function temperature(temperature){
        let temperature_valeur_entiere = Math.trunc(temperature);
        if(temperature-temperature_valeur_entiere>0.5){
            temperature_valeur_entiere += 1;
        }
        return temperature_valeur_entiere;
    }

    function jour_de_la_semaine(jour){
        switch (jour){
            case 1:
                return "Lundi";
            break;
            case 2:
                return "Mardi";
            break;
            case 3:
                return "Mercredi";
            break;
            case 4:
                return "Jeudi";
            break;
            case 5:
                return "Vendredi";
            break;
            case 6:
                return "Samedi";
            break;
            case 7:
                return "Dimanche";
            break;
            default:
                return jour_de_la_semaine(jour-7);
            break;
        }
    }
});
  