    let lat, lon;

    
    //test if geolocation is available and allowed
    if ('geolocation' in navigator) {
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(async position => {
            let lat, lon, weather, air;
            //error handling with try catch
            try {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            //add position to web page
            document.getElementById('latitude').textContent = lat.toFixed(2);
            document.getElementById('longitude').textContent = lon.toFixed(2);
            const api_url = `weather/${lat},${lon}`;
            //const api_url = `/weather`;
            const response = await fetch(api_url);
            const json = await response.json();
            weather = json.weather
            air = json.air_quality;
            document.getElementById('summary').textContent = weather.weather[0].main;
            document.getElementById('temp').textContent = weather.main.temp;
            document.getElementById('aq_value').textContent = air.data.current.pollution.aqius;
            document.getElementById('aq_date').textContent = air.data.current.pollution.ts;
            console.log(json);

            
        } catch (error) {
            air = {value: -1};
            document.getElementById('aq_value').textContent = 'NO READING';
        }

        //log data into database when the page loads (check in button removed)
        const data = {lat,lon, weather, air};
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        //second argument in fetch is to send post. Method has to be changed to POST(see above) as default is GET
        //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const db_response = await fetch('/api', options);
        const db_json = await db_response.json();
        console.log(db_json);
        });
    } else {
        console.log('geolocation not available');
    }