import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { getAllMusicians } from "../../store/musician";

// import DeleteMusician from "../DeleteMusician";
import "./UsersMusicians.css";

const UsersMusicians = ({ userId }) => {
  const dispatch = useDispatch();
  const musicians = useSelector((state) => Object.values(state.musician));
  const user = useSelector((state) => state.session.user);

  // Use the passed userId or fall back to current user
  const targetUserId = userId || user.id;

  useEffect(() => {
    dispatch(getAllMusicians());
  }, [dispatch]);

  console.log("UsersMusicians Debug:", {
    targetUserId,
    musicians,
    allMusicianUserIds: musicians.map(m => m.user_id)
  });

  //! I think the errror is comming from NavLink potentially ==== not showing musicians on users/id route ---- find why not!!!!!!!!!

  const usersMusicians = musicians.map((musician, idx) => {
    return targetUserId === Number(musician.user_id) ? (
      <div key={idx} className="musician-card">
        <div className="musician-image-container">
          <img
            src={musician.profile_img}
            alt={`${musician.musician_name} profile`}
            className="musician-image"
          />
          <div className="musician-overlay">
            <h3 className="musician-name">{musician.musician_name}</h3>
            <NavLink
              to={`/musicians/${musician.id}`}
              className="view-musician-btn"
            >
              View Profile
            </NavLink>
          </div>
        </div>
      </div>
    ) : null;
  });

  return (
    <div className="musicians-page-container">
      <div className="page-header">
        <h2 className="page-title">Your Musicians</h2>
        <p className="page-subtitle">Manage and view your musical profiles</p>
      </div>
      <div className="musicians-grid">
        {usersMusicians.length > 0 ? (
          usersMusicians
        ) : (
          <div className="no-musicians">
            <p>No musicians found. Create your first musician profile!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersMusicians;
