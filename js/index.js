document.addEventListener('DOMContentLoaded', () => {
    // Global variables to store data
    let currentUser = { id: 1, username: 'pouros' }; // Example user. You can change this.
    let currentBook = null;
  
    // Fetch the list of books and display them
    function fetchBooks() {
      fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(books => {
          const list = document.getElementById('list');
          list.innerHTML = ''; // Clear the list before adding new books
          books.forEach(book => {
            const li = document.createElement('li');
            li.textContent = book.title;
            li.addEventListener('click', () => showBookDetails(book));
            list.appendChild(li);
          });
        });
    }
  
    // Show details of the selected book
    function showBookDetails(book) {
      currentBook = book; // Store the selected book for liking/unliking
      const showPanel = document.getElementById('show-panel');
      showPanel.innerHTML = ''; // Clear previous details
      
      const h3 = document.createElement('h3');
      h3.textContent = book.title;
      
      const thumbnail = document.createElement('img');
      thumbnail.src = book.thumbnailUrl;
      thumbnail.alt = book.title;
      
      const description = document.createElement('p');
      description.textContent = book.description;
      
      const usersList = document.createElement('ul');
      book.users.forEach(user => {
        const userLi = document.createElement('li');
        userLi.textContent = user.username;
        usersList.appendChild(userLi);
      });
      
      const likeButton = document.createElement('button');
      likeButton.textContent = 'Like';
      likeButton.addEventListener('click', () => toggleLike(book, likeButton));
      
      showPanel.appendChild(h3);
      showPanel.appendChild(thumbnail);
      showPanel.appendChild(description);
      showPanel.appendChild(usersList);
      showPanel.appendChild(likeButton);
    }
  
    // Toggle like/unlike
    function toggleLike(book, likeButton) {
      const userIndex = book.users.findIndex(user => user.id === currentUser.id);
      
      if (userIndex === -1) {
        // User hasn't liked the book yet, add them to the list
        book.users.push(currentUser);
        likeButton.textContent = 'Unlike';
      } else {
        // User has already liked the book, remove them from the list
        book.users.splice(userIndex, 1);
        likeButton.textContent = 'Like';
      }
      
      // Send PATCH request to update the book on the server
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users: book.users })
      })
      .then(response => response.json())
      .then(updatedBook => {
        // After updating, update the users list displayed
        showBookDetails(updatedBook);
      });
    }
  
    // Initial fetch of books when the page loads
    fetchBooks();
  });
