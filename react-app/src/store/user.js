const GET_USER = "user/GET_USER";
const ADD_MUSICIAN = "user/ADD_MUSICIAN";


const getUser = (user) => ({
    type: GET_USER,
    payload: user,
})

const addMusician = (data) => ({
    type: ADD_MUSICIAN,
    payload: data,
})



export const getOneUser = (userId) => async (dispatch) => {
  const res = await fetch(`/api/users/${userId}`);
  if (res.ok) {
    const user = await res.json();
    dispatch(getUser(user));
    return user;
  }
};

export const addMusicianProfile = (userId) => async (dispatch) => {
  const res = await fetch(`/api/users/${userId}/add-musician`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (res.ok) {
    const data = await res.json();
    dispatch(addMusician(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

const initialState = {};

export default function usersReducer(state = initialState, action){
    switch (action.type){
        case GET_USER:
            return {
                ...action.payload
            }
        case ADD_MUSICIAN:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
};
