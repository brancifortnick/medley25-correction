import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteTrack from "../DeleteTrack/DeleteTrack";
import "./AllSongs.css";
import { getMusiciansTracks } from "../../store/song";
import "./AllSongs.css";

import SongPrivacyToggle from "../SongPrivacyToggle/SongPrivacyToggle";

const AllSongs = ({ musicianId }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const songs = useSelector((state) => Object.values(state.song)); //array of obj with value of an obj
  const musician = useSelector(state => state.musician);
  
  const isOwner = user && user.id === Number(musician.user_id);

  useEffect(() => {
    dispatch(getMusiciansTracks(musicianId));
  }, [dispatch, musicianId]);
console.log("Privacy status:", songs.map(song => song.is_private));
  // Separate songs into public and private
  const publicSongs = songs.filter(song => !song.is_private);
  const privateSongs = songs.filter(song => song.is_private);

  const renderSong = (song) => (
    <div key={song.id} className="song-id">
      <p className="title-p">Title: {song.title} </p>
      <div id="audio-player">
        
        <audio src={song.file_url} controls></audio>
        {isOwner && (
          <DeleteTrack musicianId={musicianId} songId={song.id} />
        )}
      </div>
       <SongPrivacyToggle key={song.id} song={song} musicianId={musicianId} />
    </div>
  );

  return (
    <div className="songs-container">
      {isOwner && privateSongs.length > 0 ? (
        <div className="songs-columns">
          <div className="public-songs-column">
            <h3 className="songs-column-title">Public Songs</h3>
            {publicSongs.length > 0 ? (
              publicSongs.map(renderSong)
            ) : (
              <p className="no-songs-message">No public songs yet</p>
            )}
          </div>
          <div className="private-songs-column">
            <h3 className="songs-column-title">Private Songs</h3>
            {privateSongs.map(renderSong)}
          </div>
        </div>
      ) : (
        <div className="single-column">
          {publicSongs.length > 0 ? (
            publicSongs.map(renderSong)
          ) : (
            <p className="no-songs-message">No songs yet</p>
          )}
        </div>
      )}
    </div>
  );
};
export default AllSongs;
