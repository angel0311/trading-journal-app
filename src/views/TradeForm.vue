<template>
  <div>
    <h3>Add New Trade</h3>
    <div v-if="statusMessage" :class="statusType" class="status-message">{{ statusMessage }}</div>

    <form @submit.prevent="addTrade">
      <div class="form-group">
        <label>Symbol Traded:</label>
        <input type="text" v-model="trade.symbolTraded" required>
      </div>
      <div class="form-group">
        <label>Future Contract Name:</label>
        <input type="text" v-model="trade.futureContractName" required>
      </div>
      <div class="form-group">
        <label>Expiration Day:</label>
        <input type="date" v-model="trade.contractExpiration" required>
      </div>
      <div class="form-group">
        <label>Price Bought:</label>
        <input type="number" step="0.01" v-model="trade.priceBought" required>
      </div>
      <div class="form-group">
        <label>Price Sold:</label>
        <input type="number" step="0.01" v-model="trade.priceSold" required>
      </div>
      <div class="form-group">
        <label>Date & Time Bought:</label>
        <input type="datetime-local" v-model="trade.dateBought" required>
      </div>
      <div class="form-group">
        <label>Date & Time Sold:</label>
        <input type="datetime-local" v-model="trade.dateSold" required>
      </div>
      <div class="form-group">
        <label>Reason for Buying:</label>
        <textarea v-model="trade.commentBuyReason"></textarea>
      </div>
      <div class="form-group">
        <label>Trade Outcome:</label>
        <textarea v-model="trade.commentTradeOutcome"></textarea>
      </div>
      <div class="form-group">
        <input type="submit" value="Log Trade" class="btn btn-primary">
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TradeForm',
  data() {
    return {
      trade: {
        symbolTraded: '',
        futureContractName: '',
        contractExpiration: '',
        priceBought: null,
        priceSold: null,
        dateBought: '',
        dateSold: '',
        commentBuyReason: '',
        commentTradeOutcome: '',
      },
      statusMessage: '',
      statusType: ''
    };
  },
  methods: {
    resetForm() {
      this.trade = {
        symbolTraded: '',
        futureContractName: '',
        contractExpiration: '',
        priceBought: null,
        priceSold: null,
        dateBought: '',
        dateSold: '',
        commentBuyReason: '',
        commentTradeOutcome: ''
      };
    },
    addTrade() {
      this.statusMessage = '';
      axios.post('http://localhost:5000/trades/add', this.trade)
        .then(res => {
          console.log(res.data);
          this.statusMessage = 'Trade logged successfully!';
          this.statusType = 'success';
          this.resetForm();
          // Redirect to the trades list to see the new entry after a delay
          setTimeout(() => this.$router.push('/trades'), 2000);
        })
        .catch(err => {
          console.error(err);
          this.statusMessage = 'Error logging trade. Please check the details and try again.';
          this.statusType = 'error';
        });
    }
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
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
</style>