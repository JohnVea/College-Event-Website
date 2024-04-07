// Fetch events from the API and display them
fetchEvents();

function fetchEvents() {
    fetch('http://unieventverse.com/LAMPAPI/GetAllEvents.php')
    .then(response => response.json())
    .then(events => {
        fetchLocations()
        .then(locations => {
            const displayEventsContainer = document.querySelector('.displayEventsContainer');
            
            // Loop through each event and create HTML elements to display them
            events.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.classList.add('eventCard');

                const eventName = document.createElement('h1');
                eventName.textContent = 'Event: ' + event.EventName;

                const eventDate = document.createElement('h2');
                eventDate.textContent = "Time: " + event.EventTime;

                // Find the location that matches the event's location
                const location = locations.find(location => location.LocID === event.Location);

                const eventLocation = document.createElement('h3');
                eventLocation.textContent = "Event Location: " + location.Name;

                const longitude = document.createElement('h3');
                longitude.textContent = "\tLongitude: " + location.Longitude;

                const latitude = document.createElement('h3');
                latitude.textContent = "\tLatitude: " + location.Latitude;

                const eventDescription = document.createElement('p');
                eventDescription.textContent = event.Description;

                eventCard.appendChild(eventName);
                eventCard.appendChild(eventDate);
                eventCard.appendChild(eventLocation);
                eventCard.appendChild(longitude);
                eventCard.appendChild(latitude);
                eventCard.appendChild(eventDescription);

                displayEventsContainer.insertBefore(eventCard, displayEventsContainer.lastChild);

                // Set height of event card based on description height
                const descriptionHeight = eventDescription.clientHeight;
                eventCard.style.height = descriptionHeight + 10 + '%';
            });
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching events:', error);
    });
}

async function fetchLocations() {
    const response = await fetch('http://unieventverse.com/LAMPAPI/GetAllLocations.php');
    return await response.json();
}


// Function to create an event card based on event data
function createEventCard(event, locations) {
    const eventCard = document.createElement('div');
    eventCard.classList.add('eventCard');

    const eventName = document.createElement('h1');
    eventName.textContent = 'Event: ' + event.EventName;

    const eventDate = document.createElement('h2');
    eventDate.textContent = "Time: " + event.EventTime;

    // Find the location that matches the event's location
    const location = locations.find(location => location.LocID === event.Location);

    const eventLocation = document.createElement('h3');
    eventLocation.textContent = "Event Location: " + location.Name;

    const longitude = document.createElement('h3');
    longitude.textContent = "\tLongitude: " + location.Longitude;

    const latitude = document.createElement('h3');
    latitude.textContent = "\tLatitude: " + location.Latitude;

    const eventDescription = document.createElement('p');
    eventDescription.textContent = event.Description;

    eventCard.appendChild(eventName);
    eventCard.appendChild(eventDate);
    eventCard.appendChild(eventLocation);
    eventCard.appendChild(longitude);
    eventCard.appendChild(latitude);
    eventCard.appendChild(eventDescription);

    // Set height of event card based on description height
    const descriptionHeight = eventDescription.clientHeight;
    eventCard.style.height = descriptionHeight + 10 + '%';

    return eventCard;
}



// Listen for changes in the search bar input field
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', searchEvents);

function searchEvents() {
    const searchQuery = searchBar.value;
    console.log(searchQuery);
    // Prepare the search object
    const searchObject = {
        keyword: searchQuery
    };
    
    // Call the SearchEvent API with the search query
    fetch('http://unieventverse.com/LAMPAPI/SearchEvent.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchObject)
    })
    .then(response => response.json())
    .then(events => {
        // Clear existing event cards
        const displayEventsContainer = document.querySelector('.displayEventsContainer');
        displayEventsContainer.innerHTML = '';
        
        // Loop through each search result and create event cards
        events.forEach(event => {
            const eventCard = createEventCard(event, locations);
            displayEventsContainer.appendChild(eventCard);
        });
        
    })
    .catch(error => {
        console.error('Error searching events:', error);
    });
}
