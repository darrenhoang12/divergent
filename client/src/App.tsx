import "./App.css";
import { useState } from "react";

function App() {
  const [warehouseName, setWarehouseName] = useState("");
  const [zoneShelves, setZoneShelves] = useState(
    Array.from({ length: 12 }, () => 1)
  );

  function handleZoneShelvesChange(index: number, value: number) {
    const updatedZones = [...zoneShelves];
    updatedZones[index] = value;
    setZoneShelves(updatedZones);
    console.log(zoneShelves);
  }

  function createFactory() {
    console.log(zoneShelves);
  }

  return (
    <div>
      <h1>Factory X Factory Creator</h1>
      <form>
        <label htmlFor="warehouse_name">Warehouse Name:</label>
        <input
          type="text"
          id="warehouse_name"
          value={warehouseName}
          onChange={(e) => setWarehouseName(e.target.value)}
        ></input>
        <h4>Select up to a maximum of 10 shelves per zone</h4>
        <div className="zones">
          {zoneShelves.map((value: number, index: number) => (
            <div className="zone" key={index}>
              <label htmlFor={`zone${index}`}>Zone {index + 1}:</label>
              <select
                className="selectBox"
                id={`zone${index}`}
                value={value}
                onChange={(e) => {
                  handleZoneShelvesChange(index, parseInt(e.target.value));
                }}
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button className="submit" onClick={createFactory}>
          Create Factory
        </button>
      </form>
    </div>
  );
}

export default App;
