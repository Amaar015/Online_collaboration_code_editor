import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/logo-1.png";
import Client from "../components/Client";
import EditorCode from "../components/EditorCode";
import { initSocket } from "../socket";
import Actions from "../Actions";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

const Editor = () => {
  // const navigate=useNavigate('/')
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams(); // Get roomId from URL
  const socketRef = useRef(null);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.emit(Actions.JOIN, {
        roomId,
        username: location.state?.Username,
      });

      // Handle any other socket events like joining, disconnect, etc.
      socketRef.current.on("connect_error", (err) => handleError(err));

      function handleError(e) {
        console.log(`Socket Error ${e.message}`);
        toast.error("Socket connection failed please try again");
      }
      socketRef.current.on("connect", () => {
        console.log("Successfully connected to WebSocket server");
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Disconnected:", reason);
      });
      // listening for joining
      socketRef.current.on(
        Actions.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.Username) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(Actions.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(Actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(Actions.JOINED);
      socketRef.current.off(Actions.DISCONNECTED);
    };
  }, [roomId, location.state?.Username]); // Add dependencies

  function leaveRoom() {
    navigate("/");
  }
  if (!location.state) {
    return <Navigate to="/" />;
  }
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (error) {
      toast.error("Could not copy the Room ID");
    }
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src={logo} className="logoImage" alt="" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} client={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy Room Id
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <EditorCode
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
