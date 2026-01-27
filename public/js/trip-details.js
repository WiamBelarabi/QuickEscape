document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  const details = document.getElementById('tripDetails');
  const status = document.getElementById('reserveStatus');
  const form = document.getElementById('reserveForm');

  if (!details) return;
  const tripId = details.dataset.tripId;

  function normalizePhotos(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string' && value.trim() !== '') return [value.trim()];
    return [];
  }

  async function loadTrip() {
    details.innerHTML = 'Loading trip details...';
    try {
      const response = await apiFetch(`/api/trip/${tripId}`);
      const trip = response.data;
      const photos = normalizePhotos(trip.photo);
      const photosHtml = photos.length
        ? `<div class="trip-photo-stack">${photos.map((src, i) => `<img class="trip-photo" src="${src}" alt="${trip.name} photo ${i + 1}">`).join('')}</div>`
        : '';
      details.innerHTML = `
        ${photosHtml}
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
