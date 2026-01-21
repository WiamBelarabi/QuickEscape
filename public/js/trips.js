document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  const list = document.getElementById('tripsList');
  const msg = document.getElementById('tripsMsg');
  const form = document.getElementById('searchForm');
  const clearBtn = document.getElementById('clearSearch');
  const input = document.getElementById('searchInput');

  async function loadTrips(query = '') {
    msg.textContent = 'Loading trips...';
    list.innerHTML = '';

    try {
      const url = query ? `/api/trip?name=${encodeURIComponent(query)}` : '/api/trip';
      const response = await apiFetch(url);
      const trips = response.data || [];

      if (!trips.length) {
        msg.textContent = 'No trips found.';
        return;
      }

      msg.textContent = '';
      trips.forEach((trip) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${trip.name}</h3>
          <div class="trip-meta">
            <div>Destination: ${trip.destination}</div>
            <div>Budget: ${trip.budget}</div>
            <div>Seats: ${trip.place_restante}</div>
          </div>
          <a class="button primary" href="/trips/${trip.id}">View details</a>
        `;
        list.appendChild(card);
      });
    } catch (err) {
      msg.textContent = err.message;
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    loadTrips(input.value.trim());
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    loadTrips();
  });

  loadTrips();
});
