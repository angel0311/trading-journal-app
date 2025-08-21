<template>
  <fieldset>
    <legend>Instrument Details</legend>
    <div class="form-grid">
      <div class="form-group">
        <label for="symbol">Symbol</label>
        <input id="symbol" type="text" :value="symbol" @input="$emit('update:symbol', $event.target.value)" required placeholder="e.g., RBU24">
      </div>
      <div class="form-group">
        <label for="futureContract">Future Contract</label>
        <input id="futureContract" type="text" :value="futureContract" placeholder="Auto-filled from Symbol" readonly>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label for="expirationDate">Expiration Date</label>
        <input id="expirationDate" type="date" :value="expirationDate" readonly>
      </div>
      <div class="form-group">
        <label for="timeToStopTrading">Time to stop trading</label>
        <input id="timeToStopTrading" type="text" :value="timeRemainingDisplay" placeholder="Auto-filled from Symbol" readonly>
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

      if (diff <= 0) {
        return 'Expired';
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      return `${days}d ${hours}h remaining`;
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
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