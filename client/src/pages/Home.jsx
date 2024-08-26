import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [room, setRoom] = useState("");
  return (
    <div className="text-center p-[20px] bg-black min-h-screen text-white roboto-regular">
      <h1 className="text-[40px] roboto-medium">Board Game</h1>
      <h2 className="text-lg text-[#b3a6a6] mt-4">Join the room</h2>
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Enter room name"
        className="bg-white text-black p-2 rounded mt-4"
      />
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to={`/${room}`}
          className="bg-[#cbe72c] px-3 p-1 mt-4 text-black roboto-medium"
        >
          Join Room
        </Link>
        <Link
          to={`/${room}`}
          state={{ spectate: true }}
          className="bg-[#cbe72c] px-3 p-1 mt-4 text-black roboto-medium"
        >
          Spectate
        </Link>
      </div>
    </div>
  );
};

export default Home;
