// Define a type/interface for your data
interface MyData {
    name: string;
    age: number;
  }
  
  // Load data from local storage or initialize an empty array
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
  
  // Save data to local storage
  function saveData(data: MyData) {
    const existingData = localStorage.getItem("myData");
    let newData: MyData[] = [];
  
    if (existingData) {
      try {
        const parsedData = JSON.parse(existingData);
        newData = Array.isArray(parsedData) ? [...parsedData, data] : [parsedData, data];
      } catch (error) {
        console.error("Error parsing existing data:", error);
      }
    } else {
      newData = [data];
    }
  
    localStorage.setItem("myData", JSON.stringify(newData));
  }
  
  // Display the loaded data on the HTML page
  function displayData(data: MyData[]) {
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
  
  const sendMessageBtn = document.querySelector<HTMLButtonElement>("#send-message-btn");
  
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener("click", function handleClick() {
      const nameInput = (document.querySelector<HTMLInputElement>("#nameInput")?.value ?? "") as string;
  
      const md: MyData = {
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
    });
  }
  
  const initData = loadData();
  displayData(initData);
  console.log(initData);
  