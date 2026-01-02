// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// DOM Elements
const stateInput = document.getElementById('state-input');
const fetchBtn = document.getElementById('fetch-btn');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessageElement = document.getElementById('error-message');

// Event Listener
fetchBtn.addEventListener('click', async () => {
    const state = stateInput.value.trim().toUpperCase();
    
    // Clear previous error
    errorMessageElement.textContent = '';
    errorMessageElement.classList.add('hidden');
    
    // Clear previous alerts
    alertsDisplay.innerHTML = '';
    
    if (!state || state.length !== 2) {
        displayError('Please enter a valid 2-letter state abbreviation');
        return;
    }
    
    try {
        const response = await fetch(`${weatherApi}${state}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        stateInput.value = ''; // Clear input
        displayAlerts(data);
    } catch (error) {
        displayError(error.message);
    }
});

function displayAlerts(data) {
    alertsDisplay.innerHTML = '';
    
    const features = data.features || [];
    const alertCount = features.length;
    
    // Create summary
    const summary = document.createElement('h3');
    summary.textContent = `Weather Alerts: ${alertCount}`;
    alertsDisplay.appendChild(summary);
    
    if (alertCount === 0) {
        const noAlerts = document.createElement('p');
        noAlerts.textContent = 'No alerts for this state.';
        alertsDisplay.appendChild(noAlerts);
        return;
    }
    
    // Create list of alerts
    const list = document.createElement('ul');
    
    features.forEach(feature => {
        if (feature.properties && feature.properties.headline) {
            const item = document.createElement('li');
            item.textContent = feature.properties.headline;
            list.appendChild(item);
        }
    });
    
    alertsDisplay.appendChild(list);
}

function displayError(message) {
    errorMessageElement.textContent = message;
    errorMessageElement.classList.remove('hidden');
}