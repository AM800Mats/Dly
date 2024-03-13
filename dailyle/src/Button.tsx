import React, { useState } from "react";

function Button() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <>
      <p className="count">Current Count:{count}</p>
      <button onClick={handleClick}>Increase Count</button>
    </>
  );
}

export default Button;
