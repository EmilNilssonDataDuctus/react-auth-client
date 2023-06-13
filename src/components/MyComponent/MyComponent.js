import { useState } from "react";

const MyComponent = () => {
  const types = ["button", "submit", "text", "email", "password", "number"];
  const [currentState, setCurrentState] = useState(1);

  const onRangeChange = (newState) => {
    setCurrentState(newState);
  };

  const inputComponent = (
    <div>
      {types[(currentState + 1) % 6]}
      <input
        type={types[(currentState + 1) % 6]}
        value={types[(currentState + 1) % 6]}
      />
    </div>
  );

  const generateInputComponents = () => {
    let components = types.map((type) => (
      <div>
        <input type={type} value={type} />
      </div>
    ));
    return components;
  };

  return (
    <div>
      <div>{types[currentState]}</div>

      <input
        type="range"
        value={currentState}
        step="1"
        max={types.length - 1}
        onChange={(evt) => setCurrentState(evt.target.value)}
      />

      <input type={types[currentState]} value={types[currentState]} />
      <br />
      <br />
      {generateInputComponents()}
    </div>
  );
};

export default MyComponent;
