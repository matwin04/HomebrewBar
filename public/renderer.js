const API_BASE_URL = "http://localhost:3033/api";

// Function to create a table row
function createTableRow(type, name, desc, homepage, urlParam) {
    const tr = document.createElement("tr");
tr.className = type === "Formula" ? "formula-row" : "cask-row";
    const typeTd = document.createElement("td");
    typeTd.textContent = type;

    const nameTd = document.createElement("td");
    const nameLink = document.createElement("a");
    nameLink.textContent = name;
    nameLink.href = `details.html?type=${urlParam}&name=${name}`;
    nameTd.appendChild(nameLink);

    const descTd = document.createElement("td");
    descTd.textContent = desc || "No description available";

    const homeTd = document.createElement("td");
    const homeLink = document.createElement("a");
    homeLink.textContent = "Visit";
    homeLink.href = homepage;
    homeLink.target = "_blank";
    homeTd.appendChild(homeLink);

    tr.appendChild(typeTd);
    tr.appendChild(nameTd);
    tr.appendChild(descTd);
    tr.appendChild(homeTd);

    return tr;
}

// Function to search and display brews in a table
async function searchBrews() {
    document.getElementById("search-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        const query = document.getElementById("search-input").value.trim().toLowerCase();
        if (!query) return;

        const resultsTableBody = document.querySelector("#results_table tbody");
        resultsTableBody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

        try {
            const [formulaeResponse, casksResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/formulae`),
                axios.get(`${API_BASE_URL}/casks`)
            ]);

            const formulae = formulaeResponse.data;
            const casks = casksResponse.data;

            resultsTableBody.innerHTML = "";

            const filteredFormulae = formulae.filter(item => item.name.toLowerCase().includes(query) || (item.desc && item.desc.toLowerCase().includes(query)));
            const filteredCasks = casks.filter(item => item.token.toLowerCase().includes(query) || (item.desc && item.desc.toLowerCase().includes(query)));

            filteredFormulae.forEach(brew => resultsTableBody.appendChild(createTableRow("Formula", brew.name, brew.desc, brew.homepage, "formula")));
            filteredCasks.forEach(brew => resultsTableBody.appendChild(createTableRow("Cask", brew.token, brew.desc, brew.homepage, "cask")));
        } catch (error) {
            resultsTableBody.innerHTML = `<tr><td colspan='4'>Error fetching data: ${error.message}</td></tr>`;
        }
    });
}

// Function to load and display brew details
async function loadBrewDetails() {
    const params = new URLSearchParams(window.location.search);
    const brewType = params.get("type");
    const brewName = params.get("name");

    if (!brewName || !brewType) {
        document.getElementById("brew-details").innerHTML = "<p>No brew selected.</p>";
        return;
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/${brewType}/${brewName}`);
        const brew = response.data;

        document.getElementById("brew-details").innerHTML = `
            <h2>${brew.name || brew.token}</h2>
            <p><strong>Description:</strong> ${brew.desc || "No description available"}</p>
            <p><strong>Homepage:</strong> <a href="${brew.homepage}" target="_blank">${brew.homepage}</a></p>
        `;
    } catch (error) {
        document.getElementById("brew-details").innerHTML = `<p>Error fetching details: ${error.message}</p>`;
    }
}

if (window.location.pathname.includes("details.html")) {
    loadBrewDetails();
} else {
    searchBrews();
}