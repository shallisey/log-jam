import React, { useState } from "react";
import "./MockDeck.css";

const MockDeck = ({ text }) => {
  return (
    <div>
      <div className="fakeCard"> {text}</div>
      <div className="fakeCard">{text} </div>
      <div className="fakeCard">{text} </div>
      <div className="fakeCard">{text} </div>
      <div className="fakeCard">{text} </div>
    </div>
  );
};

export default MockDeck;
