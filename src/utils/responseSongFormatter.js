const formatSongResponse = (song) => {
  const songObj = song.toObject ? song.toObject() : song;
  return {
    ...songObj,
    artists: songObj.artists?.map(artist => artist.name || artist) || []
  };
};

module.exports = { formatSongResponse };