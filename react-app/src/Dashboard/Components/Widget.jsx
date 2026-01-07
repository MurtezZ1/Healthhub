import React from 'react';

const Widget = ({ title, value, description }) => {
    return (
        <div className="col-md-3">
            <div className="card p-3 mb-3 text-center">
                <h5>{title}</h5>
                <h2>{value}</h2>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default Widget;
