import { useDispatch, useSelector } from "react-redux";
import { toggleSongPrivacy, getMusiciansTracks } from "../../store/song";
import React from "react";
import "./SongPrivacyToggle.css";

function SongPrivacyToggle({ song, musicianId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const musician = useSelector(state => state.musician);

  const handleToggle = async () => {
    await dispatch(toggleSongPrivacy(song.id, !song.is_private));
    // Refetch the songs to update the display
    await dispatch(getMusiciansTracks(musicianId));
  };

  // Only show the button if the current user owns this musician profile
  if (!user || user.id !== Number(musician.user_id)) {
    return null;
  }

  return (
    <button onClick={handleToggle} className="privacy-toggle-btn">
      {song.is_private ? "Make Public" : "Make Private"}
    </button>
  );
}

export default SongPrivacyToggle;
