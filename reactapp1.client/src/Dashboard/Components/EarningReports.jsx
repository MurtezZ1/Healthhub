import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { month: "Jan", earnings: 30000 },
    { month: "Feb", earnings: 25000 },
    { month: "Mar", earnings: 35000 },
    { month: "Apr", earnings: 50000 },
    { month: "May", earnings: 70000 },
    { month: "Jun", earnings: 60000 },
    { month: "Jul", earnings: 80000 },
    { month: "Aug", earnings: 65000 },
    { month: "Sep", earnings: 60000 },
    { month: "Oct", earnings: 55000 },
    { month: "Nov", earnings: 45000 },
    { month: "Dec", earnings: 30000 },
];

const EarningReports = () => {
    return (
        <div
            style={{
                width: "100%",
                minWidth: "900px", // Set minimum width for wider display
                maxWidth: "100%",
                height: 500, // Increase height for a better aspect ratio
                margin: "0 auto",
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <h3>Earning Reports</h3>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                }}
            >
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>5.44%</span>
                <span
                    style={{
                        backgroundColor: "#27AE60",
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: "12px",
                        fontSize: "14px",
                    }}
                >
                    +2.4%
                </span>
            </div>
            <ResponsiveContainer width="100%" height="80%">
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 30, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        interval={0} // Ensure all months display
                        tick={{ fontSize: 14 }}
                    />
                    <YAxis tick={{ fontSize: 14 }} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="#1ABC9C"
                        fill="#1ABC9C"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EarningReports;
