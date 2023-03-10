import axios from 'axios';
import { userSliceActions } from '../userSlice';
import { cartSliceActions } from '../cartSlice';
export const registerNewUser = (user) => {
    return async (dispatch) => {
        dispatch(userSliceActions.setStatus('pending'));
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}api/user/register`, user);

            if (res.data.success) {
                dispatch(userSliceActions.setStatus('success'));
                dispatch(userSliceActions.setMessage('Account successfully created'));
            } else if (res.data.message === 'email exists') {
                dispatch(userSliceActions.setStatus('failed'));
                dispatch(userSliceActions.setMessage('Email already exists'));
            }
        } catch (error) {
            dispatch(userSliceActions.setMessage('Account creation failed'));
            dispatch(userSliceActions.setStatus('failed'));
        }
    };
};
export const loginUser = (user) => {
    return async (dispatch, getState) => {
        dispatch(userSliceActions.setStatus('pending'));
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}api/user/login`, user);

            if (res.data.success) {
                dispatch(userSliceActions.setStatus('success'));
                // SAVING OUR USER OBJECT TO OUR USER SLICE
                dispatch(userSliceActions.setUser(res.data.user));
                // SETTING THE USER OBJECT TO THE LOCALSTORAGE
                localStorage.setItem('userInfo', JSON.stringify(getState().user.user));
                dispatch(userSliceActions.setMessage('Account successfully logged in'));
            } else if (res.data.message === 'error') {
                dispatch(userSliceActions.setStatus('failed'));
                dispatch(userSliceActions.setMessage('There is an error'));
            } else {
                dispatch(userSliceActions.setStatus('failed'));
                dispatch(userSliceActions.setMessage('Email or Password does not exist'));
            }
        } catch (error) {
            dispatch(userSliceActions.setMessage('Login failed'));
            dispatch(userSliceActions.setStatus('failed'));
        }
    };
};
export const logoutUser = () => {
    return async (dispatch) => {
        dispatch(userSliceActions.logout());
        localStorage.removeItem('userInfo');
        dispatch(cartSliceActions.resetCart());
        localStorage.removeItem('cartInfo');
    };
};
export const getUserDetails = (userId) => {
    return async (dispatch, getState) => {
        const user = getState().user.user;
        dispatch(userSliceActions.setStatus('pending'));
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (res.data.success) {
                dispatch(userSliceActions.setStatus('success'));
                dispatch(userSliceActions.setUser(res.data.user));
                localStorage.setItem('userInfo', JSON.stringify(getState().user.user));

                dispatch(userSliceActions.setMessage('User details successfully fetched'));
            } else {
                dispatch(userSliceActions.setStatus('failed'));
                dispatch(userSliceActions.setMessage('Cannot fetch user data'));
            }
        } catch (error) {
            dispatch(userSliceActions.setMessage('fetching user detail failed'));
            dispatch(userSliceActions.setStatus('failed'));
        }
    };
};
export const updateProfile = (updatedUserDetails, userId) => {
    return async (dispatch, getState) => {
        const user = getState().user.user;
        dispatch(userSliceActions.setStatus('pending'));
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API}api/user/${userId}`,
                {
                    updatedUserDetails,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            if (res.data.success) {
                dispatch(userSliceActions.setStatus('success'));
                dispatch(userSliceActions.setMessage('User details successfully updated'));
                dispatch(userSliceActions.setUser({ ...res.data.user, token: user.token }));
                localStorage.setItem(
                    'userInfo',
                    JSON.stringify({ ...res.data.user, token: user.token })
                );
            } else {
                dispatch(userSliceActions.setStatus('failed'));
                dispatch(userSliceActions.setMessage('Cannot update user data'));
            }
        } catch (error) {
            dispatch(userSliceActions.setMessage('updating user detail failed'));
            dispatch(userSliceActions.setStatus('failed'));
        }
    };
};
