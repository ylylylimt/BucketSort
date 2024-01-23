// MENU

const hamburger_menu = document.querySelector(".hamburger-menu");
const container = document.querySelector(".container");

hamburger_menu.addEventListener("click", () => {
  container.classList.toggle("active");
});

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

// SORTING

function sortYears() {
  var filterContainer = document.querySelector(".gallery-filter");
  var years = [];

  filterContainer.querySelectorAll(".filter-item[data-filter]").forEach(function (item) {
      var year = parseInt(item.getAttribute("data-filter"), 10);
      if (!isNaN(year) && years.indexOf(year) === -1) {
          years.push(year);
      }
  });

  years.sort(function (a, b) {
      return a - b;
  });

  var allFilterItem = filterContainer.querySelector("[data-filter='all']");
  filterContainer.insertBefore(allFilterItem, filterContainer.firstChild);

  filterContainer.querySelectorAll(".filter-item[data-filter]").forEach(function (item) {
      item.parentNode.removeChild(item);
  });

  years.forEach(function (year) {
      var filterItem = document.createElement("span");
      filterItem.className = "filter-item";
      filterItem.setAttribute("data-filter", year.toString());
      filterItem.textContent = year.toString();
      filterContainer.appendChild(filterItem);
  });

  allFilterItem.classList.add("active");
  filterContainer.appendChild(allFilterItem);
}

sortYears();

// SEARCHING

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

// MODAL https://www.w3schools.com/howto/howto_css_modals.asp

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

function openModal() {
modal.style.display = "block";
}

function closeModal() {
modal.style.display = "none";
}

document.getElementById("myBtn").addEventListener("click", openModal);
span.addEventListener("click", closeModal);

window.addEventListener("click", function (event) {
if (event.target == modal) {
  closeModal();
}
});

// ADD NEW ITEM TO SERVER

async function addItem(event) {
  event.preventDefault();

  var formData = {
    name: document.getElementById("name").value,
    year: document.getElementById("year").value,
    poster: document.getElementById("poster").value,
    genre: document.getElementById("genre").value,
    description: document.getElementById("description").value
  };

  const url = 'https://webtech.labs.vu.nl/api24/45bc18aa';

  try {
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });

    if (response.ok) {
      console.log('Item added successfully');
      document.getElementById("add-item-form").reset();
      closeModal();
      console.log('Model successfully');
      await fetchDataAndPopulateGallery(url);
      console.log('Gallery populted successfully');
    } else {
      console.error('Error adding item');
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  let form = document.querySelector("#add-item-form");
  form.addEventListener("submit", addItem);
});

// UPLOAD ITEM FROM SERVER

async function fetchDataAndPopulateGallery(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    let galleryContainer = document.querySelector('.row');
    if (!galleryContainer) {
      galleryContainer = document.createElement('div');
      galleryContainer.className = 'row';
      document.querySelector('.container-gallery').appendChild(galleryContainer);
    }

    let galleryDefaultContainer = document.querySelector('.row-default');
    if (!galleryDefaultContainer) {
      galleryDefaultContainer = document.createElement('div');
      galleryDefaultContainer.className = 'row-default';
      document.querySelector('.container-gallery').appendChild(galleryDefaultContainer); 
    }

    galleryContainer.innerHTML = '';
    galleryDefaultContainer.innerHTML = '';

    if (data.length > 0) {
      data.forEach((author, index) => {
        let gallerySpan = document.createElement('span');
        gallerySpan.className = 'filter-item';
        gallerySpan.setAttribute('data-filter', `${author.year}`);
        gallerySpan.innerHTML = `${author.year}`;

        document.querySelector('.gallery-filter').appendChild(gallerySpan);

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
        updateButton.className = 'button';
        updateButton.addEventListener('click', function() {
          updateItem(author.id); 
        });

        galleryItemInner.appendChild(updateButton);

        if (index < 9) {
          document.querySelector('.row-default').appendChild(galleryItem);
        } else {
          document.querySelector('.row').appendChild(galleryItem);
        }
      });
    } else {
      console.log('No authors found in the response.');
    }
    handleFiltering();
    sortYears();
  } catch (error) {
    console.log(error);
  }
} 

// RESET 

async function resetData() {
  const resetUrl = 'https://webtech.labs.vu.nl/api24/45bc18aa/reset';

  try {
    const response = await fetch(resetUrl, {
      method: 'GET',
    });

    if (response.ok) {
      console.log('Data reset successfully');
      var userUploadedDataElements = document.querySelectorAll('.row');
      userUploadedDataElements.forEach(element => {
        element.remove();
      });

      await fetchDataAndPopulateGallery('https://webtech.labs.vu.nl/api24/45bc18aa');
    } else {
      console.error('Error resetting data:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
  handleFiltering();
  sortYears();
}

document.getElementById("resetBtn").addEventListener("click", resetData);

// UPLOAD DATA ON PAGE

document.addEventListener('DOMContentLoaded', () => {
  fetchDataAndPopulateGallery('https://webtech.labs.vu.nl/api24/45bc18aa');
});

// UPDATE

async function updateItem(authorId) {
  const updateUrl = `https://webtech.labs.vu.nl/api24/45bc18aa/item/${authorId}`;
  
  try {
      const response = await fetch(updateUrl);
      const existingItemData = await response.json();

      const updatedName = prompt('Enter updated name:', existingItemData.name);
      const updatedYear = prompt('Enter updated year:', existingItemData.year);
      const updatedPoster = prompt('Enter updated poster URL:', existingItemData.poster);
      const updatedGenre = prompt('Enter updated genre:', existingItemData.genre);
      const updatedDescription = prompt('Enter updated description:', existingItemData.description);

      const updatedFormData = {
          name: updatedName,
          year: updatedYear,
          poster: updatedPoster,
          genre: updatedGenre,
          description: updatedDescription
      };

      try {
          const updateResponse = await fetch(updateUrl, {
              method: 'PUT',
              body: JSON.stringify(updatedFormData),
              headers: {
                  'Content-Type': 'application/json; charset=UTF-8'
              }
          });

          if (updateResponse.ok) {
              console.log('Item updated successfully');

              await fetchDataAndPopulateGallery('https://webtech.labs.vu.nl/api24/45bc18aa');
          } else {
              console.error('Error updating item:', updateResponse.status, updateResponse.statusText);
          }
      } catch (updateError) {
          console.error('Update fetch error:', updateError);
      }

  } catch (fetchError) {
      console.error('Fetch error:', fetchError);
  }
  handleFiltering();
  sortYears();
}
