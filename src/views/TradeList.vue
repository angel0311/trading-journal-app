<template>
  <div class="trade-list-container">
    <h3>Trade Log</h3>
    <table class="table">
      <thead class="thead-light">
        <tr>
          <th>Symbol</th>
          <th>Contract</th>
          <th class="text-right">Price Bought</th>
          <th class="text-right">Price Sold</th>
          <th>Date & Time Bought</th>
          <th>Reason</th>
          <th>Outcome</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trade in trades" :key="trade._id">
          <td>{{ trade.symbolTraded }}</td>
          <td>{{ trade.futureContractName }}</td>
          <td class="text-right">{{ formatCurrency(trade.priceBought) }}</td>
          <td class="text-right">{{ formatCurrency(trade.priceSold) }}</td>
          <td>{{ new Date(trade.dateBought).toLocaleString() }}</td>
          <td>{{ trade.commentBuyReason }}</td>
          <td>{{ trade.commentTradeOutcome }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TradeList',
  data() {
    return {
      trades: []
    };
  },
  mounted() {
    this.fetchTrades();
  },
  methods: {
    formatCurrency(value) {
      if (value === null || value === undefined) return '';
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    },
    fetchTrades() {
      axios.get('http://localhost:5000/trades/')
        .then(response => {
          this.trades = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.trade-list-container {
  margin: 0 auto;
  padding: 20px;
  max-width: 1200px;
}

.table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: center; /* Center all data as requested */
  vertical-align: middle;
}

.table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.table tbody tr:nth-of-type(even) {
  background-color: #f9f9f9;
}

.text-right {
  text-align: right !important;
}
</style>