import axios from 'axios';
import {flashcardsDecksLink} from '../../shared/endpoints';
import * as actionTypes from '../actions/actionTypes';

/*
const initialState = {
	flashcardsDecks: {
		nameOfFirstDeck: [{card1}, {card2}],
		nameOfSecondDeck: [{card3}, {card4}, {card5}]
	},
};
*/

const initialState = {
	auth: {
		token: null,
		localId: null,
		name: '',
		loading: false,
		error: null,
		redirectPath: '/',
	},

	flashcardsDecks: {
		animals: [
			{front: 'gato', back: 'cat'},
			{front: 'perro', back: 'dog'},
		],
		verbs: [
			{front: 'ser', back: 'to be'},
			{front: 'comer', back: 'eat'},
		],
	},
};

const authStart = (state, action) => {
	return {...state, auth: {error: null, loading: true}};
};

const authFail = (state, action) => {
	return {...state, auth: {error: action.error, loading: false}};
};

const authSuccess = (state, action) => {
	return {
		...state,
		auth: {
			error: null,
			loading: false,
			token: action.token,
			localId: action.localId,
			name: action.name,
		},
	};
};

const authLogout = (state, action) => {
	return {...state, auth: {token: null, localId: null, name: ''}};
};

const authSetName = (state, action) => {
	return {...state, auth: {name: action.name}};
};

const addDeck = (state, action) => {
	const newFlashcardDecks = {...state.flashcardsDecks, [action.newDeck]: []};
	return {...state, flashcardsDecks: newFlashcardDecks};
};

const deleteDeck = (state, action) => {
	let newFlashcardDecks = {...state.flashcardsDecks};
	delete newFlashcardDecks[action.deckToDelete];
	return {...state, flashcardsDecks: newFlashcardDecks};
};

const pushCards = (state, action) => {
	let newFlashcardDecks = {...state.flashcardsDecks};
	let deckToChange = newFlashcardDecks[action.deckToModify];
	deckToChange.push(...action.cardsArray);
	return {
		...state,
		flashcardsDecks: newFlashcardDecks,
	};
};

const deleteCard = (state, action) => {
	let newFlashcardDecks = {...state.flashcardsDecks};
	let deckToChange = newFlashcardDecks[action.deckToModify];
	deckToChange.splice(action.cardToDelete, 1);

	return {
		...state,
		flashcardsDecks: newFlashcardDecks,
	};
};

const saveDataToDB = (state, action) => {
	// axios
	// 	.delete(`${flashcardsDecksLink}/${state.auth.localId}.json?auth=${state.auth.token}`)
	// 	.then(response => {
	// 		axios
	// 			.post(`${flashcardsDecksLink}/${state.auth.localId}.json?auth=${state.auth.token}`, {
	// 				...state.flashcardsDecks,
	// 			})
	// 			.then(response => {})
	// 			.catch(error => console.log(error)); //
	// 	})
	// 	.catch(error => console.log(error));
	return state;
};

const retrieveData = (state, action) => {
	if (action.decks) {
		return {...state, flashcardsDecks: action.decks};
	} else {
		return {...state, flashcardsDecks: initialState.flashcardsDecks};
	}
};

const Reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.ADD_DECK:
			return addDeck(state, action);
		case actionTypes.DELETE_DECK:
			return deleteDeck(state, action);
		case actionTypes.PUSH_CARDS:
			return pushCards(state, action);
		case actionTypes.DELETE_CARD:
			return deleteCard(state, action);
		case actionTypes.RETRIEVE_DATA:
			return retrieveData(state, action);
		case actionTypes.SAVE_DATA_TO_DB:
			return saveDataToDB(state, action);
		case actionTypes.AUTH_START:
			return authStart(state, action);
		case actionTypes.AUTH_FAIL:
			return authFail(state, action);
		case actionTypes.AUTH_SUCCESS:
			return authSuccess(state, action);
		case actionTypes.AUTH_LOGOUT:
			return authLogout(state, action);
		case actionTypes.AUTH_SET_NAME:
			return authSetName(state, action);
		default:
			return state;
	}
};

export default Reducer;
