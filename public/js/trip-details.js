document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  const details = document.getElementById('tripDetails');
  const status = document.getElementById('reserveStatus');
  const form = document.getElementById('reserveForm');

  if (!details) return;
  const tripId = details.dataset.tripId;

  async function loadTrip() {
    details.innerHTML = 'Loading trip details...';
    try {
      const response = await apiFetch(`/api/trip/${tripId}`);
      const trip = response.data;
      details.innerHTML = `
        <h2>${trip.name}</h2>
        <div class="trip-meta">
          <div>Destination: ${trip.destination}</div>
          <div>Budget: ${trip.budget}</div>
          <div>Depart: ${formatDate(trip.date_depart)}</div>
          <div>Return: ${formatDate(trip.date_retour)}</div>
          <div>Seats left: ${trip.place_restante}</div>
        </div>
        <p>${trip.description || 'No description provided.'}</p>
      `;
    } catch (err) {
      details.textContent = err.message;
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

    const seats = Number(document.getElementById('reserveSeats').value);
    try {
      await apiFetch(`/api/trip/${tripId}/reserve`, {
        method: 'POST',
        body: { seats }
      });
      status.textContent = 'Reservation created.';
      loadTrip();
    } catch (err) {
      status.textContent = err.message;
    }
  });

  loadTrip();
});
