document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;

  const list = document.getElementById('adminReservationsList');
  const msg = document.getElementById('adminReservationsMsg');

  async function loadReservations() {
    msg.textContent = 'Loading reservations...';
    list.innerHTML = '';

    try {
      const response = await apiFetch('/api/admin/trips-reservations');
      const trips = response.data || [];

      if (!trips.length) {
        msg.textContent = 'No reservations found.';
        return;
      }

      msg.textContent = '';
      trips.forEach((entry) => {
        const container = document.createElement('div');
        container.className = 'panel';

        const reservations = entry.reservations || [];
        const rows = reservations
          .map(
            (res) => `
              <div class="card">
                <div class="trip-meta">
                  <div>User ID: ${res.user_id}</div>
                  <div>Seats: ${res.seats}</div>
                  <div>Status: ${res.status}</div>
                  <div>Total: ${res.montant}</div>
                  <div>Date: ${formatDate(res.date_reservation)}</div>
                </div>
              </div>
            `
          )
          .join('');

        container.innerHTML = `
          <h2>${entry.trip.name}</h2>
          <p class="muted">Reservations: ${entry.reservationCount}</p>
          <div class="stack">${rows}</div>
        `;

        list.appendChild(container);
      });
    } catch (err) {
      msg.textContent = err.message;
    }
  }

  loadReservations();
});
