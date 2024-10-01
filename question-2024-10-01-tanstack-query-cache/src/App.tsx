import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useQuery } from "@tanstack/react-query";

function App() {
  const [count, setCount] = useState(0);

  const [toggleValue, setToggleValue] = useState("asc");
  const { data } = useQuery({
    queryKey: [toggleValue],
    queryFn: async () => {
      const response = await fetch(
        "https://catfact.ninja/fact?toggleValue=" + toggleValue
      );
      return response.json();
    },
  });

  const toggle = () => {
    if (toggleValue === "asc") {
      setToggleValue("desc");
    } else {
      setToggleValue("asc");
    }
  };
  useEffect(() => {
    console.log("data", toggleValue, data);
  }, [data, toggleValue]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={toggle}>
          Toggle direction to trigger tanstack query
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
