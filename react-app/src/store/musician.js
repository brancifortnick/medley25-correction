const GET_MUSICIANS = "musician/GET_MUSICIANS";
const GET_ONE = "musician/GET_ONE";
const ADD_MUSICIAN = "musician/ADD_MUSICIAN";
const DELETE_MUSICIAN = "musician/DELETE_MUSICIAN";
const UPDATE_BIOGRAPHY = "musician/UPDATE_BIOGRAPHY";

const getAllArtists = (musicians) => ({
  type: GET_MUSICIANS,
  payload: musicians,
});

const getOne = (musician) => ({
  type: GET_ONE,
  payload: musician,
});

const addMusician = (musician) => ({
  type: ADD_MUSICIAN,
  payload: musician,
});

const deleteMusician = (musician) => ({
  type: DELETE_MUSICIAN,
  payload: musician,
});

const updateBio = (musician) => ({
  type: UPDATE_BIOGRAPHY,
  payload: musician,
});

export const getAllMusicians = () => async (dispatch) => {
  const res = await fetch(`/api/musicians/`);
  if (res.ok) {
    const data = await res.json();
    dispatch(getAllArtists(data.musicians));
    return data;
  }
};

export const addingFullMusician = (profile_img, biography, userId, musician_name) => {
  return async (dispatch) => {
    try {
      // Validate inputs
      if (!profile_img || !biography || !userId || !musician_name) {
        console.error("Missing required parameters");
        return { error: "Missing required parameters" };
      }

      // Step 1: Upload image
      const formData = new FormData();
      formData.append("profile_img", profile_img);

      const imageRes = await fetch("/api/musicians/new-picture", {
        method: "POST",
        body: formData,
      });

      if (!imageRes.ok) {
        const errorData = await imageRes.json().catch(() => ({}));
        console.error("Image upload failed:", imageRes.status, errorData);
        return { error: `Image upload failed: ${imageRes.status}` };
      }

      const imageData = await imageRes.json();
      const profileImgUrl = imageData.url;

      // Step 2: Create musician with uploaded image URL
      const musicianData = new FormData();
      musicianData.append("profile_img", profileImgUrl);
      musicianData.append("biography", biography);
      musicianData.append("user_id", userId);
      musicianData.append("musician_name", musician_name);

      const musicianRes = await fetch("/api/musicians/new", {
        method: "POST",
        body: musicianData,
      });

      if (musicianRes.ok) {
        const newMusician = await musicianRes.json();
        dispatch(addMusician(newMusician));
        return newMusician;
      } else {
        const errorData = await musicianRes.json().catch(() => ({}));
        console.error("Musician creation failed:", musicianRes.status, errorData);
        return { error: `Musician creation failed: ${musicianRes.status}` };
      }
    } catch (error) {
      console.error("Error creating musician:", error);
      return { error: error.message };
    }
  };
};

export const getOneMusician = (id) => async (dispatch) => {
  const res = await fetch(`/api/musicians/${id}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(getOne(data));
  }
};

export const deleteOneMusician = (id) => async (dispatch) => {
  const res = await fetch(`/api/musicians/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    dispatch(deleteMusician(id));
  } else {
    console.log("Musician Can't be deleted");
  }
};

export const updateBiography = (formData, musicianId) => async (dispatch) => {
  const response = await fetch(`/api/musicians/${musicianId}/biography`, {
    method: "PUT",
    body: formData,
  });
  if (response.ok) {
    const biography = await response.json();
    dispatch(updateBio(biography));
  }
};

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_MUSICIANS:
      let newState = {};
      action.payload.forEach((musician) => {
        newState[musician.id] = musician;
      });
      return newState;
    case ADD_MUSICIAN:
      const addState = { ...state };
      addState[action.payload.id] = action.payload;
      return addState;
    case GET_ONE:
      return { ...action.payload };
    case DELETE_MUSICIAN:
      const currentState = { ...state };
      delete currentState[action.payload.id];
      return currentState;
    case UPDATE_BIOGRAPHY:
      return { ...action.payload };
    default:
      return state;
  }
}

