<template>
  <fieldset>
    <legend>Instrument Details</legend>
    <div class="instrument-details-grid">
      <div class="form-group">
        <label for="symbol">Symbol</label>
        <input id="symbol" type="text" :value="symbol" @input="$emit('update:symbol', $event.target.value)" required placeholder="e.g., GCM5">
      </div>
      <div class="details-display">
        <div class="detail-item">
          <strong>Future Contract</strong>
          <span>{{ futureContract || 'N/A' }}</span>
        </div>
        <div class="detail-item">
          <strong>Expiration Date</strong>
          <span>{{ expirationDate || 'N/A' }}</span>
        </div>
        <div class="detail-item">
          <strong>Time Remaining</strong>
          <span>{{ timeRemainingDisplay || 'N/A' }}</span>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script>
export default {
  name: 'InstrumentDetails',
  props: {
    symbol: String,
    futureContract: String,
    expirationDate: String,
    timeToStopTrading: String,
  },
  emits: ['update:symbol'],
  data() {
    return {
      currentTime: new Date(),
      intervalId: null,
    };
  },
  computed: {
    timeRemainingDisplay() {
      if (!this.timeToStopTrading) {
        return '';
      }

      
      const [year, month, day] = this.timeToStopTrading.split('-').map(Number);
      // Creates a date at midnight in the user's local timezone.
      const stopDate = new Date(year, month - 1, day);
      // Set to end of day for a more intuitive countdown.
      stopDate.setHours(23, 59, 59, 999);

      // The currentTime dependency makes this re-evaluate when the interval fires.
      const diff = stopDate.getTime() - this.currentTime.getTime();

      if (diff <= 0) return 'Expired';

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      return `${days}d ${hours}h`;
    }
  },
  mounted() {
    // Update the current time every minute for the countdown.
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  }
}
</script>

<style scoped>
/* Styles are scoped to this component to match the main form's look and feel. */
fieldset {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
}

legend {
  padding: 0 10px;
  font-weight: bold;
  color: #35495e;
}

.instrument-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: center;
}

.details-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  padding-left: 20px;
  border-left: 1px solid #ddd;
}

.detail-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.detail-item strong {
  width: 120px; /* Ensures values are aligned */
  font-weight: 500;
  color: #555;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input[type="text"],
input[type="date"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: #3BA0AD;
  box-shadow: 0 0 0 2px rgba(59, 160, 173, 0.2);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>