let locationsData; // Define a variable to store locations data globally

// Fetch events from the API and display them
fetchEvents();

function fetchEvents() {
    fetch('http://unieventverse.com/LAMPAPI/GetAllEvents.php')
    .then(response => response.json())
    .then(events => {
        fetchLocations()
        .then(locations => {
            locationsData = locations; // Store locations data globally
            const displayEventsContainer = document.querySelector('.displayEventsContainer');
            
            // Loop through each event and create HTML elements to display them
            events.forEach(event => {
                const eventCard = createEventCard(event, locationsData); // Pass locations data
                displayEventsContainer.insertBefore(eventCard, displayEventsContainer.lastChild);

                // Set height of event card based on description height
                const descriptionHeight = eventCard.querySelector('.eventDescription').clientHeight;
                eventCard.style.height = descriptionHeight + 7 + '%';
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
    eventName.textContent = 'Event: ' + (event.EventName ? event.EventName : event.Event_name);

    const eventDate = document.createElement('h2');
    eventDate.textContent = "Date: " + event.EventDate;

    const eventTime = document.createElement('h2');
    eventTime.textContent = "Time: " + event.EventTime;

    // Find the location that matches the event's location
    const location = locations.find(location => location.LocID === event.Location);

    const eventLocation = document.createElement('h3');
    eventLocation.textContent = "Event Location: " + location.Name;

    const longitude = document.createElement('h3');
    longitude.textContent = "\tLongitude: " + location.Longitude;

    const latitude = document.createElement('h3');
    latitude.textContent = "\tLatitude: " + location.Latitude;

    const eventDescription = document.createElement('p');
    eventDescription.classList.add('eventDescription');
    eventDescription.textContent = event.Description;

    eventCard.appendChild(eventName);
    eventCard.appendChild(eventDate);
    eventCard.appendChild(eventTime);
    eventCard.appendChild(eventLocation);
    eventCard.appendChild(longitude);
    eventCard.appendChild(latitude);
    eventCard.appendChild(eventDescription);

    return eventCard;
}

function createEventCardSearch(event, locations) {
    const eventCard = document.createElement('div');
    eventCard.classList.add('eventCard');

    const eventName = document.createElement('h1');
    eventName.textContent = 'Event: ' + (event.Event_name ? event.Event_name : event.EventName);

    // Extract date and time from the 'Time' field
    const dateTimeParts = event.Time.split(' '); // Split the time string at the space
    const eventDate = document.createElement('h2');
    console.log(event.Time);
    eventDate.textContent = "Date: " +event.Time; 
    eventDate.textContent = "Date: " + dateTimeParts[0]; // Get the date part
    const eventTime = document.createElement('h2');
    eventTime.textContent = "Time: " + dateTimeParts[1]; // Get the time part

    // Find the location that matches the event's location
    const location = locations.find(location => location.LocID === event.Location);

    const eventLocation = document.createElement('h3');
    eventLocation.textContent = "Event Location: " + location.Name;

    const longitude = document.createElement('h3');
    longitude.textContent = "\tLongitude: " + location.Longitude;

    const latitude = document.createElement('h3');
    latitude.textContent = "\tLatitude: " + location.Latitude;

    const eventDescription = document.createElement('p');
    eventDescription.classList.add('eventDescription');
    eventDescription.textContent = event.Description;

    eventCard.appendChild(eventName);
    eventCard.appendChild(eventDate);
    eventCard.appendChild(eventTime);
    eventCard.appendChild(eventLocation);
    eventCard.appendChild(longitude);
    eventCard.appendChild(latitude);
    eventCard.appendChild(eventDescription);
    

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
        
        console.log(events);
        // Loop through each search result and create event cards
        events.forEach(event => {
            const eventCard = createEventCardSearch(event, locationsData); // Pass locations data
            displayEventsContainer.appendChild(eventCard);

            // Set height of event card based on description height
            const descriptionHeight = eventCard.querySelector('.eventDescription').clientHeight;
            eventCard.style.height = descriptionHeight + 10 + '%';
        });
    })
    .catch(error => {
        
        console.error('Error searching events:', error);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const createEventButton = document.getElementById('createEvent');
    const eventContainer = document.getElementById('createEventContainer');
    const closeCreateEventForm = document.getElementById('closeCreateEventForm');
    const displayEventsContainer = document.querySelector('.displayEventsContainer');
    
    // Show the create event form when the button is clicked
    createEventButton.onclick = function() {
        eventContainer.style.display = "block";
        displayEventsContainer.style.display = "none";
    };

    // Hide the create event form when the close button is clicked
    closeCreateEventForm.onclick = function() {
        eventContainer.style.display = "none";
        displayEventsContainer.style.display = "block";
    };

    // Form submission event listener
    const createEventForm = document.querySelector('.createEventContainer form');
    createEventForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get input values
        const eventName = document.getElementById('eventName').value;
        const eventDate = document.getElementById('eventDate').value;
        const eventTimeHours = document.getElementById('eventTimeHours').value;
        const eventTimeMinutes = document.getElementById('eventTimeMinutes').value;
        const daytime = document.getElementById('Daytime').value;
        const longitude = document.getElementById('longitude').value;
        const latitude = document.getElementById('latitude').value;
        const eventLocation = document.getElementById('eventLocation').value;
        const eventDescription = document.getElementById('eventDescription').value;
        const eventType = document.getElementById('eventType').value;

        // Construct event data object
        const eventData = {
            "time": "2023-07-17 12:21:00",
            "timeOfDay": "PM",
            "location": "Miami, FL",
            "longitude": 38.006,
            "latitude": 58.7128,
            "eventName": "web Testing Event  ????? . . . ",
            "description": "herrrrrrrrrreeeee \n alrighthhgtttt"
            // eventName: eventName,
            // time: eventDate + ' ' + eventTimeHours + ':' + eventTimeMinutes + ':00',
            // timeOfDay: daytime,
            // location: eventLocation,
            // longitude: parseFloat(longitude),
            // latitude: parseFloat(latitude),
            // description: eventDescription,
            // eventType: eventType
        };

        // Call function to create event
        await createEvent(eventData);
    });
});

async function createEvent(eventData) {
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/CreateEvent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            throw new Error('Create Event failed');
        }

        const data = await response.json();
        console.log('Event Created Successfully:', data);

    } catch (error) {
        console.error('Error creating Event:', error.message);
    }
}





