import React from "react";
import Avatar from "react-avatar";

const Client = ({ client }) => {
  return (
    <div className="client">
      <Avatar name={client} size={50} round="140px" />
      <span className="userName">{client}</span>
    </div>
  );
};

export default Client;
