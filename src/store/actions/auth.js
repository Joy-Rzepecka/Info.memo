import axios from 'axios';
import {signinLink, signupLink, updateProfileLink} from '../../shared/endpoints';

import * as actionTypes from './actionTypes';

const authStart = () => {
	return {
		type: actionTypes.AUTH_START,
	};
};

const authSuccess = (token, localId, name) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		token: token,
		localId: localId,
		name: name,
	};
};

const authFail = error => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error,
	};
};

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('expiresOn');
	localStorage.removeItem('localId');
	localStorage.removeItem('name');

	return {
		type: actionTypes.AUTH_LOGOUT,
	};
};

export const handleAuthTimeout = expirationTime => {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout());
		}, expirationTime * 1000);
	};
};
//It's not even an action, but had to put this helper function somewhere
const authChangeUserProfile = (token, name) => {
	axios.post(updateProfileLink, {idToken: token, displayName: name});
};

export const auth = (email, password, isSignup, name = '') => {
	return dispatch => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true,
		};

		let url = signinLink;
		if (!isSignup) {
			url = signupLink;
		}
		axios
			.post(url, authData)
			.then(response => {
				const {
					data: {expiresIn, idToken, localId},
				} = response;
				const expiresOn = new Date(new Date().getTime() + expiresIn * 1000);
				localStorage.setItem('token', idToken);
				localStorage.setItem('expiresOn', expiresOn);
				localStorage.setItem('localId', localId);
				dispatch(authSuccess(idToken, localId));
				dispatch(handleAuthTimeout(expiresIn));
				if (name && name.trim() !== '') {
					authChangeUserProfile(idToken, name);
				}
			})
			.catch(err => {
				dispatch(authFail(err.response.data.error));
			});
	};
};
