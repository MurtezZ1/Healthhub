import React from "react";
import StatCard from "./StatCard";



const DashboardStats = () => {
    const stats = [
        {
            title: "Total Patients",
            value: "1600+",
            description: "45.06%",
            iconClass: "fas fa-users", // FontAwesome icon
            bgColor: "#1ABC9C", // Teal
        },
        {
            title: "Appointments",
            value: "130+",
            description: "25.06%",
            iconClass: "fas fa-calendar-check", // FontAwesome icon
            bgColor: "#F1C40F", // Yellow
        },
        {
            title: "Prescriptions",
            value: "4100+",
            description: "65.06%",
            iconClass: "fas fa-file-prescription", // FontAwesome icon
            bgColor: "#E74C3C", // Red
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
                    style={{
                        width: "200px",   // Smaller width
                        padding: "10px",  // Smaller padding
                        fontSize: "14px", // Smaller font size
                    }}
                />
            ))}
        </div>
    );
};

export default DashboardStats;
