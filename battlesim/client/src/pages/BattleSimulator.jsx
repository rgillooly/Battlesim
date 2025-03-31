import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const BattleSimulator = () => {
  const [battleLog, setBattleLog] = useState([]);
  const [units, setUnits] = useState([]);
  const [unitStates, setUnitStates] = useState([]);
  const [newUnit, setNewUnit] = useState({
    name: "",
    attack: 0,
    health: 0,
    weakness: "",
  });
  const [side1, setSide1] = useState([]);
  const [side2, setSide2] = useState([]);

  const addUnit = () => {
    if (newUnit.name && newUnit.attack > 0 && newUnit.health > 0) {
      setUnits([...units, newUnit]);
      setNewUnit({ name: "", attack: 0, health: 0, weakness: "" });
    }
  };

  const assignUnitToSide = (unit, side) => {
    if (side === 1) {
      setSide1([...side1, { ...unit, currentHealth: unit.health }]);
    } else {
      setSide2([...side2, { ...unit, currentHealth: unit.health }]);
    }
  };

  const attack = (attackerIndex, defenderIndex, attackingSide) => {
    setUnitStates((prevState) => {
      const newSide1 = [...side1];
      const newSide2 = [...side2];
      let attacker =
        attackingSide === 1 ? newSide1[attackerIndex] : newSide2[attackerIndex];
      let defender =
        attackingSide === 1 ? newSide2[defenderIndex] : newSide1[defenderIndex];

      let attackPower = attacker.attack;
      if (attacker.currentHealth < attacker.health / 2) {
        attackPower = Math.floor(attackPower / 2);
      }
      if (defender.weakness === attacker.name) {
        attackPower *= 1.5;
      }

      defender.currentHealth = Math.max(
        0,
        defender.currentHealth - attackPower
      );

      setBattleLog((prevLog) => [
        ...prevLog,
        `${attacker.name} attacks ${defender.name} for ${attackPower} damage!`,
      ]);

      return prevState;
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Medieval Battle Simulator</h1>

      <div className="my-4">
        <h2 className="text-lg font-semibold">Create a New Unit</h2>
        <input
          type="text"
          placeholder="Name"
          value={newUnit.name}
          onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Attack"
          value={newUnit.attack}
          onChange={(e) =>
            setNewUnit({ ...newUnit, attack: parseInt(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Health"
          value={newUnit.health}
          onChange={(e) =>
            setNewUnit({ ...newUnit, health: parseInt(e.target.value) })
          }
        />
        <input
          type="text"
          placeholder="Weakness"
          value={newUnit.weakness}
          onChange={(e) => setNewUnit({ ...newUnit, weakness: e.target.value })}
        />
        <Button onClick={addUnit}>Add Unit</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 my-4">
        <div>
          <h2 className="text-lg font-semibold">Available Units</h2>
          {units.map((unit, index) => (
            <div key={index} className="border p-2 rounded shadow">
              <h2>{unit.name}</h2>
              <p>
                Attack: {unit.attack}, Health: {unit.health}
              </p>
              <Button onClick={() => assignUnitToSide(unit, 1)}>
                Add to Side 1
              </Button>
              <Button onClick={() => assignUnitToSide(unit, 2)}>
                Add to Side 2
              </Button>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-lg font-semibold">Battle Log</h2>
          {battleLog.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold">Side 1</h2>
          {side1.map((unit, index) => (
            <div key={index} className="border p-2 rounded shadow">
              <h2>{unit.name}</h2>
              <p>
                Health: {unit.currentHealth} / {unit.health}
              </p>
              <Button onClick={() => attack(index, 0, 1)}>Attack Side 2</Button>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-lg font-semibold">Side 2</h2>
          {side2.map((unit, index) => (
            <div key={index} className="border p-2 rounded shadow">
              <h2>{unit.name}</h2>
              <p>
                Health: {unit.currentHealth} / {unit.health}
              </p>
              <Button onClick={() => attack(index, 0, 2)}>Attack Side 1</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleSimulator;
