let locationsData; // Define a variable to store locations data globally

// Fetch events from the API and display them


let userDataJSON;
let userData;
document.addEventListener("DOMContentLoaded", function() {
    const profileName = document.getElementById("userProfile")

    userDataJSON = localStorage.getItem('userData');
    // Check if userDataJSON is not null or undefined
    if (userDataJSON) {
        // Parse the JSON string to an object
        userData = JSON.parse(userDataJSON);
        profileName.innerHTML = userData.FirstName;
        console.log('User data:', userData);
    } else {
        console.log('userDataJSON is null or undefined');
    }
    fetchEvents();

    // More of your existing code here
});



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
                // displayEventsContainer.insertBefore(eventCard, displayEventsContainer.lastChild);
                if (displayEventsContainer.hasChildNodes()) {
                    displayEventsContainer.insertBefore(eventCard, displayEventsContainer.lastChild);
                } else {
                    displayEventsContainer.appendChild(eventCard);
                }
                

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
async function createEventCard(event, locations) {
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

    const eventType = document.createElement('h3');
    const privateEventsData = await getPrivateEvents();
    // console.log(privateEventsData);
    const privateEventIDs = new Set(privateEventsData.map(event => event.EventID));
    eventType.classList.add('eventType');
    eventType.textContent = "\tEvent Type: " + (privateEventIDs.has(event.EventID) ? 'Private' : 'Public');

    eventCard.appendChild(eventName);
    eventCard.appendChild(eventDate);
    eventCard.appendChild(eventTime);
    eventCard.appendChild(eventLocation);
    eventCard.appendChild(longitude);
    eventCard.appendChild(latitude);
    eventCard.appendChild(eventDescription);
    eventCard.appendChild(eventType);

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

        const formattedTime = `${eventDate} ${eventTimeHours}:${eventTimeMinutes}:00`;
        // Construct event data object
        const eventData = {
            // "time": "2024-03-13 12:21:00",
            // "timeOfDay": "PM",
            // "location": "Miami, FL",
            // "longitude": 30.006,
            // "latitude": 50.7128,
            // "eventName": "WTST??2222 . . . ",
            // "description": "WTWS22222 here matehhgtttt"
            
            //time: eventDate + ' ' + eventTimeHours + ':' + eventTimeMinutes + ':00',
            time: formattedTime,
            timeOfDay: daytime,
            location: eventLocation,
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude),
            eventName: eventName,
            description: eventDescription
        };

        
        
        

        // // Call function to create event
        const eventCreated = await createEvent(eventData);
        console.log(userData.UserID);
        if(eventType === 'private'){
            if(eventCreated){
                
                setTimeout(async () => {
                    const eventDat = await searchEvents2(eventData.eventName);
                    console.log(eventDat.Events_ID);
                    console.log(eventData);
                    // console.log(await eventDat.json());
                    const eventDat2 = await eventDat.json();
                    const eventID = eventDat2[0].Events_ID;
                    console.log(eventDat2[0]);
                    console.log(eventDat2[0].Events_ID);
                    await createPrivateEvent(eventDat2[0].Events_ID, userData.UserID, userData.UserID);
                }, 5000);
            }
        }
        if(eventCreated){
            alert("Event Created Successfully");
            fetchEvents();
        }

        eventContainer.style.display = "none";
        displayEventsContainer.style.display = "block";

    });

    

});


async function createPrivateEvent(eventID, adminID, superAdminID) {
    console.log("Under Here");
    console.log(eventID);
    console.log(adminID);
    console.log(superAdminID);
    console.log("----------");
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/CreatePrivateEvent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventID: eventID,
                adminID: adminID,
                superAdminID: superAdminID
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create private event');
        }

        const data = await response.json();
        console.log('Private event created successfully:', data);
        // Call any additional functions or handle the response as needed
    } catch (error) {
        console.error('Error creating private event:', error.message);
        // Handle error, e.g., show error message to the user
    }
}

async function searchEvents2(searchQuery) {
    console.log(searchQuery);
    // Prepare the search object
    const searchObject = {
        keyword: searchQuery
    };
    
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/SearchEvent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchObject)
        })
        if(response){
            console.log(response.Description);
            return response;
        }
    } catch (error) {
        console.error('Error calling SearchEvent API:', error);
    }
}


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
            console.log(response);
            throw new Error('Create Event failed');
        }

        console.log('Event Created Successfully:');
        return true;

    } catch (error) {
        console.error('Error creating Event:', error.message);
        alert("Event already exists");
        return false;
    }
}

async function getEvents() {
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/GetAllEvents.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw error; 
    }
}

async function getPrivateEvents() {
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/GetAllPrivateEvents.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        console.log(response);

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw error; 
    }
}





