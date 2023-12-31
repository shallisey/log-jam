import React, { useState } from "react";
import "./MockDeck.css";

const MockDeck = ({ isShort }) => {
  return (
    <div className="mockDeckContainer">
      {Array.from({ length: 5 }, (_, i) => (
        // <div className="fake-card-overlay">
        <div className={isShort && i === 4 ? "fakeCard disapear" : "fakeCard"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="64"
            width="62"
            viewBox="0 -256 496 512"
          >
            {/* <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--> */}
            <path
              opacity="1"
              fill="#1E3050"
              d="M490 241.7C417.1 169 320.6 71.8 248.5 0 83 164.9 6 241.7 6 241.7c-7.9 7.9-7.9 20.7 0 28.7C138.8 402.7 67.8 331.9 248.5 512c379.4-378 15.7-16.7 241.5-241.7 8-7.9 8-20.7 0-28.6zm-241.5 90l-76-75.7 76-75.7 76 75.7-76 75.7z"
            />
          </svg>
        </div>
        // </div>
      ))}
    </div>
  );
};

export default MockDeck;
