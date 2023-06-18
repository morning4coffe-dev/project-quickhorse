"use strict";
function loadData() {
    const data = localStorage.getItem("myData");
    if (data) {
        try {
            const parsedData = JSON.parse(data);
            return Array.isArray(parsedData) ? parsedData : [parsedData];
        }
        catch (error) {
            console.error("Error parsing data:", error);
        }
    }
    return [];
}
function saveData(data) {
    const existingData = localStorage.getItem("myData");
    let newData = [];
    if (existingData) {
        try {
            const parsedData = JSON.parse(existingData);
            newData = Array.isArray(parsedData)
                ? [...parsedData, data]
                : [parsedData, data];
        }
        catch (error) {
            console.error("Error parsing existing data:", error);
        }
    }
    else {
        newData = [data];
    }
    localStorage.setItem("myData", JSON.stringify(newData));
}
function removeItem(id) {
    const existingData = localStorage.getItem("myData");
    if (existingData) {
        try {
            const parsedData = JSON.parse(existingData);
            const filteredData = parsedData.filter((item) => item.id !== id);
            localStorage.setItem("myData", JSON.stringify(filteredData));
        }
        catch (error) {
            console.error("Error parsing existing data:", error);
        }
    }
}
function displayData(data) {
    const container = document.getElementById("dataContainer");
    if (container) {
        container.innerHTML = "";
        data.forEach((item) => {
            const content = `
        <div class="col">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.age}</p>
            </div>
            <div class="card-footer">
              <div class="d-flex justify-content-between">
                <form id="removeForm-${item.id}" method="post">
                  <input type="hidden" name="itemId" value="${item.id}">
                  <button type="submit" class="btn btn-danger btn-sm">Remove</button>
                </form>
                <button type="button" class="btn btn-outline-primary btn-sm"
                  data-bs-toggle="modal" data-bs-target="#updateModal"
                  data-bs-whatever="${item.id}">Edit</button>
              </div>
            </div>
          </div>
        </div>`;
            container.insertAdjacentHTML("beforeend", content);
            const removeForm = document.querySelector(`#removeForm-${item.id}`);
            if (removeForm) {
                removeForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    const itemIdInput = removeForm.querySelector("[name=itemId]");
                    const itemId = itemIdInput.value;
                    if (confirm("Are you sure you want to delete this item?")) {
                        removeItem(itemId);
                        const newData = loadData();
                        displayData(newData);
                    }
                });
            }
        });
    }
}
//DARK MODE
const darkModeSwitch = document.querySelector("#darkModeSwitch");
const rootElement = document.documentElement;
function toggleDarkMode() {
    if (darkModeSwitch.checked) {
        enableDarkMode();
    }
    else {
        disableDarkMode();
    }
}
function enableDarkMode() {
    rootElement.setAttribute("data-bs-theme", "dark");
    setDarkModeCookie(true);
}
function disableDarkMode() {
    rootElement.setAttribute("data-bs-theme", "light");
    setDarkModeCookie(false);
}
function setDarkModeCookie(isDarkMode) {
    document.cookie = `darkMode=${isDarkMode}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}
function checkDarkModePreference() {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    console.log(cookies);
    const darkModeCookie = cookies.find((cookie) => cookie.startsWith("darkMode="));
    if (darkModeCookie && darkModeCookie.split("=")[1] === "true") {
        enableDarkMode();
        darkModeSwitch.checked = true;
    }
}
darkModeSwitch.addEventListener("change", toggleDarkMode);
document.addEventListener("DOMContentLoaded", checkDarkModePreference);
//
const sendMessageBtn = document.querySelector("#send-message-btn");
if (sendMessageBtn) {
    sendMessageBtn.addEventListener("click", function handleClick() {
        var _a, _b, _c;
        const nameInput = ((_b = (_a = document.querySelector("#nameInput")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");
        const md = {
            id: generateUniqueId(),
            name: nameInput,
            age: 25,
        };
        saveData(md);
        const modal = document.getElementById("exampleModal");
        if (modal) {
            modal.classList.remove("show");
            document.body.classList.remove("modal-open");
            const modalBackdrop = document.querySelector(".modal-backdrop");
            if (modalBackdrop) {
                (_c = modalBackdrop.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(modalBackdrop);
            }
        }
        location.reload();
    });
}
function generateUniqueId() {
    //This will be replaced with oficial source id
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 10);
    const uniqueId = timestamp + randomString;
    return uniqueId;
}
const initData = loadData();
displayData(initData);
console.log(initData);
