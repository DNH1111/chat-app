// React Component for the Homepage of the app
import React from 'react';
import { Grid, Row, Col } from 'rsuite';
import Sidebar from '../components/Sidebar';
import '../styles/utility.scss';

const Homepage = () => {
    return (
        <Grid fluid className="h-100">
            <Row>
                <Col xs={24} md={8}>
                    <Sidebar />
                </Col>
            </Row>
        </Grid>
    );
};

export default Homepage;
