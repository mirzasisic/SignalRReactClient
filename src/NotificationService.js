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
        var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqSXdNamN3UmpSRFJEQXlRekUwT1RoRFFUZEdPREF6TTBORE1VRTFPVEkxTkRjMFJrTTVRUSJ9.eyJodHRwczovL3NlY3VyZS5pZGVtdG9vbHMuY29tL2FwcF9tZXRhZGF0YSI6eyJ1dWlkIjoiNzZiM2VjNDQtN2JiNS00Y2JiLWFjMzAtZjZmMzk5ZTUzMGIwIiwiY291bnRyeSI6IkRaIiwibGFuZ3VhZ2UiOiJmciIsImpvYl90aXRsZSI6ImVhM2NiZGIxLTg3YjYtNDdiNC1hNzQwLTM4MmU5NTQxMTE2OCJ9LCJodHRwczovL3NlY3VyZS5pZGVtdG9vbHMuY29tL3VzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJzaXNpYy5taXJ6YS5ra2R2QGdtYWlsLmNvbSIsImZhbWlseV9uYW1lIjoiU2lzaWMiLCJnaXZlbl9uYW1lIjoiRmlyc3QgbmFtZSIsInV1aWQiOiI3NmIzZWM0NC03YmI1LTRjYmItYWMzMC1mNmYzOTllNTMwYjAifSwiaXNzIjoiaHR0cHM6Ly9zZWN1cmUuaWRlbXRvb2xzLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZWQ2Mzk0ODUzODQ4ODBjZTg2Njg4ZjkiLCJhdWQiOlsiaHR0cHM6Ly9iYWNrZW5kLWRldi5pZGVtdG9vbHMuY29tIiwiaHR0cHM6Ly9pZGVtLmV1LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2MDU0MzU1MjQsImV4cCI6MTYwNTUyMTkyNCwiYXpwIjoiSzAwblFBNUNldU1XNU5KSnZ1aW4zVjEyMXVTMlVRUzkiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.ff1cG5E6Tp3CTeR9UhO6OJptW0lOm0S0AlCQEZKR-8dadqGBBfFoj2NnQnXI-Qe1tKdPhtaJwlOQLKYxfnW48AUJywfNUilWj1-KHmlWODuzw7b16n-a7_wJa2Ly8MRSRcuUF-UAAp6-VwUBDIDZrr9lWSOZjwbpHhktl-F4V0kC6i15Sbd5bzzAvZj9SvLG2h120RFqlkEm7kkneQ3w3Oju1lypvLwQJxgC0rFJNQcoPLlHdNfWBU1pl4kT_mn6VZEqpooQC8PqE58_XyWPi_1CnUiVvEoMeRPxemdGgBTXu9kOxnAq41JfTFodgpy57F1B6Di83xHVQbNY-HUJHA";
          const newConnection = new HubConnectionBuilder()
            .withUrl(`http://localhost:5000/notification`,{accessTokenFactory: ()=>token} )
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