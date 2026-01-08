import React from 'react';
import Sidebar from './Sidebar';
import Widget from './Widget';
import MainPageStats from './MainPageStats';
import EarningReports from './EarningReports';

const DashboardAdmin = () => {
    return (
        <div className="d-flex" style={{ backgroundColor: '#f5f6f7' }} >


            <Sidebar userType="admin" />

         
            <div style={{ paddingTop: '45px' }}>
                <MainPageStats></MainPageStats>
            </div>

            <div style={{ display: 'block', marginTop: '300px', marginLeft: '-990px' }}>
                <EarningReports></EarningReports>
                <br></br>
            </div>
        </div>
    );
};

export default DashboardAdmin;
