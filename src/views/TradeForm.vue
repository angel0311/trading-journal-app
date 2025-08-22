<template>
  <div class="form-container">
    <form @submit.prevent="submitTrade" class="trade-form-card">
      <h3>{{ isEditMode ? 'Edit Trade' : 'Add New Trade' }}</h3>
      <div v-if="statusMessage" :class="statusType" class="status-message">{{ statusMessage }}</div>

      <instrument-details
        v-model:symbol="trade.symbol"
        :future-contract="trade.futureContract"
        :expiration-date="trade.expirationDate"
        :time-to-stop-trading="trade.timeToStopTrading"
      />

      <fieldset>
        <legend>Trade Parameters</legend>
        <div v-if="trade.tradeType === 'long'" class="trade-icon">
            <img :src="bullIcon" alt="Bull market icon">
        </div>
        <div v-if="trade.tradeType === 'short'" class="trade-icon">
            <img :src="bearIcon" alt="Bear market icon">
        </div>
         <div class="form-grid">
            <div class="form-group">
                <label for="strategy">Strategy</label>
                <select id="strategy" v-model="trade.strategy">
                    <option value="" disabled>-- Select a strategy --</option>
                    <option value="TF">TF - Trend follow</option>
                    <option value="TR">TR - Trend reversal</option>
                    <option value="OL">OL - Opposite leg</option>
                </select>
            </div>
            <div class="form-group">
                <label for="tradeType">Trade Type</label>
                <select id="tradeType" v-model="trade.tradeType" required>
                    <option value="long">Long</option>
                    <option value="short">Short</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label for="investment">Investment ($)</label>
            <input id="investment" type="number" step="100" v-model="trade.investment" placeholder="e.g., 2,100.00">
        </div>
      </fieldset>

      <fieldset>
        <legend>Entry</legend>
        <div class="form-grid">
          <div class="form-group">
            <label for="initialPrice">Entry Price</label>
            <input id="initialPrice" type="text" v-model="formattedInitialPrice" required placeholder="e.g., 2,153.00">
          </div>
          <div class="form-group">
            <label for="initialDateTime">Entry Date & Time</label>
            <input id="initialDateTime" type="datetime-local" v-model="trade.initialDateTime" required>
          </div>
        </div>
        <div class="form-group">
          <label for="motivation">Motivation to Enter Trade</label>
          <textarea id="motivation" v-model="trade.motivation" rows="4"></textarea>
        </div>
        <div class="form-group form-group--row">
            <label>Order Types:</label>
            <div class="order-types-container">
                <div class="checkbox-group">
                    <input type="checkbox" id="limitOrder" v-model="trade.limitOrder">
                    <label for="limitOrder">Limit Order</label>
                </div>
            </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Exit</legend>
        <div class="form-grid">
          <div class="form-group">
            <label for="finalPrice">Exit Price</label>
            <input id="finalPrice" type="text" v-model="formattedFinalPrice" placeholder="e.g., 2,135.00">
          </div>
          <div class="form-group">
            <label for="finalDateTime">Exit Date & Time</label>
            <input id="finalDateTime" type="datetime-local" v-model="trade.finalDateTime">
          </div>
      </div>
        <div class="form-group">
          <label for="outcome">How The Trade Went</label>
          <textarea id="outcome" v-model="trade.outcome" rows="4"></textarea>
        </div>
        <div class="form-group form-group--row">
            <label>Order Types:</label>
            <div class="order-types-container">
                <div class="checkbox-group">
                    <input type="checkbox" id="stopOrder" v-model="trade.stopOrder">
                    <label for="stopOrder">Stop Order</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="targetOrder" v-model="trade.targetOrder">
                    <label for="targetOrder">Target Order</label>
                </div>
            </div>
        </div>        
      </fieldset>

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn btn-secondary">{{ isEditMode ? 'Cancel' : 'Clear Form' }}</button>
        <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Update Trade' : 'Log Trade' }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import bullIcon from '@/assets/bull.png';
import bearIcon from '@/assets/bear.png';
import InstrumentDetails from '@/components/InstrumentDetails.vue';
import { parseSymbol } from '@/utils/futuresSymbolParser.js';

export default {
  name: 'TradeForm',
  components: {
    InstrumentDetails,
  },
  data() {
    return {
      trade: this.getInitialTradeObject(),
      // Make icons available to the template
      bullIcon,
      bearIcon,
      statusMessage: '',
      statusType: '',
      tradeId: null,
    };
  },
  created() {
    const id = this.$route.params.id;
    if (id) {
      this.tradeId = id;
      this.fetchTradeData(id);
    }
  },
  watch: {
    'trade.symbol'(newSymbol) {
      if (newSymbol && newSymbol.length >= 4) {
        const parsed = parseSymbol(newSymbol.toUpperCase());
        if (parsed) {
          this.trade.futureContract = parsed.contract;
          this.trade.expirationDate = parsed.expirationDate;
          this.trade.timeToStopTrading = parsed.timeToStopTrading;
        }
      } else {
        // Clear derived fields if symbol is invalid or cleared
        this.trade.futureContract = '';
        this.trade.expirationDate = '';
        this.trade.timeToStopTrading = '';
      }
    }
  },
  computed: {
    isEditMode() {
      return !!this.tradeId;
    },
    formattedInitialPrice: {
      get() {
        if (this.trade.initialPrice === null || typeof this.trade.initialPrice === 'undefined') {
          return '';
        }
        return this.trade.initialPrice.toLocaleString('en-US', { maximumFractionDigits: 5 });
      },
      set(newValue) {
        if (!newValue) {
          this.trade.initialPrice = null;
          return;
        }
        const cleanedValue = String(newValue).replace(/,/g, '');
        const numberValue = parseFloat(cleanedValue);
        this.trade.initialPrice = isNaN(numberValue) ? null : numberValue;
      }
    },
    formattedFinalPrice: {
      get() {
        if (this.trade.finalPrice === null || typeof this.trade.finalPrice === 'undefined') {
          return '';
        }
        return this.trade.finalPrice.toLocaleString('en-US', { maximumFractionDigits: 5 });
      },
      set(newValue) {
        if (!newValue) {
          this.trade.finalPrice = null;
          return;
        }
        const cleanedValue = String(newValue).replace(/,/g, '');
        const numberValue = parseFloat(cleanedValue);
        this.trade.finalPrice = isNaN(numberValue) ? null : numberValue;
      }
    },
  },
  methods: {
    formatDateTimeForInput(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      // The toISOString() method returns a string in simplified extended ISO format (ISO 8601).
      // We need to slice it to match the 'datetime-local' input format (YYYY-MM-DDTHH:mm).
      return date.toISOString().slice(0, 16);
    },
    getInitialTradeObject() {
        return {
            symbol: '',
            futureContract: '',
            expirationDate: '',
            timeToStopTrading: '',
            strategy: '',
            tradeType: 'long',
            investment: null,
            initialPrice: null,
            finalPrice: null,
            initialDateTime: '',
            finalDateTime: '',
            limitOrder: false,
            stopOrder: false,
            targetOrder: false,
            motivation: '',
            outcome: '',
        };
    },
    resetForm() {
      this.trade = this.getInitialTradeObject(); // This is correct for 'add' mode
      this.statusMessage = '';
      this.statusType = '';
    },
    handleCancel() {
      if (this.isEditMode) this.$router.push('/trades');
      else this.resetForm();
    },
    fetchTradeData(id) {
      axios.get(`http://localhost:5000/trades/edit/${id}`)
        .then(response => {
          const tradeData = response.data;
          // Format dates for the datetime-local input fields
          tradeData.initialDateTime = this.formatDateTimeForInput(tradeData.initialDateTime);
          tradeData.finalDateTime = this.formatDateTimeForInput(tradeData.finalDateTime);
          this.trade = tradeData;
        })
        .catch(err => {
          console.error('Error fetching trade data:', err);
          this.statusMessage = 'Could not load trade data. Please try again later.';
          this.statusType = 'error';
        });
    },
    submitTrade() {
      this.statusMessage = '';
      const apiCall = this.isEditMode
        ? axios.post(`http://localhost:5000/trades/update/${this.tradeId}`, this.trade)
        : axios.post('http://localhost:5000/trades/add', this.trade);

      apiCall.then(res => {
        console.log(res.data);
        this.statusMessage = `Trade ${this.isEditMode ? 'updated' : 'logged'} successfully!`;
        this.statusType = 'success';
        if (!this.isEditMode) {
          this.resetForm();
        }
        // Redirect to the trades list after a delay
        setTimeout(() => this.$router.push('/trades'), 2000);
      })
      .catch(err => {
        console.error(`Error ${this.isEditMode ? 'updating' : 'logging'} trade:`, err);
        this.statusMessage = `Error ${this.isEditMode ? 'updating' : 'logging'} trade. Please check the details and try again.`;
        this.statusType = 'error';
      });
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.trade-form-card {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.trade-form-card h3 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 25px;
  color: #333;
  font-size: 1.8rem;
}

fieldset {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative; /* For icon positioning */
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

.form-group--row {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.form-group--row > label {
  margin-bottom: 0;
}

label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input[type="text"],
input[type="number"],
input[type="text"],
input[type="date"],
input[type="datetime-local"],
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #3BA0AD;
  box-shadow: 0 0 0 2px rgba(59, 160, 173, 0.2);
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 12px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s, border-color 0.2s;
  border: 1px solid transparent;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b60;
}

.order-types {
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.order-types-container {
  display: flex;
  gap: 20px;
}

.trade-icon {
  position: absolute;
  top: 15px;
  right: 20px;
  width: 36px;
  height: 36px;
  opacity: 0.5;
}

.trade-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input {
  margin-right: 8px;
}

.checkbox-group > label {
  margin-bottom: 0;
  font-weight: normal;
}

.status-message {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-container {
    margin: 20px auto;
    padding: 10px;
  }

  .trade-form-card {
    padding: 20px;
  }

  .form-group--row {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-actions {
    flex-direction: column;
    gap: 15px;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>