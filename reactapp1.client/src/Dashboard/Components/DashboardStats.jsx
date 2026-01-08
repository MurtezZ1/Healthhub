import React from "react";
import StatCard from "./StatCard";

const DashboardStats = () => {
    const stats = [
        {
            title: "Today Patients",
            value: "10",
            description: "Total Patients 10 today",
            iconClass: "fas fa-clock", // FontAwesome class
            bgColor: "#1ABC9C", // Teal
        },
        {
            title: "Monthly Patients",
            value: "230",
            description: "Total Patients 230 this month",
            iconClass: "fas fa-calendar-alt", // FontAwesome class
            bgColor: "#E67E22", // Orange
        },
        {
            title: "Yearly Patients",
            value: "1,500",
            description: "Total Patients 1,500 this year",
            iconClass: "fas fa-calendar", // FontAwesome class
            bgColor: "#27AE60", // Green
        },
    ];

    return (
        <div className="dashboard-horizontal">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    description={stat.description}
                    iconClass={stat.iconClass}
                    bgColor={stat.bgColor}
                />
            ))}
        </div>
    );
};

export default DashboardStats;
