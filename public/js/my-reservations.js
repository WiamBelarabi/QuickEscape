document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  const list = document.getElementById('reservationsList');
  const msg = document.getElementById('reservationsMsg');

  async function loadReservations() {
    msg.textContent = 'Loading reservations...';
    list.innerHTML = '';

    try {
      const response = await apiFetch('/api/my-reservations');
      const reservations = response.data || [];

      if (!reservations.length) {
        msg.textContent = 'No reservations yet.';
        return;
      }

      msg.textContent = '';
      reservations.forEach((res) => {
        const trip = res.Trip || {};
        const card = document.createElement('div');
        card.className = 'panel';
        card.innerHTML = `
          <h3>${trip.name || 'Trip'}</h3>
          <div class="trip-meta">
            <div>Destination: ${trip.destination || '-'}</div>
            <div>Budget: ${trip.budget || '-'}</div>
            <div>Depart: ${formatDate(trip.date_depart)}</div>
            <div>Return: ${formatDate(trip.date_retour)}</div>
          </div>
          <div class="trip-meta">
            <div>Status: ${res.status}</div>
            <div>Seats: ${res.seats}</div>
            <div>Total: ${res.montant}</div>
          </div>
        `;
        list.appendChild(card);
      });
    } catch (err) {
      msg.textContent = err.message;
    }
  }

  loadReservations();
});
