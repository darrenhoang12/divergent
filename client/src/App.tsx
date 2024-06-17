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
  const [warehouseNameError, setWarehouseNameError] = useState("");
  const [errors, setErrors] = useState([""]);
  const [submitError, setSubmitError] = useState("");

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
    handleShelfNamesChange(index, 0, updatedZones[index].shelfNames[0]);
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
    if (hasDuplicates || updatedZones[indexZone].shelfNames.includes("")) {
      newErrors[indexZone] =
        "Shelf names must be unique within a zone and non-empty.";
    } else {
      newErrors[indexZone] = "";
    }
    setErrors(newErrors);
  }

  function checkShelfNames() {
    for (let i = 0; i < zoneShelves.length; i++) {
      const zoneShelfNames = zoneShelves[i].shelfNames;
      if (zoneShelfNames.includes("")) return false;
      if (new Set(zoneShelfNames).size !== zoneShelfNames.length) return false;
    }
    return true;
  }

  async function createWarehouse() {
    if (warehouseName === "") {
      setWarehouseNameError("Warehouse name is required.");
      return;
    } else if (checkShelfNames() === false) {
      setSubmitError("One or more input fields are incorrect.");
    } else {
      setSubmitError("");
      const rawResponse = await fetch("http://localhost:9000/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: warehouseName, zones: zoneShelves }),
      });

      const result = await rawResponse.json();
      console.log(result);
    }
  }

  return (
    <div className="app">
      <h1>Factory X Warehouse Creator</h1>
      <form>
        {warehouseNameError && !warehouseName && (
          <div className="error">{warehouseNameError}</div>
        )}
        <label htmlFor="warehouse_name">Warehouse Name:</label>
        <input
          type="text"
          id="warehouse_name"
          value={warehouseName}
          onChange={(e) => setWarehouseName(e.target.value)}
        ></input>
        <h4>Select up to a maximum of 10 shelves per zone</h4>
        <h5>*Shelf names must be unique and non-empty</h5>
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
        {submitError && <div className="error">{submitError}</div>}
        <button className="submit" type="button" onClick={createWarehouse}>
          Create Factory
        </button>
      </form>
    </div>
  );
}

export default App;
