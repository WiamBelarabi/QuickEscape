document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;

  const list = document.getElementById('adminTripsList');
  const msg = document.getElementById('adminTripsMsg');
  const status = document.getElementById('adminTripsStatus');
  const form = document.getElementById('tripForm');
  const cancelBtn = document.getElementById('tripCancel');
  const photoFileInput = document.getElementById('tripPhotoFile');
  const photoInput = document.getElementById('tripPhoto');
  const photoPreview = document.getElementById('tripPhotoPreview');

  let photosData = [];

  function normalizePhotos(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string' && value.trim() !== '') return [value.trim()];
    return [];
  }

  function updatePhotoPreview(src) {
    if (!photoPreview) return;
    if (src) {
      photoPreview.src = src;
      photoPreview.style.display = 'block';
    } else {
      photoPreview.removeAttribute('src');
      photoPreview.style.display = 'none';
    }
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Unable to read the selected image.'));
      reader.readAsDataURL(file);
    });
  }

  async function handlePhotoSelection() {
    const files = photoFileInput.files ? Array.from(photoFileInput.files) : [];
    if (!files.length) return;

    try {
      const dataUrls = await Promise.all(files.map(readFileAsDataURL));
      photosData = dataUrls.map((d) => String(d)).filter((d) => d.trim() !== '');
      photoInput.value = JSON.stringify(photosData);
      updatePhotoPreview(photosData[0]);
      status.textContent = '';
    } catch (err) {
      photosData = [];
      photoInput.value = '';
      updatePhotoPreview('');
      status.textContent = err.message;
    }
  }

  function getFormData() {
    return {
      name: document.getElementById('tripName').value.trim(),
      destination: document.getElementById('tripDestination').value.trim(),
      budget: Number(document.getElementById('tripBudget').value),
      date_depart: document.getElementById('tripDepart').value,
      date_retour: document.getElementById('tripReturn').value,
      photo: photosData,
      place_restante: Number(document.getElementById('tripSeats').value),
      description: document.getElementById('tripDescription').value.trim()
    };
  }

  function resetForm() {
    form.reset();
    photosData = [];
    photoInput.value = '';
    if (photoFileInput) photoFileInput.value = '';
    updatePhotoPreview('');
    document.getElementById('tripId').value = '';
    document.getElementById('tripSubmit').textContent = 'Save trip';
    status.textContent = '';
  }

  async function loadTrips() {
    msg.textContent = 'Loading trips...';
    list.innerHTML = '';

    try {
      const response = await apiFetch('/api/trip');
      const trips = response.data || [];

      if (!trips.length) {
        msg.textContent = 'No trips available.';
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
            <div>Depart: ${formatDate(trip.date_depart)}</div>
            <div>Return: ${formatDate(trip.date_retour)}</div>
            <div>Seats: ${trip.place_restante}</div>
          </div>
          <div class="form-actions">
            <button class="button" data-action="edit">Edit</button>
            <button class="button danger" data-action="delete">Delete</button>
          </div>
        `;

        card.querySelector('[data-action="edit"]').addEventListener('click', () => {
          document.getElementById('tripId').value = trip.id;
          document.getElementById('tripName').value = trip.name;
          document.getElementById('tripDestination').value = trip.destination;
          document.getElementById('tripBudget').value = trip.budget;
          document.getElementById('tripDepart').value = trip.date_depart ? trip.date_depart.slice(0, 10) : '';
          document.getElementById('tripReturn').value = trip.date_retour ? trip.date_retour.slice(0, 10) : '';
          photosData = normalizePhotos(trip.photo);
          photoInput.value = JSON.stringify(photosData);
          if (photoFileInput) photoFileInput.value = '';
          updatePhotoPreview(photosData[0]);
          document.getElementById('tripSeats').value = trip.place_restante;
          document.getElementById('tripDescription').value = trip.description || '';
          document.getElementById('tripSubmit').textContent = 'Update trip';
          status.textContent = 'Editing trip.';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        card.querySelector('[data-action="delete"]').addEventListener('click', async () => {
          if (!confirm(`Delete ${trip.name}?`)) return;
          try {
            await apiFetch(`/api/trip/${trip.id}`, { method: 'DELETE' });
            loadTrips();
          } catch (err) {
            msg.textContent = err.message;
          }
        });

        list.appendChild(card);
      });
    } catch (err) {
      msg.textContent = err.message;
    }
  }

  photoFileInput.addEventListener('change', handlePhotoSelection);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

    const tripId = document.getElementById('tripId').value;

    if (!photosData.length) {
      status.textContent = "L'image est requise.";
      return;
    }

    const payload = getFormData();

    try {
      if (tripId) {
        await apiFetch(`/api/trip/${tripId}`, {
          method: 'PUT',
          body: payload
        });
        status.textContent = 'Trip updated.';
      } else {
        await apiFetch('/api/trip', {
          method: 'POST',
          body: payload
        });
        status.textContent = 'Trip created.';
      }
      resetForm();
      loadTrips();
    } catch (err) {
      status.textContent = err.message;
    }
  });

  cancelBtn.addEventListener('click', resetForm);

  loadTrips();
});
