"use strict";
// Load data from local storage or initialize an empty array
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
// Save data to local storage
function saveData(data) {
    const existingData = localStorage.getItem("myData");
    let newData = [];
    if (existingData) {
        try {
            const parsedData = JSON.parse(existingData);
            newData = Array.isArray(parsedData) ? [...parsedData, data] : [parsedData, data];
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
// Display the loaded data on the HTML page
function displayData(data) {
    const container = document.getElementById("dataContainer");
    if (container) {
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
                  <form action="pva-delete.php" method="post">
                    <input type="hidden" name="itemId" value="${item.name}">
                    <button type="submit" class="btn btn-danger btn-sm">Remove</button>
                  </form>
                  <button type="submit" class="btn btn-outline-primary btn-sm"
                    data-bs-toggle="modal" data-bs-target="#updateModal"
                    data-bs-whatever="${item.name}">Edit</button>
                </div>
              </div>
            </div>
          </div>`;
            container.insertAdjacentHTML("beforeend", content);
        });
    }
}
const sendMessageBtn = document.querySelector("#send-message-btn");
if (sendMessageBtn) {
    sendMessageBtn.addEventListener("click", function handleClick() {
        var _a, _b, _c;
        const nameInput = ((_b = (_a = document.querySelector("#nameInput")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");
        const md = {
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
    });
}
const initData = loadData();
displayData(initData);
console.log(initData);
