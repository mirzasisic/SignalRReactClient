import React from 'react';

const Notification = (props) => (
    <div style={{ background: "#eee", borderRadius: '5px', padding: '0 10px' }}>
        <p>Date: {props.createAt}</p>
        <p>Initiator: {props.initiator}</p>
        <p>Recipient: {props.recipient}</p>
        <p>Message: {props.message}</p>
    </div>
);

export default Notification