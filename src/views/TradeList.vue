<template>
  <div class="trade-list-container">
    <h3>Trade Log</h3>
    <div v-if="statusMessage" :class="statusType" class="status-message">{{ statusMessage }}</div>
    <table class="table">
      <thead class="thead-light">
        <tr>
          <th class="icon-col">Type</th>
          <th>Symbol</th>
          <th>Contract</th>
          <th class="text-right">Initial Price</th>
          <th class="text-right">Final Price</th>
          <th>Date Opened</th>
          <th>Date Closed</th>
          <th>Outcome</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trade in trades" :key="trade._id">
          <td class="icon-col">
            <img v-if="trade.tradeType === 'long'" :src="bullIcon" alt="Long trade" class="trade-icon">
            <img v-else-if="trade.tradeType === 'short'" :src="bearIcon" alt="Short trade" class="trade-icon">
          </td>
          <td>{{ trade.symbol }}</td>
          <td>{{ trade.futureContract }}</td>
          <td class="text-right">{{ formatCurrency(trade.initialPrice) }}</td>
          <td class="text-right">{{ formatCurrency(trade.finalPrice) }}</td>
          <td>{{ new Date(trade.initialDateTime).toLocaleString() }}</td>
          <td>{{ trade.finalDateTime ? new Date(trade.finalDateTime).toLocaleString() : '' }}</td>
          <td>{{ trade.outcome }}</td>
          <td>
            <div class="actions-cell">
              <button @click="editTrade(trade._id)" class="btn btn-primary btn-sm">Edit</button>
              <button @click="deleteTrade(trade._id)" class="btn btn-danger btn-sm">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import bullIcon from '@/assets/bull.png';
import bearIcon from '@/assets/bear.png';

export default {
  name: 'TradeList',
  data() {
    return {
      trades: [],
      statusMessage: '',
      statusType: '',
      bullIcon,
      bearIcon,
    };
  },
  mounted() {
    this.fetchTrades();
  },
  methods: {
    editTrade(id) {
      this.$router.push(`/edit/${id}`);
    },
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
    },
    deleteTrade(id) {
      this.statusMessage = ''; // Clear previous messages
      // Ask for confirmation before deleting
      if (window.confirm('Are you sure you want to delete this trade? This action cannot be undone.')) {
        axios.delete(`http://localhost:5000/trades/delete/${id}`)
          .then(res => {
            console.log(res.data);
            this.statusMessage = 'Trade deleted successfully.';
            this.statusType = 'success';
            // Remove the trade from the local list to update the UI instantly
            this.trades = this.trades.filter(trade => trade._id !== id);
          })
          .catch(err => {
            console.error('Error deleting trade:', err);
            this.statusMessage = 'Error deleting trade. Please check the server logs.';
            this.statusType = 'error';
          });
      }
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

.icon-col {
  width: 40px;
  padding: 8px;
}

.trade-icon {
  width: 24px;
  height: 24px;
}

</style>