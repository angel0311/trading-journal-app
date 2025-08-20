<template>
  <div>
    <h3>Add New Trade</h3>
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
        commentTradeOutcome: ''
      }
    };
  },
  methods: {
    addTrade() {
      axios.post('http://localhost:5000/trades/add', this.trade)
        .then(res => {
          console.log(res.data);
          this.$router.push('/');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
</style>