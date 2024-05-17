
//! Selecting DOM elements
const siteName = document.getElementById("bookmarkName");
const siteURL = document.getElementById("bookmarkURL");
const submitBtn = document.getElementById("submitBtn");
const tableContent = document.getElementById("tableContent");
const closeBtn = document.getElementById("closeBtn");
const boxModal = document.querySelector(".box-info");
const search = document.getElementById("searchByName");
let bookmarks = [];

//! LocalStorage: Load bookmarks on page load
if (localStorage.getItem("bookmarksList")) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  for (let i = 0; i < bookmarks.length; i++) {
    displayBookmark(i);
  }
}

//! Display Function: Renders bookmarks and adds click events
function displayBookmark(index) {
  const userURL = bookmarks[index].siteURL;
  let validURL;
  const httpsRegex = /^https?:\/\//;

  if (httpsRegex.test(userURL)) {
    validURL = userURL;
  } else {
    validURL = `https://${userURL}`;
  }

  const newBookmark = `
    <tr>
      <td>${index + 1}</td>
      <td>${bookmarks[index].siteName}</td>              
      <td><button onclick="visitWebsite(${index})" class="btn btn-visit"><i class="fa-solid fa-eye me-2"></i>Visit</button></td>
      <td><button onclick="updateBookmark(${index})" class=" btn bg-info text-white"><i class="fa-solid fa-pen me-2"></i>Update</button></td>
      <td><button onclick="deleteBookmark(${index})"  class="btn btn-delete"><i class="fa-solid fa-trash me-2"></i>Delete</button></td>
    </tr>`;

  tableContent.innerHTML += newBookmark;
}

//! Clear Input Function
function clearInput() {
  siteName.value = "";
  siteURL.value = "";
}

//! Capitalize Function
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//! Submit Function
submitBtn.onclick = function () {
  const siteNameValue = siteName.value.trim();
  const siteURLValue = siteURL.value.trim();

  if (siteName.classList.contains("is-valid") && siteURL.classList.contains("is-valid")) {
    let urlExists = false;
    for (let i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i].siteURL === siteURLValue) {
        urlExists = true;
        break;
      }
    }

    if (urlExists) {
      alert("This URL already exists in the bookmarks list.");
    } else {
      const bookmark = { siteName: capitalize(siteNameValue), siteURL: siteURLValue };
      bookmarks.push(bookmark);
      localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
      displayBookmark(bookmarks.length - 1);
      clearInput();
      siteName.classList.remove("is-valid");
      siteURL.classList.remove("is-valid");
    }
  } else {
    boxModal.classList.remove("d-none");
  }
};

//! Search Function
search.oninput = function () {
  const searchValue = search.value.toLowerCase();
  tableContent.innerHTML = "";
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].siteName.toLowerCase().includes(searchValue)) {
      displayBookmark(i);
    }
  }
};

//! Update Function
function updateBookmark(index) {
  const newName = prompt("Enter the new site name:", bookmarks[index].siteName);
  if (newName && newName.trim().length >= 3) {
    bookmarks[index].siteName = capitalize(newName.trim());
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    refreshBookmarks();
  } else {
    alert("Site name must contain at least 3 characters.");
  }
}

//! Delete Function
function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
  refreshBookmarks();
}

//! Refresh Bookmarks
function refreshBookmarks() {
  tableContent.innerHTML = "";
  for (let i = 0; i < bookmarks.length; i++) {
    displayBookmark(i);
  }
}

//! Visit Function
function visitWebsite(index) {
  const httpsRegex = /^https?:\/\//;
  const urlToVisit = httpsRegex.test(bookmarks[index].siteURL) ? bookmarks[index].siteURL : `https://${bookmarks[index].siteURL}`;
  window.open(urlToVisit, '_blank');
}

//! Validate Function
const nameRegex = /^\w{3,}(\s+\w+)*$/;
const urlRegex = /^(https?:\/\/)?(www\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

siteName.oninput = function () {
  validate(siteName, nameRegex);
};

siteURL.oninput = function () {
  validate(siteURL, urlRegex);
};

function validate(element, regex) {
  const isValid = regex.test(element.value);
  if (isValid) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}

//! Close Modal Function
closeBtn.onclick = function () {
  boxModal.classList.add("d-none");
};

document.onkeydown = function (e) {
  if (e.key === "Escape") {
    boxModal.classList.add("d-none");
  }
};

document.onclick = function (e) {
  if (e.target.classList.contains("box-info")) {
    boxModal.classList.add("d-none");
  }
};
