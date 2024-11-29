// Check for saved theme preference in localStorage when the page loads
window.onload = function() {
    // Get the stored theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    const username = document.getElementById("username");
      if (username){
        username.focus();
      }
    if (savedTheme) {
        // Apply the saved theme
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode', 'bg-dark', 'text-light');
            const navbar = document.getElementById('navbar');
            navbar.classList.add('navbar-dark', 'bg-dark');
            navbar.classList.remove('navbar-light', 'bg-white');
            document.getElementById('theme-toggle').innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
            const inputs= document.querySelectorAll("input");
            inputs.forEach(input => {
              input.classList.add('text-light', 'bg-dark');  // Remove the dark theme classes
              input.classList.remove('text-dark', 'bg-light');    // Add the light theme classes
            });
        } else {
            document.body.classList.add('bg-light', 'text-dark');
            const navbar = document.getElementById('navbar');
            navbar.classList.add('navbar-light', 'bg-white');
            navbar.classList.remove('navbar-dark', 'bg-dark');
            document.getElementById('theme-toggle').innerHTML = '<i class="bi bi-sun-fill"></i>';
            const inputs= document.querySelectorAll("input");
            inputs.forEach(input => {
              input.classList.remove('text-light', 'bg-dark');  // Remove the dark theme classes
              input.classList.add('text-dark', 'bg-light');    // Add the light theme classes
            });
        }
    } else {
        // If no saved theme, default to light mode
        document.body.classList.add('bg-light', 'text-dark');
        const navbar = document.getElementById('navbar');
        navbar.classList.add('navbar-light', 'bg-white');
        navbar.classList.remove('navbar-dark', 'bg-dark');
        document.getElementById('theme-toggle').innerHTML = '<i class="bi bi-sun-fill"></i>';
    }
};

// Toggle theme and save the preference in localStorage
function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');

    if (isDarkMode) {
        // Switch to light mode
        document.body.classList.remove('dark-mode', 'bg-dark', 'text-light');
        document.body.classList.add('bg-light', 'text-dark'); // Light theme for the body
        
        // Update navbar to light theme
        const navbar = document.getElementById('navbar');
        navbar.classList.remove('navbar-dark', 'bg-dark');
        navbar.classList.add('navbar-light', 'bg-white'); 
        const inputs = document.querySelectorAll("input");

        // Loop through each input element and update its classList
        inputs.forEach(input => {
            input.classList.remove('text-light', 'bg-dark');  // Remove the dark theme classes
            input.classList.add('text-dark', 'bg-light');    // Add the light theme classes
        });

        // Change button text
        document.getElementById('theme-toggle').innerHTML = '<i class="bi bi-sun-fill"></i>';
        
        // Save light mode preference in localStorage
        localStorage.setItem('theme', 'light');
    } else {
        // Switch to dark mode
        document.body.classList.add('dark-mode', 'bg-dark', 'text-light'); // Dark theme for the body
        document.body.classList.remove("text-dark")
        // Update navbar to dark theme
        const navbar = document.getElementById('navbar');
        navbar.classList.add('navbar-dark', 'bg-dark'); // Dark theme for the navbar
        navbar.classList.remove('navbar-light', 'bg-white'); // Remove light theme classes from navbar
        const inputs= document.querySelectorAll("input");
        inputs.forEach(input => {
          input.classList.add('text-light', 'bg-dark');  // Remove the dark theme classes
          input.classList.remove('text-dark', 'bg-light');    // Add the light theme classes
        });
        // Change button text
        document.getElementById('theme-toggle').innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
        
        // Save dark mode preference in localStorage
        localStorage.setItem('theme', 'dark');
    }
}



// const usernameInput = document.getElementById("search");
// const userDrop = document.getElementById("dropdown-list");
// const nameContainer = document.getElementById("name-container");

// let draggedElement = null;

// // Handle search input and dropdown list
// usernameInput.addEventListener("keyup", function(event) {
//     const username = this.value;
    
//     // Start searching after 3 characters
//     if (username.length > 3) {
//         fetch(`/get_user?user=${encodeURIComponent(username)}`)
//         .then(response => response.json())  // Assuming the server responds with JSON
//         .then(data => {
//             const userlist = data.users;
//             userDrop.innerHTML = "";  // Clear previous results

//             if (userlist.length > 0) {
//                 userDrop.style.display = 'block'; // Show the dropdown

//                 let maxWidth = 0;
//                 userlist.forEach(user => {
//                     const userDropEntry = document.createElement("li");
//                     userDropEntry.classList.add("list-group-item", "list-group-item-action");
//                     userDropEntry.textContent = user["fullname"];

//                     maxWidth = Math.max(maxWidth, userDropEntry.textContent.length);

//                     // Add event listener for selecting a name
//                     userDropEntry.addEventListener('click', () => {
//                         addNameToContainer(user["fullname"]);
//                         usernameInput.value = '';  // Reset search input
//                     });

//                     userDrop.appendChild(userDropEntry);
//                 });

//                 // Set the dropdown width based on the longest name
//                 userDrop.style.width = `${maxWidth + 2}ch`;
//             } else {
//                 userDrop.style.display = 'none'; // Hide the dropdown if no users
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching user:", error); // Handle any errors
//         });
//     } else {
//         userDrop.style.display = 'none'; // Hide dropdown if less than 3 characters
//     }
// });

// // Add the name to the container and set it draggable
// const addNameToContainer = (name) => {
//     // Create the original element (this stays in place)
//     const div = document.createElement('div');
//     div.classList.add('name-item', 'badge', 'bg-primary', 'text-white', 'p-2', 'm-2');
//     div.textContent = name;
//     div.setAttribute('id', `name-${Date.now()}`); // Unique ID for each element

//     // Append the original element to the container
//     nameContainer.appendChild(div);

//     // Create a draggable copy of the name (this will be moved)
//     const draggableCopy = div.cloneNode(true);  // Clone the original div
//     draggableCopy.classList.add('draggable');
//     draggableCopy.setAttribute('draggable', 'true');  // Make the copy draggable

//     // Apply touch events for mobile and mouse events for desktop
//     draggableCopy.addEventListener('mousedown', startDrag);  // Mouse down for desktop
//     draggableCopy.addEventListener('touchstart', startDragTouch);  // Touch start for mobile

//     // Append the draggable copy to the body (so it can be dragged anywhere)
//     document.body.appendChild(draggableCopy);

//     userDrop.style.display = 'none';  // Hide dropdown after selection
// };

// // Start drag (for desktop mouse)
// function startDrag(event) {
//     draggedElement = event.target;
//     event.preventDefault();  // Prevent default behavior (e.g., text selection)

//     // Position the element absolutely when dragging
//     draggedElement.style.position = 'absolute';
//     document.addEventListener('mousemove', drag);  // Mouse move for dragging
//     document.addEventListener('mouseup', stopDrag);  // Mouse up to stop dragging
// }

// // Start drag (for mobile touch)
// function startDragTouch(event) {
//     draggedElement = event.target;
//     event.preventDefault();  // Prevent default behavior (e.g., text selection)

//     // Position the element absolutely when dragging
//     draggedElement.style.position = 'absolute';
//     const touch = event.touches[0];
//     draggedElement.style.left = `${touch.pageX - draggedElement.offsetWidth / 2}px`;
//     draggedElement.style.top = `${touch.pageY - draggedElement.offsetHeight / 2}px`;

//     document.addEventListener('touchmove', dragTouch);  // Touch move for dragging
//     document.addEventListener('touchend', stopDragTouch);  // Touch end to stop dragging
// }

// // Handle mouse drag (desktop)
// function drag(event) {
//     if (draggedElement) {
//         draggedElement.style.left = `${event.pageX - draggedElement.offsetWidth / 2}px`;
//         draggedElement.style.top = `${event.pageY - draggedElement.offsetHeight / 2}px`;
//     }
// }

// // Handle touch drag (mobile)
// function dragTouch(event) {
//     if (draggedElement) {
//         const touch = event.touches[0];
//         draggedElement.style.left = `${touch.pageX - draggedElement.offsetWidth / 2}px`;
//         draggedElement.style.top = `${touch.pageY - draggedElement.offsetHeight / 2}px`;
//     }
// }

// // Stop drag (for desktop)
// function stopDrag() {
//     if (draggedElement) {
//         document.removeEventListener('mousemove', drag);
//         document.removeEventListener('mouseup', stopDrag);
//         draggedElement = null;  // Reset dragged element
//     }
// }

// // Stop drag (for mobile)
// function stopDragTouch() {
//     if (draggedElement) {
//         document.removeEventListener('touchmove', dragTouch);
//         document.removeEventListener('touchend', stopDragTouch);
//         draggedElement = null;  // Reset dragged element
//     }
// }
