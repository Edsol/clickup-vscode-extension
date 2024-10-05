import * as React from "react";

const App = () => {
  const [message, setMessage] = React.useState(
    "Hello from React in a VS Code WebView!AVBB"
  );

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={() => setMessage("You clicked the button!")}>
        Click Me
      </button>
    </div>
  );
};
