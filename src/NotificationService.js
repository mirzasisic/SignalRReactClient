import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import NotificationWindow from './NotificationWindow';
import NotificationInput from './NotificationInput';

const NotificationService = () => {
    const [ connection, setConnection ] = useState(false);
    const [ notifications, setNotifications ] = useState([])
    const [user, setUser] = useState('')
    const latestChat = useRef(null);

    latestChat.current = notifications;

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');

                    connection.on('NotificationToAll', message => {
                        const updatedChat = [...latestChat.current];
                        updatedChat.push(message);

                        setNotifications(updatedChat);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendNotification = async (recipient, message) => {
        const notification = {
            recipient: recipient,
            message: message,
            initiator: user,
            name: "Notification",
            createdAt: new Date()
        };

        if (connection.connectionStarted) {
            try {
                await connection.send('NotificationToAll', notification);
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }

    const onUserUpdate = (e) => {
        setUser(e.target.value);
    }

    const onSubmit = () => {
        var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlZvc3R1eGtFRmhscDRzNmY0dGxJSCJ9.eyJodHRwczovL3NlY3VyZS5pZGVtdG9vbHMuY29tL2FwcF9tZXRhZGF0YSI6eyJ1dWlkIjoiNzZiM2VjNDQtN2JiNS00Y2JiLWFjMzAtZjZmMzk5ZTUzMGIwIiwiY291bnRyeSI6IkRaIiwibGFuZ3VhZ2UiOiJlbiIsImpvYl90aXRsZSI6ImVhM2NiZGIxLTg3YjYtNDdiNC1hNzQwLTM4MmU5NTQxMTE2OCIsImxhbmdhdWdlIjoiZGUifSwiaHR0cHM6Ly9zZWN1cmUuaWRlbXRvb2xzLmNvbS91c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoic2lzaWMubWlyemEua2tkdkBnbWFpbC5jb20iLCJmYW1pbHlfbmFtZSI6IlNpc2ljIiwiZ2l2ZW5fbmFtZSI6IkZpcnN0IG5hbWUiLCJ1dWlkIjoiNzZiM2VjNDQtN2JiNS00Y2JiLWFjMzAtZjZmMzk5ZTUzMGIwIn0sImlzcyI6Imh0dHBzOi8vZGV2LWlkZW0uZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVlZDYzOTQ4NTM4NDg4MGNlODY2ODhmOSIsImF1ZCI6WyJodHRwczovL2JhY2tlbmQtZGV2LmlkZW10b29scy5jb20iLCJodHRwczovL2Rldi1pZGVtLmV1LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2MDU4OTI3ODUsImV4cCI6MTYwNTk3OTE4NSwiYXpwIjoidUFBN1dTOVZMWFZaU29aU1AyZ09wSDFtTllJYzd4N3ciLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.roTdVlCPxswLVs-b9UzqelSswuYJKmf9Y63Wgh10QoNxoI7XnONMPeeyKK5jybqiqFxt7YoNT9hT95mCbC-GfwaDEeIj6no7wClc_SpakOfrMWot_3u6uR512LXbXTRJUrB4fExAhouPFgllmV37TyU7uacu0-Rb6XsbA-PG0AbDZEvEsJVw9RVLN2xSvtti2XfGdbjX7uepXrGO26BuSI1bF3kZQbRMSlWcvAMD6RL2BZsXYovlSCz3mKsUpbTgx0Hl0x341l8h1mqaGd-6z8oD_aubcVvRFIIPD8QR33IYvykozNYzjKqiBIk4yCIhZSbw03lJIk7EbbXpL02YsA";
          const newConnection = new HubConnectionBuilder()
            .withUrl(`https://dev-backend.idemtools.com/notification`,{accessTokenFactory: ()=>token} )
            .withAutomaticReconnect()
            .build();
          console.log('newConnection', newConnection)
        setConnection(newConnection);
    }

    return (
        <div>
            { !connection ?
               <div>
                <form
                    onSubmit={onSubmit}>
                    <label htmlFor="user">User:</label>
                    <br />
                    <input
                        id="user"
                        name="user"
                        value={user}
                        onChange={onUserUpdate} />
                    <br/>
                    <button>Connect</button>
                </form>
               </div>
        :
        <div>
            <NotificationInput sendNotification={sendNotification} />
            <hr />
            <NotificationWindow notifications={notifications}/>
        </div>
        }
        </div>
    );
};

export default NotificationService;