// FILTERABLE GALLERY https://www.bijanrai.com.np/2023/10/filterable-image-gallery.html
function handleFiltering() {
    var filterContainer = document.querySelector(".gallery-filter");
    var galleryItems = document.querySelectorAll(".gallery-item");
    var isFirstClick = true;
    var activeFilterItem = null;

    function removeAllActiveClasses() {
        filterContainer.querySelectorAll(".filter-item").forEach(function (item) {
            item.classList.remove("active");
        });
    }

    function filterGalleryItems(filterValue) {
        galleryItems.forEach(function (item) {
            if (filterValue === 'all' || item.id === filterValue) {
                item.classList.remove("hide");
                item.classList.add("show");
            } else {
                item.classList.remove("show");
                item.classList.add("hide");
            }
        });
    }

    filterContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("filter-item")) {
            var filterValue = event.target.getAttribute("data-filter");

            if (isFirstClick) {
                removeAllActiveClasses();
                event.target.classList.add("active");
                activeFilterItem = event.target;
                filterGalleryItems(filterValue);
                isFirstClick = false;
            } else {
                if (event.target === activeFilterItem) {
                    removeAllActiveClasses();
                    allFilterItem.classList.add("active");
                    filterValue = 'all';
                    filterGalleryItems(filterValue);
                    isFirstClick = true;
                } else {
                    removeAllActiveClasses();
                    event.target.classList.add("active");
                    activeFilterItem = event.target;
                    filterGalleryItems(filterValue);
                    isFirstClick = false;
                }
            }
        }
    });

    var allFilterItem = filterContainer.querySelector("[data-filter='all']");
    allFilterItem.classList.add("active");
}

handleFiltering();

// MODAL https://www.w3schools.com/howto/howto_css_modals.asp
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

btn.addEventListener("click", openModal);
span.addEventListener("click", closeModal);

window.addEventListener("click", function (event) {
  if (event.target == modal) {
    closeModal();
  }
});

// POST

document.getElementById("add-item-form").addEventListener("submit", function (event) {
  event.preventDefault(); 

  var formData = {
    name: document.getElementById("name").value,
    year: document.getElementById("year").value,
    poster: document.getElementById("poster").value,
    genre: document.getElementById("genre").value,
    description: document.getElementById("description").value
  };

  const url = 'https://webtech.labs.vu.nl/api24/45bc18aa';

  let request = new Request(url, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: new Headers({
      'Content-Type': 'application/json; charset=UTF-8'
    })
  });

  fetch(request)
    .then(function (response) {
      if (response.ok) {
        console.log('Item added successfully');
        closeModal(); 
      } else {
        console.error('Error adding item');
      }
    })
    .catch(function (error) {
      console.error('Fetch error:', error);
    });
});

// GET 

const url = 'https://webtech.labs.vu.nl/api24/45bc18aa';

fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (data.length > 0) {
        data.forEach(author => {
            let gallerySpan = document.createElement('span');
            gallerySpan.className = 'filter-item';
            gallerySpan.setAttribute('data-filter', `${author.year}`);
            gallerySpan.innerHTML = `${author.year}`;
        
            document.querySelector('.gallery-filter').appendChild(gallerySpan);
        });
        

        data.forEach(author => {

            let galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.id = `${author.year}`;

            let galleryItemInner = document.createElement('div');
            galleryItemInner.className = 'gallery-item-inner';

            let search = document.createElement('div');
            search.className = 'search';

            let name = document.createElement('div');
            name.innerHTML = `${author.name}`;

            let year = document.createElement('div');
            year.innerHTML = `${author.year}`;

            let genre = document.createElement('div');
            genre.innerHTML = `${author.genre}`;

            let poster = document.createElement('img');
            poster.src = `${author.poster}`;

            let description = document.createElement('p');
            description.innerHTML = `${author.description}`;

            search.appendChild(name);
            search.appendChild(year);
            search.appendChild(genre);

            galleryItemInner.appendChild(search);
            galleryItemInner.appendChild(poster);
            galleryItemInner.appendChild(description);

            galleryItem.appendChild(galleryItemInner);

            let updateButton = document.createElement('button');
            updateButton.innerHTML = 'Update';
            updateButton.id = `updateButton_${author.id}`;
            updateButton.addEventListener('click', function() {
            updateItem(author.id); 
            });

            galleryItemInner.appendChild(updateButton);

            document.querySelector('.row').appendChild(galleryItem);
        });

    } else {
      console.log('No authors found in the response.');
    }
    handleFiltering();
  })
  .catch(function (error) {
    console.log(error);
  });

// RESET BUTTON

document.getElementById("resetBtn").addEventListener("click", function () {
    const resetUrl = 'https://webtech.labs.vu.nl/api24/45bc18aa/reset';
  
    fetch(resetUrl, {
      method: 'GET',
    })
    .then(response => {
      if (response.ok) {
        console.log('Database reset successfully');
        
      } else {
        console.error('Error resetting database');
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
  });

// UPDATE BUTTON  

function updateItem(itemId) {
    // Assuming the endpoint for updating an item is https://webtech.labs.vu.nl/api24/45bc18aa/item/{itemId}
    const updateUrl = `https://webtech.labs.vu.nl/api24/45bc18aa/item/${itemId}`;

    openModal();
    var nameInput = document.getElementById("name");
    var yearInput = document.getElementById("year");
    var posterInput = document.getElementById("poster");
    var genreInput = document.getElementById("genre");
    var descriptionInput = document.getElementById("description");

    document.getElementById("add-item-form").addEventListener("submit", function (event) {
        event.preventDefault();

        var updatedFormData = {
            name: nameInput.value,
            year: yearInput.value,
            poster: posterInput.value,
            genre: genreInput.value,
            description: descriptionInput.value
        };

        let updateRequest = new Request(updateUrl, {
            method: 'PUT',
            body: JSON.stringify(updatedFormData),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        });

        fetch(updateRequest)
            .then(function (response) {
                if (response.ok) {
                    console.log(`Item with ID ${itemId} updated successfully`);
                    closeModal(); 
                } else {
                    console.error(`Error updating item with ID ${itemId}`);
                }
            })
            .catch(function (error) {
                console.error('Fetch error:', error);
            });
    });
}

  
  function searchFunction() {
    var input, filter, gallery, items, i, name;
    input = document.getElementById('searchInput');
    filter = input.value.replace(/\s/g, '').toUpperCase();
    
    gallery = document.querySelector('.container-gallery');
    items = gallery.getElementsByClassName('gallery-item');
  
    for (i = 0; i < items.length; i++) {
      name = items[i].querySelector('.search').innerText.replace(/\s/g, '').toUpperCase();
      genre = items[i].querySelector('.search').innerText.replace(/\s/g, '').toUpperCase();
      if (name.includes(filter) || genre.includes(filter)) {
        items[i].style.display = "";
      } 
      else if (name.includes(filter) && genre.includes(filter)) {
        items[i].style.display = "";
      }
      else {
        items[i].style.display = "none";
      }
    }
  }
  
  
  
  
  
  
