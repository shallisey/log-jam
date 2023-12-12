import React, { useState } from "react";
import "./Modal.scss";

const Modal = ({ clickEvent }) => {
  return (
    <div className="modal-container">
      <div className="modal">
        <button onClick={() => clickEvent()}>Start Game!</button>
      </div>
    </div>
  );
};

export default Modal;
