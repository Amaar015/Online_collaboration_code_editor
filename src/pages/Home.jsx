import React, { useState } from "react";
import logo from "../assets/logo-1.png";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, SetroomId] = useState("");
  const [Username, SetUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    SetroomId(id);
    toast.success("Create a new room");
  };
  const joinRoom = () => {
    if (!roomId || !Username) {
      toast.error("Room IF & username is required");
      return;
    }
    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        Username,
      },
    });
  };

  const handleInputEnter = (e) => {
    console.log("event", e.code);
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img src={logo} className="homePageLogo" alt="Abdullah Editor" />
        <h4 className="mainlabel">Enter your data</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            onChange={(e) => SetroomId(e.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
            placeholder="Room Id"
          />
          <input
            type="text"
            className="inputBox"
            onChange={(e) => SetUsername(e.target.value)}
            value={Username}
            onKeyUp={handleInputEnter}
            placeholder="User Name"
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you do not have an invite then create &nbsp;
            <a href="/" className="createNewBtn" onClick={createNewRoom}>
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with by <a href="ammmar">Amaar Hassnain</a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
