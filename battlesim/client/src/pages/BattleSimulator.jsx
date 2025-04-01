import React, { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";

const BattleSimulator = () => {
  const [battleLog, setBattleLog] = useState([]);
  const [units, setUnits] = useState([]);
  const [side1, setSide1] = useState([]);
  const [side2, setSide2] = useState([]);
  const [error, setError] = useState(null);
  const [isBattleOngoing, setIsBattleOngoing] = useState(false);
  const [newUnit, setNewUnit] = useState({
    name: "",
    attack: "",
    health: "",
    weakness: "",
  });

  useEffect(() => {
    const fetchUnits = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view your Units.");
        return;
      }
      try {
        const response = await axios.get(
          "https://battle-simulator-83f7699c82e8.herokuapp.com/api/units/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setUnits(response.data.units);
        } else {
          setError(response.data.message || "Failed to load units.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching units."
        );
      }
    };
    fetchUnits();
  }, []);

  const handleInputChange = (e) => {
    setNewUnit({ ...newUnit, [e.target.name]: e.target.value });
  };

  const addUnit = async () => {
    if (!newUnit.name || !newUnit.attack || !newUnit.health) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to add a unit.");
        return;
      }
      const response = await axios.post(
        "https://battle-simulator-83f7699c82e8.herokuapp.com/api/submission/add",
        newUnit,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setUnits([...units, response.data.unit]); // Update state with the new unit
        setNewUnit({ name: "", attack: "", health: "", weakness: "" }); // Clear form
      } else {
        setError(response.data.message || "Failed to add unit.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while adding the unit."
      );
    }
  };

  const handleDragStart = (e, unit) => {
    e.dataTransfer.setData("unit", JSON.stringify(unit));
  };

  const handleDrop = (e, side) => {
    e.preventDefault();
    const unit = JSON.parse(e.dataTransfer.getData("unit"));
    const unitWithHealth = { ...unit, currentHealth: unit.health };

    if (side === 1) setSide1((prev) => [...prev, unitWithHealth]);
    else setSide2((prev) => [...prev, unitWithHealth]);
  };

  const findWeakTarget = (attacker, enemies) => {
    if (enemies.length === 0) return null;
    return (
      enemies.find((unit) => unit.weakness === attacker.name) ||
      enemies[Math.floor(Math.random() * enemies.length)]
    );
  };

  const attackUnit = (attacker, defender) => {
    let attackPower = attacker.attack;
    if (attacker.currentHealth < attacker.health / 2) {
      attackPower = Math.floor(attackPower / 2);
    }
    if (defender.weakness === attacker.name) {
      attackPower *= 1.5;
    }
    defender.currentHealth = Math.max(0, defender.currentHealth - attackPower);
    setBattleLog((prevLog) => [
      ...prevLog,
      `${attacker.name} attacks ${defender.name} for ${attackPower} damage!`,
    ]);
  };

  const startBattle = () => {
    setIsBattleOngoing(true);
    const battleInterval = setInterval(() => {
      setSide1((prevSide1) => {
        setSide2((prevSide2) => {
          if (prevSide1.length === 0 || prevSide2.length === 0) {
            clearInterval(battleInterval);
            setIsBattleOngoing(false);
            setBattleLog((prevLog) => [
              ...prevLog,
              `⚔️ Battle Over! ${
                prevSide1.length === 0 ? "Side 2 Wins!" : "Side 1 Wins!"
              }`,
            ]);
            return prevSide2;
          }
          let updatedSide1 = [...prevSide1];
          let updatedSide2 = [...prevSide2];

          updatedSide1.forEach((attacker) => {
            let target = findWeakTarget(attacker, updatedSide2);
            if (target) attackUnit(attacker, target);
          });

          updatedSide2.forEach((attacker) => {
            let target = findWeakTarget(attacker, updatedSide1);
            if (target) attackUnit(attacker, target);
          });

          updatedSide1 = updatedSide1.filter((unit) => unit.currentHealth > 0);
          updatedSide2 = updatedSide2.filter((unit) => unit.currentHealth > 0);

          return updatedSide2;
        });
        return prevSide1.filter((unit) => unit.currentHealth > 0);
      });
    }, 1000);
  };

  return (
    <div className="grid-container-main">
      <div className="p-4">
        <h1 className="text-xl font-bold">Medieval Battle Simulator</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid-item-units">
          <div>
            <h2 className="text-lg font-semibold">Available Units</h2>
            <ul className="border p-4" onDragOver={(e) => e.preventDefault()}>
              {units.map((unit, index) => (
                <li
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, unit)}
                  className="border p-2 cursor-move"
                >
                  {unit.name} (Attack: {unit.attack}, Health: {unit.health})
                </li>
              ))}
            </ul>
          </div>
          <div className="unit-form">
            <input
              type="text"
              name="name"
              placeholder="Unit Name"
              value={newUnit.name}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="attack"
              placeholder="Attack"
              value={newUnit.attack}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="health"
              placeholder="Health"
              value={newUnit.health}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="weakness"
              placeholder="Weakness (Optional)"
              value={newUnit.weakness}
              onChange={handleInputChange}
            />
            <button onClick={addUnit}>Add Unit</button>
          </div>
          <div>
            <h2 className="grid-item-battle-log">Battle Log</h2>
            {battleLog.map((log, index) => (
              <p key={index}>{log}</p>
            ))}
          </div>
        </div>
        <div className="grid-item-sides">
          <div
            className="grid-item-side-1"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 1)}
          >
            <h2>Side 1</h2>
            <ul className="border p-4 min-h-[100px]">
              {side1.map((unit, index) => (
                <li key={index} className="border p-2">
                  {unit.name} (Health: {unit.currentHealth} / {unit.health})
                </li>
              ))}
            </ul>
          </div>
          <div
            className="grid-item-side-2"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 2)}
          >
            <h2>Side 2</h2>
            <ul className="border p-4 min-h-[100px]">
              {side2.map((unit, index) => (
                <li key={index} className="border p-2">
                  {unit.name} (Health: {unit.currentHealth} / {unit.health})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={startBattle}
          className="p-2 bg-green-500 text-white"
          disabled={isBattleOngoing}
        >
          Start Battle
        </button>
      </div>
    </div>
  );
};

export default BattleSimulator;
