interface MyData {
  id: string;
  name: string;
  age: number;
}

function loadData(): MyData[] {
  const data = localStorage.getItem("myData");
  if (data) {
    try {
      const parsedData = JSON.parse(data);
      return Array.isArray(parsedData) ? parsedData : [parsedData];
    } catch (error) {
      console.error("Error parsing data:", error);
    }
  }
  return [];
}

function saveData(data: MyData) {
  const existingData = localStorage.getItem("myData");
  let newData: MyData[] = [];

  if (existingData) {
    try {
      const parsedData = JSON.parse(existingData);
      newData = Array.isArray(parsedData)
        ? [...parsedData, data]
        : [parsedData, data];
    } catch (error) {
      console.error("Error parsing existing data:", error);
    }
  } else {
    newData = [data];
  }

  localStorage.setItem("myData", JSON.stringify(newData));
}

function removeItem(id: string) {
  const existingData = localStorage.getItem("myData");
  if (existingData) {
    try {
      const parsedData = JSON.parse(existingData) as MyData[];
      const filteredData = parsedData.filter((item) => item.id !== id);
      localStorage.setItem("myData", JSON.stringify(filteredData));
    } catch (error) {
      console.error("Error parsing existing data:", error);
    }
  }
}

function displayData(data: MyData[]) {
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

      const removeForm = document.querySelector(
        `#removeForm-${item.id}`
      ) as HTMLFormElement;
      if (removeForm) {
        removeForm.addEventListener("submit", (event) => {
          event.preventDefault();
          const itemIdInput = removeForm.querySelector(
            "[name=itemId]"
          ) as HTMLInputElement;
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

const darkModeSwitch =
  document.querySelector<HTMLInputElement>("#darkModeSwitch")!;
const rootElement = document.documentElement;

function toggleDarkMode() {
  if (darkModeSwitch.checked) {
    enableDarkMode();
  } else {
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

function setDarkModeCookie(isDarkMode: boolean) {
  document.cookie = `darkMode=${isDarkMode}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function checkDarkModePreference() {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  console.log(cookies);
  const darkModeCookie = cookies.find((cookie) =>
    cookie.startsWith("darkMode=")
  );
  if (darkModeCookie && darkModeCookie.split("=")[1] === "true") {
    enableDarkMode();
    darkModeSwitch.checked = true;
  }
}

darkModeSwitch.addEventListener("change", toggleDarkMode);
document.addEventListener("DOMContentLoaded", checkDarkModePreference);

//

const sendMessageBtn =
  document.querySelector<HTMLButtonElement>("#send-message-btn");

if (sendMessageBtn) {
  sendMessageBtn.addEventListener("click", function handleClick() {
    const nameInput = (document.querySelector<HTMLInputElement>("#nameInput")
      ?.value ?? "") as string;

    const md: MyData = {
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
        modalBackdrop.parentNode?.removeChild(modalBackdrop);
      }
    }

    location.reload();
  });
}

function generateUniqueId(): string {
  //This will be replaced with oficial source id
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 10);

  const uniqueId = timestamp + randomString;
  return uniqueId;
}

const initData = loadData();
displayData(initData);
console.log(initData);


//

import axios from 'axios';

console.log(import.meta.env.PROXY_URL);

// Define your Client ID and Client Secret
const clientId = ''; // Replace with your actual Client ID
const clientSecret = ''; // Replace with your actual Client Secret

// Define the endpoint and query parameters to obtain the access token
const authEndpoint = 'https://id.twitch.tv/oauth2/token';
const authParams = {
  client_id: clientId,
  client_secret: clientSecret,
  grant_type: 'client_credentials',
};

// Define your API key and base URL
const proxyURL = '';
const baseURL = 'https://api.igdb.com/v4';

// Define the endpoint and query parameters
const endpoint = '/games';
const queryParams = {
  fields: 'name,summary',
  limit: 10,
};

// Function to obtain the access token
async function getAccessToken() {
  try {
    // Send the POST request to obtain the access token
    const response = await axios.post(authEndpoint, null, {
      params: authParams,
    });

    console.log(response);

    // Extract the access token from the response
    const { access_token } = response.data;

    // Return the access token
    return access_token;
  } catch (error) {
    console.error('Error occurred while obtaining access token:', error);
    throw error;
  }
}

// Function to request data from the IGDB API
async function requestDataFromIGDB() {
  try {
    // Obtain the access token
    const accessToken = await getAccessToken();

    // Create an Axios instance with the proxy URL and the access token as the API key
    const api = axios.create({
      baseURL: proxyURL + baseURL, // Prepend the base URL with the proxy URL
      headers: {
        'Client-ID': clientId,
        Authorization: `Bearer ${accessToken}`,
        'X-Requested-With': 'XMLHttpRequest', // Required header for the cors-anywhere proxy
      },
    });

    // Send the GET request using the updated Axios instance
    const response = await api.get(endpoint, {
      params: queryParams,
    });

    // Extract the data from the response
    const data = response.data;

    // Process the data as needed
    console.log('Received data:', data);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Call the function to request data
requestDataFromIGDB();
