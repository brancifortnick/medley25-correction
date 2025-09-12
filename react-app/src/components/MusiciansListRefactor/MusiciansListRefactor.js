import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { getAllMusicians } from "../../store/musician";
import "./MusiciansListRefactor.css";

function MusiciansListRefactor() {
  const dispatch = useDispatch();
  const musicians = useSelector((state) => Object.values(state.musician));

  useEffect(() => {
    dispatch(getAllMusicians());
  }, [dispatch]);

  const musiciansList = musicians.map((musician) => {
    return (
      <div key={musician.id} className="musicians-container">
        <div className="musician-div-container">
          <NavLink to={`/musicians/${musician.id}`}>
            <img
              style={{ width: "300px", height: "200px" }}
              src={musician.profile_img}
              alt={`${musician.musician_name} profile`}
              className="card"
            />
            <div className="musician-name">{musician.musician_name}</div>
          </NavLink>
        </div>
      </div>
    );
  });
  return (
    <div className='musicians-list-container'>
      <div className="musicians-list-components">{musiciansList}</div>
    </div>
  );
}

export default MusiciansListRefactor;
