import React from "react";

const CustomNode = ({ data }) => {
  return (
    <div style={{ border: "none", background: "transparent" }}>
      <svg width="80" height="80">
        {/* Cercle */}
        <circle cx="40" cy="40" r="30" stroke="black" strokeWidth="2" fill="white" />
        {/* Texte Early Start / Late Start */}
        <text x="10" y="20" fontSize="12" fill="red">
          {data.earlyStart}
        </text>
        <text x="50" y="20" fontSize="12" fill="black">
          {data.lateStart}
        </text>
        {/* Nom de la tâche */}
        <text x="20" y="45" fontSize="14" fill="black" textAnchor="middle">
          {data.label}
        </text>
        {/* Slack */}
        <rect x="25" y="55" width="30" height="15" fill="green" />
        <text x="40" y="65" fontSize="12" fill="white" textAnchor="middle">
          {data.slack}
        </text>
      </svg>
    </div>
  );
};

export default CustomNode;
