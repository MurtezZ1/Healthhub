import React from "react";
import "./StatCard.css";

const StatCard = ({ title, value, description, iconClass, bgColor }) => {
    return (
        <div className="stat-card" style={{ borderLeft: `5px solid ${bgColor}` }}>
            <div className="stat-content">
                <h2 className="stat-title">{title}</h2>
                <p className="stat-value">{value}</p>
                <p className="stat-description">{description}</p>
            </div>
            <div
                className="stat-icon"
                style={{ backgroundColor: bgColor, color: "#fff" }}
            >
                <i className={iconClass}></i>
            </div>
        </div>
    );
};

export default StatCard;
