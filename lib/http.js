const axios = require('axios');

axios.interceptors.response.use((res) => {
  return res.data;
})

async function getRepoList() {
  return axios.get('https://api.github.com/orgs/loki-cli/repos')
}

module.exports = {
  getRepoList
}