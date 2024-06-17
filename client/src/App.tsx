import "./App.css";
import { useState } from "react";

function App() {
  const [warehouseName, setWarehouseName] = useState("");
  const [zoneShelves, setZoneShelves] = useState(
    Array.from({ length: 12 }, (_, index) => ({
      shelves: 1,
      shelfNames: [""],
    }))
  );
  const [errors, setErrors] = useState([""]);

  function handleZoneShelvesChange(index: number, value: number) {
    const updatedZones = [...zoneShelves];
    if (value > updatedZones[index].shelfNames.length) {
      updatedZones[index].shelfNames = updatedZones[index].shelfNames.concat(
        new Array(value - updatedZones[index].shelfNames.length).fill("")
      );
    } else {
      updatedZones[index].shelfNames = updatedZones[index].shelfNames.slice(
        0,
        value
      );
    }
    updatedZones[index].shelves = value;
    setZoneShelves(updatedZones);
    console.log(zoneShelves);
  }

  function handleShelfNamesChange(
    indexZone: number,
    indexShelf: number,
    value: string
  ) {
    const updatedZones = [...zoneShelves];
    updatedZones[indexZone].shelfNames[indexShelf] = value;
    setZoneShelves(updatedZones);

    const zoneShelfNames = updatedZones[indexZone].shelfNames;
    const hasDuplicates =
      new Set(zoneShelfNames).size !== zoneShelfNames.length;

    const newErrors = [...errors];
    if (hasDuplicates) {
      newErrors[indexZone] = "Shelf names must be unique within a zone.";
    } else {
      newErrors[indexZone] = "";
    }
    setErrors(newErrors);
  }

  async function createWarehouse() {
    console.log(warehouseName);
    console.log(zoneShelves);
    const rawResponse = await fetch("http://localhost:9000/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: warehouseName, zones: zoneShelves }),
    });
  }

  return (
    <div className="app">
      <h1>Factory X Warehouse Creator</h1>
      <form>
        <label htmlFor="warehouse_name">Warehouse Name:</label>
        <input
          type="text"
          id="warehouse_name"
          value={warehouseName}
          onChange={(e) => setWarehouseName(e.target.value)}
        ></input>
        <h4>Select up to a maximum of 10 shelves per zone</h4>
        <h5>*Shelf names must be unique</h5>
        <div className="zones">
          {zoneShelves.map((zone, index) => (
            <div className="zone" key={index}>
              <div className="zoneSelect">
                <label htmlFor={`zone${index}`}>Zone {index + 1}: </label>
                <select
                  className="selectBox"
                  id={`zone${index}`}
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
              <div className="shelfInputs">
                {errors[index] && <div className="error">{errors[index]}</div>}
                {Array.from({ length: zone.shelves }, (_, i) => (
                  <div className="shelfInput" key={i}>
                    <label>Name of Shelf {i + 1}: </label>
                    <input
                      type="text"
                      value={zone.shelfNames[i]}
                      onChange={(e) => {
                        handleShelfNamesChange(index, i, e.target.value);
                      }}
                    ></input>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="submit" type="button" onClick={createWarehouse}>
          Create Factory
        </button>
      </form>
    </div>
  );
}

export default App;
