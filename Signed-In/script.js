let locationsData; 


document.querySelector('.Signout').addEventListener('click', function() {
    localStorage.clear();
    window.location.href = "../index.html";
});


const ROSsButton = document.querySelector('.RSOs');
const eventCard = document.querySelector('.displayEventsContainer');
const userEvents = document.querySelector('.userEventsContainer');
const displayOrganizationsContainer = document.querySelector('.displayOrganizationsContainer');
ROSsButton.addEventListener('click', function(){
    if(displayOrganizationsContainer.style.display === 'none'){
        eventCard.style.display = 'none';
        userEvents.style.display = 'none';
        displayOrganizationsContainer.style.display = 'block';
        ROSsButton.innerHTML = "close";
        ROSsButton.style.color = 'red';
        displayOrganizations();
    }else{
        eventCard.style.display = 'block'
        userEvents.style.display = 'none';
        displayOrganizationsContainer.style.display = 'none';
        ROSsButton.innerHTML = "Organizations";
        ROSsButton.style.color = 'black';
    }
});

let allOrganizations;
async function displayOrganizations(){
    allOrganizations = await getAllOrganizations();
    const displayOrganizationsContainer = document.querySelector('.displayOrganizationsContainer');
    const oOrganizations =  document.querySelector('.organization');
    oOrganizations.innerHTML = '';
    // const privateStudentOrganizations =  await getAllStudentOrganizations();
    // console.log("privateStudentOrganizations: " + privateStudentOrganizations);
    
    if(allOrganizations){
        
        displayOrganizationsContainer.innerHTML = '';
        
        const allOrganizationsJson =  JSON.stringify(allOrganizations);
        const allOrganizationsArray = JSON.parse(allOrganizationsJson);
        allOrganizationsArray.forEach(org => {
            // console.log(privateStudentOrganizations.has(org.RSOID));
            const organizationDiv = document.createElement('div'); // Create a new div for each organization
            organizationDiv.classList.add('organization');

            const orgName = document.createElement('h1');
            orgName.textContent = org.Name;
            organizationDiv.appendChild(orgName);

            const orgUniversity = document.createElement('h2');
            orgUniversity.textContent = org.UniversityName;
            organizationDiv.appendChild(orgUniversity);

            displayOrganizationsContainer.appendChild(organizationDiv); // Append the organization div to the container
        });
        displayOrganizationsContainer.style.alignItems = 'center';
        
    }else{
        displayOrganizationsContainer.innerHTML = '';
        const orgName = document.createElement('h1');
        orgName.textContent = "No Organizations Found";
        displayOrganizationsContainer.appendChild(orgName);
        displayOrganizationsContainer.style.alignItems = 'center';
    }
}


async function getAllOrganizations(){
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/GetAllOrganizations.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        // console.log(response);

        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        retrun = null;
    }
}


const CreateRSOsButton = document.querySelector('.CreateRSOs');
const createRSOsContainer = document.querySelector('.createRSOsContainer');
CreateRSOsButton.addEventListener('click', function(){
    if(createRSOsContainer.style.display === 'none'){
        eventCard.style.display = 'none';
        userEvents.style.display = 'none';
        createRSOsContainer.style.display = 'block';
        CreateRSOsButton.innerHTML = "Cancel";
        CreateRSOsButton.style.color = 'red';
        displayOrganizations();
    }else{
        eventCard.style.display = 'block'
        userEvents.style.display = 'none';
        createRSOsContainer.style.display = 'none';
        CreateRSOsButton.innerHTML = "Create Organization";
        CreateRSOsButton.style.color = 'black';
    }
});

const submitOrganizationButton = document.getElementById("submitOrganization");

const newOrgName = document.querySelector('.OrganizationName');
submitOrganizationButton.addEventListener('click', function(){
    const newRSOName = document.getElementById('OrganizationName').value;
    
    const newOrgUni = document.querySelector('.OrganizationUniversity');
    let createdOrganization;
    (async function() {
        createdOrganization = await createOrganization(newRSOName, document.getElementById('OrganizationUniversity').value);
        eventCard.style.display = 'block'
        userEvents.style.display = 'none';
        createRSOsContainer.style.display = 'none';
        CreateRSOsButton.innerHTML = "Create Organization";
        CreateRSOsButton.style.color = 'black';
    })();
    // newOrgName.innerHTML = '';
    // newOrgUni.innerHTML = '';

    async function handleOrganizationCreation() {
        if (createdOrganization) {
            const newOrgType = document.getElementById('OrganizationType').value;
            if(newOrgType === 'student'){
                allOrganizations = await getAllOrganizations();
                const allOrganizationsJson =  JSON.stringify(allOrganizations);
                const allOrganizationsArray = JSON.parse(allOrganizationsJson);
                const createdOrganizationID = allOrganizationsArray.filter(orzation => parseInt(orzation.Name) === newRSOName);
                createStudent(parseInt(userData.UserID), parseInt(createdOrganizationID[0].UniversityID));
                const allstudents = await getAllStudents();
                if(allstudents == null){
                    alert("Student Not Found");
                    return;
                }
                const allstudentsJson =  JSON.stringify(allstudents);
                const allstudentsArray = JSON.parse(allstudentsJson);
                const allstudentsSudentID = allstudentsArray.filter(student => student.UserID === userData.UserID);
                createStudentOrganization(parseInt(userData.UserID), parseInt(createdOrganizationID[0].RSOID));
            }
            
            alert("Organization created successfully");
        }
    }

    handleOrganizationCreation();

    // const userProfile = document.getElementById("userProfile");
    // userProfile.innerHTML = userData.FirstName;
    // userProfile.style.color = 'black';
    // eventPopUpContainer.style.display = 'none';
    // eventCard.style.display = 'block';
});

async function createOrganization(organizationName, organizationUni){
    const organizationData = {
        name: organizationName,
        universityName: organizationUni
    }
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/CreateOrganization.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(organizationData)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        console.log(response);

        // const data = await response.json();
        
        return true;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        return false;
    }
}

async function createStudentOrganization(studentID, rSOID){
    const organizationData = {
        StudentID: studentID,
        RSOID: rSOID
    }
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/CreateStudentOrganization.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(organizationData)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        console.log(response);

        // const data = await response.json();
        
        // return true;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        // return false;
    }
}

async function createStudent(userID, universityID){
    const organizationData = {
        UserID: userID,
        UniversityID: universityID
    }
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/CreateStudent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(organizationData)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        console.log(response);

        // const data = await response.json();
        
        // return true;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        // return false;
    }
}


async function getAllStudents() {
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/GetAllStudents.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        // console.log(response);

        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        return null; 
    }
}

// async function getAllStudentOrganizations() {
//     try {
//         const response = await fetch('http://unieventverse.com/LAMPAPI/GetAllStudentOrganizations.php', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`Failed to fetch events: ${response.statusText}`);
//         }
//         // console.log(response);

//         const data = await response.json();
//         // console.log(data);
//         return data;
//     } catch (error) {
//         console.error('Error fetching events:', error.message);
//         return null; 
//     }
// }




const userProfileButton = document.querySelector('.userProfile');
// const eventCard = document.querySelector('.displayEventsContainer');
// const userEvents = document.querySelector('.userEventsContainer');
userProfileButton.addEventListener('click', function(){
    if(userEvents.style.display === 'none'){
        eventCard.style.display = 'none';
        userEvents.style.display = 'block';
        userProfileButton.innerHTML = "close";
        userProfileButton.style.color = 'red';
        displayUserCreatedPrivateEvents(userData.UserID);
    }else{
        eventCard.style.display = 'block'
        userEvents.style.display = 'none';
        userProfileButton.innerHTML = userData.FirstName;
        userProfileButton.style.color = 'black';
        // console.log("Event card: " +  eventCard.style.display);
    }
});

const eventPopUpContainer = document.querySelector('.eventPopUpContainer');
const closeEventPopUpButton = document.getElementById("closeEventPopUp");
closeEventPopUpButton.addEventListener('click', function(){
    const userProfile = document.getElementById("userProfile");
    userProfile.innerHTML = userData.FirstName;
    userProfile.style.color = 'black';
    eventPopUpContainer.style.display = 'none';
    eventCard.style.display = 'block';
});

document.addEventListener("DOMContentLoaded", function() {
    const addCommentButton = document.getElementById("addComment");
    const createCommentContainer = document.getElementById("createCommentContainer");
    const closeButton = document.getElementById("CancelComment");

    addCommentButton.addEventListener("click", function() {
        createCommentContainer.style.display = "block";
    });

    closeButton.addEventListener("click", function() {
        createCommentContainer.style.display = "none";
    });
});

function closeEventPopUp() {
    eventPopUpContainer.style.display = 'none';
    eventCard.style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function() {
    const editCommentContainer = document.getElementById("EditCommentContainer");
    editCommentContainer.style.display = 'none';

});

document.addEventListener("DOMContentLoaded", function() {
    const displayOrganizationsContainer = document.querySelector(".displayOrganizationsContainer");
    displayOrganizationsContainer.style.display = 'none';

});

document.addEventListener("DOMContentLoaded", function() {
    const createRSOsContainer = document.querySelector(".createRSOsContainer");
    createRSOsContainer.style.display = 'none';
});







document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener('click', async function(event) {
        if (event.target.classList.contains('eventCard')) {
            const eventCardContainer = document.querySelector('.displayEventsContainer');
            const theUserEvent = document.querySelector('.eventCard');
            theUserEvent.style.display = 'none';
            const eventName = event.target.querySelector('h1');
            const eventDate = event.target.querySelector('h2');
            const eventData = event.target.querySelectorAll('*'); // Select the event card
            let eventTime = null, latitude = null, longitude = null, eventLocation = null, eventType = null, eventID = null;
            const eventTitle = event.target.querySelector('p');
            Array.from(eventData).forEach(child => {
                if (child.textContent.trim().startsWith('Time:')) {
                    // Extract time value
                    const timeText = child.textContent.trim().substring(6);
                    eventTime = timeText; 
                }
                if (child.textContent.trim().startsWith('Longitude:')) {
                    // Extract time value
                    const longitudeText = child.textContent.trim().substring(10);
                    longitude = parseFloat(longitudeText);
                }
                if (child.textContent.trim().startsWith('Latitude:')) {
                    // Extract time value
                    const latitudeText = child.textContent.trim().substring(10);
                    latitude = parseFloat(latitudeText); 
                }
                if (child.textContent.trim().startsWith('Event Location:')) {
                    // Extract time value
                    const eventLocationText = child.textContent;
                    eventLocation = eventLocationText; 
                }
                if (child.textContent.trim().startsWith('Event Type:')) {
                    // Extract time value
                    const eventTypeText = child.textContent;
                    eventType = eventTypeText; 
                }
            });

            const eventPopUpContainer = document.querySelector('.eventPopUpContainer');
            const popUp = eventPopUpContainer.querySelector('.eventPopUp');
            popUp.querySelector('.eventName').textContent = eventName.textContent;
            popUp.querySelector('.eventDate').textContent = eventDate.textContent;
            popUp.querySelector('.eventTime').textContent = 'Time: '+ eventTime;
            popUp.querySelector('.longitude').textContent = 'Longitude: '+longitude;
            popUp.querySelector('.latitude').textContent = 'Latitude: '+latitude;
            popUp.querySelector('.eventLocation').textContent = eventLocation;
            popUp.querySelector('.eventDescription').textContent = eventTitle.textContent;
            popUp.querySelector('.eventType').textContent = eventType;

            let CommenterName = document.querySelector('.commentedUser');
            // let iD;
            // const iD = await searchEvents2(eventTitle.textContent);
            const searchQuery = eventTitle.textContent.substring(0, 50);
            const iD = await searchEvents2(searchQuery);            
            // getAllComments().then(response => iD=response);
            const iDJson = await iD.json();
            eventID = iDJson[0].Events_ID;
            // getAllComments().then(response => console.log("Gettting comments ", response));


            async function fetchComments() {
                const comments = await getAllComments();
                const commentsJson =  JSON.stringify(comments);

                // Parse the JSON string back into an array
                const commentsArray = JSON.parse(commentsJson);
                // const commentsJson = await comments.json();
                const filteredComments = commentsArray.filter(comment => parseInt(comment.CommentedEventID) === parseInt(eventID));
                const commentsContainer = document.querySelector('.commentsContainer');

                
                
                
                if(filteredComments == null || filteredComments == undefined || filteredComments.length == 0){
                    commentsContainer.innerHTML = '';
                }else{
                    commentsContainer.innerHTML = 'Comments:';
                    filteredComments.forEach(comment => {
                        console.log("Comment " +comment);
                        const commentUser = document.createElement('h3');
                        commentUser.textContent = comment.CommentedUser;
                        //commentsContainer.appendChild(commentUser);
    
                        const commentText = document.createElement('p');
                        commentText.textContent = comment.UserComment;
                        // commentsContainer.appendChild(commentText);
    
                        const deleteButton = document.createElement('button');
                        deleteButton.classList.add('deleteCommentButton');
                        deleteButton.innerHTML = '<i class="material-icons">delete</i>';
                        // deleteButton.style.fontSize = '10px';
                        deleteButton.style.border = 'none';
                        deleteButton.style.padding = '0';
                        deleteButton.style.background = 'none';
                        deleteButton.style.fontSize = '0'; // Set font size of icon to 0
                        deleteButton.style.verticalAlign = 'top';
                        deleteButton.style.color = 'red';

                        
                        const editButton = document.createElement('button');
                        editButton.classList.add('editCommentButton');
                        editButton.innerHTML = '<i class="material-icons">edit</i>';
                        editButton.style.border = 'none';
                        editButton.style.padding = '0';
                        editButton.style.fontSize = '0';
                        editButton.style.verticalAlign = 'top';
                        editButton.style.color = 'yellow';
                        editButton.style.background = 'none';
                        
    
    
                        const commentParagraph = document.createElement('div');
                        const commentContent = `${commentUser.textContent} - ${commentText.textContent}`;
                        commentParagraph.textContent = commentContent;

                        if(commentUser.textContent === userData.FirstName){
                            commentParagraph.appendChild(deleteButton);
                            commentParagraph.appendChild(editButton);
                        }
                        commentsContainer.appendChild(commentParagraph);
                    });
                    popUp.querySelector('.commentsContainer').innerHTML = commentsContainer.innerHTML;
                    eventPopUpContainer.style.alignItems = 'center';
                    
                    const deleteCommentButtons = document.querySelectorAll('.deleteCommentButton');
                    
                    deleteCommentButtons.forEach(button => {
                        const deleteButtonClickHandler = async function(event) {
                            const commentText = button.parentElement.textContent.split('-')[1].trim();
                            const commentText1 = commentText.split('deleteedit')[0];
                            const filteredCommentID = commentsArray.filter(comment => (parseInt(comment.CommentedEventID) === parseInt(eventID)) && (comment.UserComment === commentText1));
                            
                            await DeleteComment(filteredCommentID[0].CommentID);
                            alert("Comment Deleted successfully");

                            button.removeEventListener('click', deleteButtonClickHandler);
                            const userProfile = document.getElementById("userProfile");
                            userProfile.innerHTML = userData.FirstName;
                            userProfile.style.color = 'black';
                            eventCardContainer.style.display = 'block';
                            eventPopUpContainer.style.display = 'none';
                            return;
                        };
                    
                        button.removeEventListener('click', deleteButtonClickHandler);
                        button.addEventListener('click', deleteButtonClickHandler);
                    });
                    
                    const editCommentButtons = document.querySelectorAll('.editCommentButton');
                    editCommentButtons.forEach(button => {
                        const editButtonClickHandler = async function(event) {
                            const commentText = button.parentElement.textContent.split('-')[1].trim();
                            const commentText1 = commentText.split('deleteedit')[0];
                            const filteredCommentID = commentsArray.filter(comment => (parseInt(comment.CommentedEventID) === parseInt(eventID)) && (comment.UserComment === commentText1));
                            
                            const editCommentContainer = document.getElementById("EditCommentContainer");
                            const submitComment = document.getElementById("SubmitEditComment");
                            const CommentText = document.getElementById("CommentEditText");
                            CommentText.value = commentText1;
                            
                            editCommentContainer.style.display = 'block';
                            const submitEditButtonClickHandler = async function(event) {
                                await EditComment(CommentText.value, filteredCommentID[0].CommentID);
                                CommentText.value = '';
                                alert("Successfully Edited Comment");
                                editCommentContainer.style.display = 'none';
                                
                                submitComment.removeEventListener('click', submitEditButtonClickHandler);
                                const userProfile = document.getElementById("userProfile");
                                userProfile.innerHTML = userData.FirstName;
                                userProfile.style.color = 'black';
                                eventCardContainer.style.display = 'block';
                                eventPopUpContainer.style.display = 'none';
                                return;
                                
                            }
                            submitComment.removeEventListener('click', submitEditButtonClickHandler);
                            submitComment.addEventListener('click', submitEditButtonClickHandler);


                            const closeButton = document.getElementById("CancelEditComment");
                            const closeEditButtonClickHandler = async function(event) {
                                event.stopPropagation();
                                CommentText.value = '';
                                editCommentContainer.style.display = "none";

                                closeButton.removeEventListener('click', closeEditButtonClickHandler);
                                return;
                            }
                            closeButton.removeEventListener('click', closeEditButtonClickHandler);
                            closeButton.addEventListener('click', closeEditButtonClickHandler);
                        }
                        button.removeEventListener('click', editButtonClickHandler);
                        button.addEventListener('click', editButtonClickHandler);
                    });
                    
                }
            }
            eventCardContainer.style.display = 'none';
            eventPopUpContainer.style.display = 'block';
            fetchComments();
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const SubmitCommentButtons = document.querySelectorAll('.SubmitComment');       
    SubmitCommentButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            const eventCardContainer = document.querySelector('.displayEventsContainer');
            const UserEventContainer = document.querySelector('.userEventsContainer');
            const eventCard = button.closest('.eventPopUp');
            const eventNameElement = eventCard.querySelector('.eventDescription');
            const eventName = eventNameElement.textContent.trim();
            console.log("Event Name: " + eventName);
            const CommentText = document.getElementById("CommentText");

            // const iD = await searchEvents2(eventName);
            const searchQuery = eventName.substring(0, 50);
            const iD = await searchEvents2(searchQuery);
            const iDJson = await iD.json();
            const eventID = iDJson[0].Events_ID;

            if(CommentText.value !== ''){
                await CreateComments(userData.FirstName, CommentText.value, eventID);
            }
            CommentText.value = ''; 
            createCommentContainer.style.display = 'none';
            alert("Comment created successfully");
            const userProfile = document.getElementById("userProfile");
            userProfile.innerHTML = userData.FirstName;
            userProfile.style.color = 'black';
            eventCardContainer.style.display = 'block';
            eventPopUpContainer.style.display = 'none';
            UserEventContainer.style.display = 'none';
            // fetchComments();
            return;
        });
    });
});



document.addEventListener("DOMContentLoaded", function(){
    const UserEventContainer = document.querySelector('.userEventsContainer');
    UserEventContainer.style.display = 'none';
});


document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener('click', async function(event) {
        if (event.target.classList.contains('eventCard')){
            const eventPopUpContainers = document.querySelectorAll('.eventPopUpContainer');
            eventPopUpContainers.forEach(container => {
                const deleteCommentButtons = container.querySelectorAll('.deleteCommentButton');
                deleteCommentButtons.forEach(button => {
                    button.addEventListener('click', async function(event) {
                        const eventCardContainer = document.querySelector('.displayEventsContainer');
                        const UserEventContainer = document.querySelector('.userEventsContainer');
                        const eventNameElement = container.querySelector('.eventDescription');
                        const eventName = eventNameElement.textContent.trim();
                        console.log("Event Name: " + eventName);
                        const CommentText = container.querySelector("#CommentText").value;

                        // const iD = await searchEvents2(eventName);
                        const searchQuery = eventName.substring(0, 50);
                        const iD = await searchEvents2(searchQuery);
                        const iDJson = await iD.json();
                        const eventID = iDJson[0].Events_ID;

                        console.log("Deleting: " + CommentText);
                        await DeleteComment(CommentText, userData.FirstName, eventID);
                        const userProfile = document.getElementById("userProfile");
                        userProfile.innerHTML = userData.FirstName;
                        userProfile.style.color = 'black';
                        eventCardContainer.style.display = 'block';
                        container.style.display = 'none'; 
                        UserEventContainer.style.display = 'none';
                        alert("Comment Deleted successfully");
                        return;
                    });
                });
            });
        }
    });
});



document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener('click', async function(event) {
        if (event.target.classList.contains('userEvents')) {
            const theUserEvent = document.querySelector('.userEvents');
            theUserEvent.style.display = 'none';
            const eventCardContainer = document.querySelector('.displayEventsContainer');
            const eventName = event.target.querySelector('h1');
            const eventDate = event.target.querySelector('h2');
            const eventData = event.target.querySelectorAll('*');
            let eventTime = null, latitude = null, longitude = null, eventLocation = null, eventType = null, eventID = null;
            const eventTitle = event.target.querySelector('p');
            Array.from(eventData).forEach(child => {
                if (child.textContent.trim().startsWith('Time:')) {
                    // Extract time value
                    const timeText = child.textContent.trim().substring(6);
                    eventTime = timeText; 
                }
                if (child.textContent.trim().startsWith('Longitude:')) {
                    // Extract time value
                    const longitudeText = child.textContent.trim().substring(10);
                    longitude = parseFloat(longitudeText);
                }
                if (child.textContent.trim().startsWith('Latitude:')) {
                    // Extract time value
                    const latitudeText = child.textContent.trim().substring(10);
                    latitude = parseFloat(latitudeText); 
                }
                if (child.textContent.trim().startsWith('Event Location:')) {
                    // Extract time value
                    const eventLocationText = child.textContent;
                    eventLocation = eventLocationText; 
                }
                if (child.textContent.trim().startsWith('Event Type:')) {
                    // Extract time value
                    const eventTypeText = child.textContent;
                    eventType = eventTypeText; 
                }
            });

            const eventPopUpContainer = document.querySelector('.eventPopUpContainer');
            const popUp = eventPopUpContainer.querySelector('.eventPopUp');
            popUp.querySelector('.eventName').textContent = eventName.textContent;
            popUp.querySelector('.eventDate').textContent = eventDate.textContent;
            popUp.querySelector('.eventTime').textContent = 'Time: '+ eventTime;
            popUp.querySelector('.longitude').textContent = 'Longitude: '+longitude;
            popUp.querySelector('.latitude').textContent = 'Latitude: '+latitude;
            popUp.querySelector('.eventLocation').textContent = eventLocation;
            popUp.querySelector('.eventDescription').textContent = eventTitle.textContent;
            popUp.querySelector('.eventType').textContent = eventType;

            let CommenterName = document.querySelector('.commentedUser');
            // let iD;
            //const iD = await searchEvents2(eventTitle.textContent);
            const searchQuery = eventTitle.textContent.substring(0, 50);
            const iD = await searchEvents2(searchQuery);
            // getAllComments().then(response => iD=response);
            const iDJson = await iD.json();
            eventID = iDJson[0].Events_ID;
            // getAllComments().then(response => console.log("Gettting comments ", response));


            async function fetchComments() {
                const comments = await getAllComments();
                const commentsJson =  JSON.stringify(comments);

                // Parse the JSON string back into an array
                const commentsArray = JSON.parse(commentsJson);
                // const commentsJson = await comments.json();
                const filteredComments = commentsArray.filter(comment => parseInt(comment.CommentedEventID) === parseInt(eventID));
                const commentsContainer = document.querySelector('.commentsContainer');
                
                
                if(filteredComments == null || filteredComments == undefined || filteredComments.length == 0){
                    commentsContainer.innerHTML = '';
                }else{
                    commentsContainer.innerHTML = 'Comments:';
                    filteredComments.forEach(comment => {
                        console.log("Comment " +comment);
                        const commentUser = document.createElement('h3');
                        commentUser.textContent = comment.CommentedUser;
                        //commentsContainer.appendChild(commentUser);
    
                        const commentText = document.createElement('p');
                        commentText.textContent = comment.UserComment;
                        // commentsContainer.appendChild(commentText);
    
                        const deleteButton = document.createElement('button');
                        deleteButton.classList.add('deleteCommentButton');
                        deleteButton.innerHTML = '<i class="material-icons">delete</i>';
                        // deleteButton.style.fontSize = '10px';
                        deleteButton.style.border = 'none';
                        deleteButton.style.padding = '0';
                        deleteButton.style.background = 'none';
                        deleteButton.style.fontSize = '0'; // Set font size of icon to 0
                        deleteButton.style.verticalAlign = 'top';
                        deleteButton.style.color = 'red';

                        
                        const editButton = document.createElement('button');
                        editButton.classList.add('editCommentButton');
                        editButton.innerHTML = '<i class="material-icons">edit</i>';
                        editButton.style.border = 'none';
                        editButton.style.padding = '0';
                        editButton.style.fontSize = '0';
                        editButton.style.verticalAlign = 'top';
                        editButton.style.color = 'yellow';
                        editButton.style.background = 'none';
                        
    
    
                        const commentParagraph = document.createElement('div');
                        const commentContent = `${commentUser.textContent} - ${commentText.textContent}`;
                        commentParagraph.textContent = commentContent;

                        if(commentUser.textContent === userData.FirstName){
                            commentParagraph.appendChild(deleteButton);
                            commentParagraph.appendChild(editButton);
                        }
                        commentsContainer.appendChild(commentParagraph);
                    });
                    popUp.querySelector('.commentsContainer').innerHTML = commentsContainer.innerHTML;
                    eventPopUpContainer.style.alignItems = 'center';
                    
                    const deleteCommentButtons = document.querySelectorAll('.deleteCommentButton');
                    
                    deleteCommentButtons.forEach(button => {
                        const deleteButtonClickHandler = async function(event) {
                            const commentText = button.parentElement.textContent.split('-')[1].trim();
                            const commentText1 = commentText.split('deleteedit')[0];
                            const filteredCommentID = commentsArray.filter(comment => (parseInt(comment.CommentedEventID) === parseInt(eventID)) && (comment.UserComment === commentText1));
                            
                            await DeleteComment(filteredCommentID[0].CommentID);
                            alert("Comment Deleted successfully");

                            button.removeEventListener('click', deleteButtonClickHandler);
                            const userProfile = document.getElementById("userProfile");
                            userProfile.innerHTML = userData.FirstName;
                            userProfile.style.color = 'black';
                            eventCardContainer.style.display = 'block';
                            eventPopUpContainer.style.display = 'none';
                            return;
                        };
                    
                        button.removeEventListener('click', deleteButtonClickHandler);
                        button.addEventListener('click', deleteButtonClickHandler);
                    });
                    
                    const editCommentButtons = document.querySelectorAll('.editCommentButton');
                    editCommentButtons.forEach(button => {
                        const editButtonClickHandler = async function(event) {
                            const commentText = button.parentElement.textContent.split('-')[1].trim();
                            const commentText1 = commentText.split('deleteedit')[0];
                            const filteredCommentID = commentsArray.filter(comment => (parseInt(comment.CommentedEventID) === eventID) && (comment.UserComment === commentText1));
                            
                            const editCommentContainer = document.getElementById("EditCommentContainer");
                            const submitComment = document.getElementById("SubmitEditComment");
                            const CommentText = document.getElementById("CommentEditText");
                            CommentText.value = commentText1;
                            
                            editCommentContainer.style.display = 'block';
                            const submitEditButtonClickHandler = async function(event) {
                                await EditComment(CommentText.value, filteredCommentID[0].CommentID);
                                CommentText.value = '';
                                alert("Successfully Edited Comment");
                                editCommentContainer.style.display = 'none';
                                
                                submitComment.removeEventListener('click', submitEditButtonClickHandler);
                                const userProfile = document.getElementById("userProfile");
                                userProfile.innerHTML = userData.FirstName;
                                userProfile.style.color = 'black';
                                eventCardContainer.style.display = 'block';
                                eventPopUpContainer.style.display = 'none';
                                return;
                                
                            }
                            submitComment.removeEventListener('click', submitEditButtonClickHandler);
                            submitComment.addEventListener('click', submitEditButtonClickHandler);


                            const closeButton = document.getElementById("CancelEditComment");
                            const closeEditButtonClickHandler = async function(event) {
                                event.stopPropagation();
                                CommentText.value = '';
                                editCommentContainer.style.display = "none";

                                closeButton.removeEventListener('click', closeEditButtonClickHandler);
                                return;
                            }
                            closeButton.removeEventListener('click', closeEditButtonClickHandler);
                            closeButton.addEventListener('click', closeEditButtonClickHandler);
                        }
                        button.removeEventListener('click', editButtonClickHandler);
                        button.addEventListener('click', editButtonClickHandler);
                    });
                    
                }
            }
            eventCardContainer.style.display = 'none';
            eventPopUpContainer.style.display = 'block';
            fetchComments();
        }
    });
});




function displayUserCreatedPrivateEvents(){  
    fetch('http://unieventverse.com/LAMPAPI/GetAllEvents.php')
    .then(response => response.json())
    .then(events => {
        fetchLocations()
        .then(async locations => {
            locationsData = locations; // Store locations data globally
            const displayEventsUserPrivateContainer = document.querySelector('.userEventsContainer');
            displayEventsUserPrivateContainer.innerHTML = '';

            const privateEventsData = await getPrivateEvents();
            // console.log(privateEventsData);
            const privateEventIDs = new Set(privateEventsData.map(event => event.SuperAdminID));
            // if the usedoesn't have any private events 
            if(!(privateEventIDs.has(userData.UserID.toString()))){
                const userProfileButton = document.querySelector('.userProfile');
                const eventCard = document.querySelector('.displayEventsContainer');
                const userEvents = document.querySelector('.userEventsContainer');
                // console.log(displayEventsUserPrivateContainer);
                alert("You don't have any private events, please create one");
                eventCard.style.display = 'block'
                userEvents.style.display = 'none';
                userProfileButton.innerHTML = userData.FirstName;
                userProfileButton.style.color = 'black';
            }else{
                // Loop through each event and create HTML elements to display them
                events.forEach(async event => {
                    // if(event.UserID === userID){
                        
                        const eventCard = await createUserEventCard(event, locationsData); // Pass locations data
                        if(eventCard != null && eventCard != undefined){
                            displayEventsUserPrivateContainer.insertBefore(eventCard, displayEventsUserPrivateContainer.lastChild);
                            // displayEventsUserPrivateContainer.appendChild(eventCard);
                            // Set height of event card based on description height
                            const descriptionHeight = eventCard.querySelector('.eventDescription').clientHeight;
                            eventCard.style.height = eventCard.style.height + 40 + '%';
                        }
                        
                    // }
                });
            }
            
            
            
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching events:', error);
    });
}
async function createUserEventCard(event, locations) {
    const privateEventsData = await getPrivateEvents();
    // console.log(privateEventsData);
    const privateIDs = new Set(privateEventsData.map(event => event.EventID));
    const privateEventIDs = new Set(privateEventsData.map(event => event.SuperAdminID));
    
    if(privateEventIDs.has(userData.UserID.toString()) && (privateIDs.has(event.EventID))){
        const eventCard = document.createElement('div');
        eventCard.classList.add('userEvents');
        

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
        
        eventType.classList.add('eventType');
        eventType.textContent = "\tEvent Type: " + (privateEventIDs.has(userData.UserID.toString()) ? 'Private' : 'Public');

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
    
    
}


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
        // console.log(JSON.stringify(userData.UserID));
        // console.log(userData.UserID.toString());

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
            events.forEach(async event => {
                const eventCard = await createEventCard(event, locationsData); // Pass locations data
                displayEventsContainer.insertBefore(eventCard, displayEventsContainer.lastChild);

                // Set height of event card based on description height
                const descriptionHeight = eventCard.querySelector('.eventDescription').clientHeight;
                eventCard.style.height = eventCard.style.height + 40 + '%';
            });
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching events:', error);
    });
    // displayComments();
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
            eventCard.style.height = eventCard.style.height + 40 + '%';
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
        // console.log(response);

        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw error; 
    }
}


async function getAllComments() {
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/GetAllComments.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        // console.log(response);

        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw error; 
    }
}

async function CreateComments(name, comment, eventID) {
    const commentData = {
        CommentedUser: name,
        UserComment: comment,
        CommentedEventID: parseInt(eventID)
    }
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/CreateComment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        // console.log(response);

        // const data = await response.json();
        
        // return data;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw error; 
    }
}

async function DeleteComment(commentID) {
    const commentData = {
        CommentID: commentID
    }
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/DeleteComment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        // console.log(response);

        // const data = await response.json();
        
        // return data;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw error; 
    }
}

async function EditComment(newComment, commentID) {
    const commentData = {
        UserComment: newComment,
        CommentID: commentID
    }
    try {
        const response = await fetch('http://unieventverse.com/LAMPAPI/EditComment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        // console.log(response);

        // const data = await response.json();
        
        // return data;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw error; 
    }
}




