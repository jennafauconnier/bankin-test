import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'

export default function Account() {
  const [accounts, setAccounts] = useState([])
  const [roundedSum, setRoundedSum] = useState(0)
  const [accessToken, setAccessToken] = useState('')

  // Ici j'aurais aimer pourvoir rajouter un input pour ne pas avoir a mettre les données en dur, ou même utilisé dotenv. 

  const email = "user1@mail.com"
  const password = "a!Strongp#assword1"

  useEffect(() => {
    const login = async () => {
        try {
            const response = await axios.post('http://localhost:4000/authenticate', { email, password })
            setAccessToken(response.data.access_token);
          } catch (error) {
            console.log('Authentication error', error);
          }
    }

    const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:4000/accounts')
          setAccounts(response.data.accounts)
          setRoundedSum(response.data.rounded_sum)
        } catch (error) {
          console.log('Error retrieving accounts', error)
        }
      };
  
      login()
      fetchData()
  }, [])
  return (
    <Container>
        <Header>
            <h1>Bankin'</h1>
        </Header>
      
      <h2>Mes comptes</h2>
      <h3>Voici le détail de vos soldes : </h3>

      <ListContainerNames>
      {accounts.map((account, i)=> (
          <div key={i}>
            <p>Nom du compte : {account.name}</p>
            <p>Solde : {account.balance}</p>
          </div>
        ))}
      </ListContainerNames>

      <Button>Optimiser mon épargne</Button>
    </Container>
  )
}

const Container = styled.div`
  position: absolute;
  height: 600px;
  width: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 18px;
  color: #00213C;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
    background: #50BAFF;
    width: 100%;
    color: #fff;
`

const Button = styled.button`
  margin-left: 10px;
  cursor: pointer;
  position: relative;
  outline: none;
  border: none;
  text-decoration: none;
  box-sizing: border-box;
  color: red;
  background-color: #6562FD;
  display: flex;
  align-items: center;

  color: #fff;

  justify-content: center;

  transition: opacity 0.2s ease-out;
  height: 40px;
  width: 300px;
  border-radius: 5px;
  font-size: 22px;
`;

const ListContainerNames = styled.div`
  color: #00213C;
  font-size: 15px;
`;