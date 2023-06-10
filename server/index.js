const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const axios = require('axios')


const app = express()
const PORT = 4000

app.use(
    bodyParser.urlencoded({
      extended: true,
  }),
)
app.use(express.json())
app.use(cors())


let accessToken = ''

function calculateTotal(accounts) {
  let total = 0;

  for (const account of accounts) {
    total += account.balance;
  }

  const roundedTotal = Math.ceil(total / 100) * 100;

  return roundedTotal;
}

app.post('/authenticate', async (req, res) => {
  const { email, password } = req.body

  const headers = {
    'Bankin-Version': '2019-08-22',
    'Bankin-Device': '26ac2fb6-4b1f-4e7c-a35d-aaa40b5c00b5',
  };

  try {
    const response = await axios.post(
      'https://sync.bankin.com/v2/authenticate',
      { email, password },
      { headers }
    )

    accessToken = response.data.access_token;

    res.json(response.data)
  } catch (error) {
    console.log('Authentication error', error.message);
    res.status(500).json({ error: 'Error authentication' })
  }
})

app.get('/accounts', async (req, res) => {
  const token = accessToken;

  const headers = {
    'Bankin-Version': '2019-08-22',
    'Bankin-Device': '26ac2fb6-4b1f-4e7c-a35d-aaa40b5c00b5',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get('https://sync.bankin.com/v2/accounts', { headers })

    const accounts = response.data.resources

    const filteredAccounts = accounts.map((account) => ({
      name: account.name,
      balance: account.balance,
    }));

    const roundedSum = calculateTotal(accounts)

    res.json({ rounded_sum: roundedSum, accounts: filteredAccounts })
  } catch (error) {
    console.log('Error retrieving accounts', error);
    res.status(500).json({ error: 'Error retrieving accounts' })
  }
})


app.listen(PORT, () => {
    console.log(`Server launching on port : ${PORT} 🚀`)
})