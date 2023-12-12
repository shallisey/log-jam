import React, { useState } from "react";
import "./Login.scss";

const Login = ({ setName }) => {
  const rules = [
    { title: "Hello 1", content: "Welcome to LogJam 1" },
    { title: "Hello 2", content: "Welcome to LogJam 2" },
    { title: "Hello 3", content: "Welcome to LogJam 3" },
  ];

  const [ruleIndex, setRuleIndex] = useState(0);

  return (
    <div className="login-container">
      <div className="login">
        <h2>{rules[ruleIndex] && rules[ruleIndex].title}</h2>
        <p>{rules[ruleIndex] && rules[ruleIndex].content}</p>

        {ruleIndex === rules.length - 1 && (
          <>
            <p>Enter you name Below to join a logjam game</p>
            <input type="text" />
          </>
        )}
        {!!ruleIndex && (
          <button onClick={() => setRuleIndex(ruleIndex - 1)}>Go Back</button>
        )}
        {ruleIndex !== rules.length - 1 && (
          <button onClick={() => setRuleIndex(ruleIndex + 1)}>next</button>
        )}
        {ruleIndex === rules.length - 1 && (
          <button className="join-game-btn" onClick={() => setName("Lucy")}>
            Join Game!
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
