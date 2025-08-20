<template>
  <div>
    <h3>Trade Log</h3>
    <table class="table">
      <thead class="thead-light">
        <tr>
          <th>Symbol</th>
          <th>Contract</th>
          <th>Price Bought</th>
          <th>Price Sold</th>
          <th>Date Bought</th>
          <th>Reason</th>
          <th>Outcome</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trade in trades" :key="trade._id">
          <td>{{ trade.symbolTraded }}</td>
          <td>{{ trade.futureContractName }}</td>
          <td>{{ trade.priceBought }}</td>
          <td>{{ trade.priceSold }}</td>
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
.table {
  width: 100%;
  margin-top: 20px;
}
</style>