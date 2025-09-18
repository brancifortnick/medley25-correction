import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getOneUser, addMusicianProfile } from "../../store/user";
import UsersMusicians from "../UsersMusicians/UsersMusicians";
// import backdrop from "../../assets/blueandpink.jpg";
import "./User.css";

function User() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const usersInformation = useSelector((state) => state.usersReducer);
  const user = useSelector(state => state.session.user);
  
  const [isCreatingMusician, setIsCreatingMusician] = useState(false);

  useEffect(() => {
    dispatch(getOneUser(Number(userId)));
  }, [dispatch, userId]);

  const handleAddMusician = async () => {
    setIsCreatingMusician(true);
    try {
      const result = await dispatch(addMusicianProfile(userId));
      if (result.errors) {
        alert(`Error: ${result.errors}`);
      } else {
        alert("Musician profile created successfully! You can now edit it.");
        // Refresh the user data to show the new musician
        dispatch(getOneUser(Number(userId)));
      }
    } catch (error) {
      console.error("Error creating musician:", error);
      alert("An error occurred while creating the musician profile.");
    } finally {
      setIsCreatingMusician(false);
    }
  };

  return (
    <div className="user-page-container">
 
  
    
      {/* <div id="your-musicians-text">
        <strong> Your Musicians </strong>
      </div> */}

      <div id="usersMusicians-component">

     
        <div id="component">
          <Link
            style={{
              textDecoration: "none",
              color: "black",
              marginLeft: "10px",
              padding: "8px 16px",
              backgroundColor: "#c4b180",
              borderRadius: "6px",

            }}
            to={`/users/${userId}/add-musician`}
          >
            Add Musician Profile
          </Link>
          <UsersMusicians userId={Number(userId)}/>
        </div>
      </div>
    </div>
  );
}
export default User;

//-REFACTORED BELOW CODE

// const [user, setUser] = useState({});
// useEffect(() => {
//   if (!userId) {
//     return;
//   }
//   (async () => {
//     const response = await fetch(`/api/users/${userId}`);
//     const user = await response.json();
//     setUser(user);
//   })();
// }, [userId]);

// if (!user) {
//   return null;
// }
