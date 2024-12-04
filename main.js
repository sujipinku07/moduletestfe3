// Elements Selection
const cryptoTableDiv = document.querySelector('.crypto-table');
const tableBody = document.querySelector('.table-body');
const searchInputField = document.querySelector('#crypto-search');
const sortPercentageButton = document.querySelector('#sort-percentage');
const sortMarketCapButton = document.querySelector('#sort-marketcap');

let cryptoData = [];

// Fetch the data using async/await
const fetchCryptoData = async () => {
    try {
        const apiURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Render the table
const displayTable = (data) => {
    tableBody.innerHTML = '';
   
    data.forEach((coin) => {
        const percentageStyle = coin.market_cap_change_percentage_24h < 0 ? 'red' : 'green';
        const tableRow = `
            <tr>
                <td><img src="${coin.image}" alt="${coin.name}" width="30"></td>
                <td class="crypto-name">${coin.name}</td>
                <td>${coin.symbol.toUpperCase()}</td>
                <td>$${coin.current_price.toLocaleString()}</td>
                <td>${coin.total_volume.toLocaleString()}</td>
                <td style="color:${percentageStyle};">${coin.market_cap_change_percentage_24h?.toFixed(2) || 0}%</td>
                <td>$${coin.market_cap.toLocaleString()}</td>
            </tr>
        `;
        tableBody.innerHTML += tableRow;
    });
};

// Filter data by search term
const filterCryptoTable = () => {
    const searchTerm = searchInputField.value.toLowerCase();
    const filteredData = cryptoData.filter(
        (coin) =>
            coin.name.toLowerCase().includes(searchTerm) ||
            coin.symbol.toLowerCase().includes(searchTerm)
    );
    displayTable(filteredData);
};

// Sort data by percentage change
const sortByPercentageChange = () => {
    cryptoData.sort((a, b) => b.market_cap_change_percentage_24h - a.market_cap_change_percentage_24h);
    displayTable(cryptoData);
};

// Sort data by market cap
const sortByMarketCapValue = () => {
    cryptoData.sort((a, b) => b.market_cap - a.market_cap);
    displayTable(cryptoData);
};

// Initialize the table
const initializeCryptoTable = async () => {
    cryptoData = await fetchCryptoData();
    displayTable(cryptoData);
};

// Event Listeners
searchInputField.addEventListener('input', filterCryptoTable);
sortPercentageButton.addEventListener('click', sortByPercentageChange);
sortMarketCapButton.addEventListener('click', sortByMarketCapValue);

// Initialize
initializeCryptoTable();