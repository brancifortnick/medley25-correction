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
      <ol>
        <strong> Username | </strong> {usersInformation.username}
      </ol>
      <ol>
        <strong> Email | </strong> {usersInformation.email}
      </ol>


        
        <Link
          style={{ 
            textDecoration: "none", 
            color: "white", 
            marginLeft: "10px",
            padding: "12px 24px",
            background: "linear-gradient(135deg, #5a4718 0%, #6b5423 100%)",
            borderRadius: "8px",
            display: "inline-block",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(90, 71, 24, 0.3)",
            transition: "all 0.3s ease"
          }}
          to={`/users/${userId}/add-musician`}
        >
          Create Full Musician Profile
        </Link>
  
      {/* <div id="your-musicians-text">
        <strong> Your Musicians </strong>
      </div> */}

      <div id="usersMusicians-component">
        <div id="component">
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
