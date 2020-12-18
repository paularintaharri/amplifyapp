import React, { useState, useEffect } from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listCards } from './graphql/queries';
import { createCard as createCardMutation, deleteCard as deleteCardMutation } from './graphql/mutations';
import { API, Storage } from 'aws-amplify';

const initialFormState = { name: '', description: '' }

function App() {
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [options, setOption] = useState(null);
  const [randomNumber, setRandomNumber] = useState(0);  
  const [answere, setAnswere] = useState('')

  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    const apiData = await API.graphql({ query: listCards });
    const cardsFromAPI = apiData.data.listCards.items;
    await Promise.all(cardsFromAPI.map(async card => {
      if (card.image) {
        const image = await Storage.get(card.image);
        card.image = image;
      }
      return card;
    }))
    setCards(apiData.data.listCards.items);
  }

  async function createCard() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createCardMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setCards([ ...cards, formData ]);
    setFormData(initialFormState);
  }

  async function deleteCard({ id }) {
    const newCardsArray = cards.filter(card => card.id !== id);
    setCards(newCardsArray);
    await API.graphql({ query: deleteCardMutation, variables: { input: { id } }});
  }

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchCards();
  }

  //Starts the game
  function startGame() {
    setOption(1);
  }

  //Back to main page
  function resetGame() {
      setOption(null);
  }

  //Random card
  function generateRandomNumber(){
    const randomNumber = Math.floor(Math.random() * cards.length);
    setRandomNumber(randomNumber);
  }

  //Checks the answere
  function submitAnswere(){
    console.log(answere);
    if (answere === cards[randomNumber].name) {
      console.log("Oikein");
    }
    else {
      console.log("Väärin");
    }
  }

  return (
    <div className="App">
      <h1>Memory game</h1>
      <div>
        
        {options === null ? (
          //Main page
          <>
          <h2>Add new card</h2>
          <input
            onChange={e => setFormData({ ...formData, 'name': e.target.value})}
            placeholder="Card name"
            value={formData.name}
          />
          <input
            onChange={e => setFormData({ ...formData, 'description': e.target.value})}
            placeholder="Card description"
            value={formData.description}
          />
          <input
            type="file"
            onChange={onChange}
          />
          <button onClick={createCard}>Create card</button>
          <div style={{marginBottom: 30}}>
          {
            cards.map(card => (
              <div key={card.id || card.name}>
                <h2>{card.name}</h2>
                <p>{card.description}</p>
                <button onClick={() => deleteCard(card)}>Delete card</button>
                {
                  card.image && <img src={card.image} style={{width: 400}}  alt=""/>
                }
              </div>
            ))
          }
          </div>

          <button onClick={startGame}>Start game</button>
          </>

          ) : (
          //Game page
            <>
            <h2>Good luck</h2>
            <div style={{marginBottom: 30}}>
              <div id='card'>
                <img src={cards[randomNumber].image} style={{width: 400}} alt=""/>
              </div>  
              <div id='name' style={{display: 'none'}}>
                  {cards[randomNumber].name}
              </div> 

              <input id='answere' type='text'  placeholder="write answere"  
              onChange={event => setAnswere(event.target.value)} />

              <button onClick={submitAnswere}>Submit</button>

              <button onClick={generateRandomNumber}>Next</button>
            </div>
            <button onClick={resetGame}>Start over</button>
            </>
          )}
      </div>

      <AmplifySignOut />
    </div>
  );
} 
export default withAuthenticator(App);