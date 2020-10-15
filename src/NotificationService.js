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
        var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqSXdNamN3UmpSRFJEQXlRekUwT1RoRFFUZEdPREF6TTBORE1VRTFPVEkxTkRjMFJrTTVRUSJ9.eyJodHRwczovL3NlY3VyZS5pZGVtdG9vbHMuY29tL2FwcF9tZXRhZGF0YSI6eyJ1dWlkIjoiNzZiM2VjNDQtN2JiNS00Y2JiLWFjMzAtZjZmMzk5ZTUzMGIwIiwiY291bnRyeSI6IkJBIiwibGFuZ3VhZ2UiOiJHRVIiLCJqb2JfdGl0bGUiOiJlYTNjYmRiMS04N2I2LTQ3YjQtYTc0MC0zODJlOTU0MTExNjgifSwiaHR0cHM6Ly9zZWN1cmUuaWRlbXRvb2xzLmNvbS91c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoic2lzaWMubWlyemEua2tkdkBnbWFpbC5jb20iLCJmYW1pbHlfbmFtZSI6IlNpc2ljIiwiZ2l2ZW5fbmFtZSI6Ik1pcnphIiwidXVpZCI6Ijc2YjNlYzQ0LTdiYjUtNGNiYi1hYzMwLWY2ZjM5OWU1MzBiMCJ9LCJpc3MiOiJodHRwczovL3NlY3VyZS5pZGVtdG9vbHMuY29tLyIsInN1YiI6ImF1dGgwfDVlZDYzOTQ4NTM4NDg4MGNlODY2ODhmOSIsImF1ZCI6WyJodHRwczovL2JhY2tlbmQtZGV2LmlkZW10b29scy5jb20iLCJodHRwczovL2lkZW0uZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYwMjc1NzQ0MiwiZXhwIjoxNjAyODQzODQyLCJhenAiOiJLMDBuUUE1Q2V1TVc1TkpKdnVpbjNWMTIxdVMyVVFTOSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.MZrkdmdL_7w134oy1fUFQmOum7C3PluPFJiebytZl2BLxqKd5IHNUGGWBDtEqRzf8l5c-kNh8i-e0IkpnSUBCNqHjvmsNnPLBJCaYuz34c5rQIVcQx-r2otecdiY3zXzvnwzU4yui0gBEt1Bnfz3W8RFAb8qVNsg-67EMNY9wI6bNkG8t-iDo4gw4NnGBZiVJ2gVRTykg8sJsqIgS0Cmaf_lK7S1K0h93tF6aA-wxpUMXu9fDKCIYutZLcphSoVC3QO4-RtMkvmDBJioi-uJ_Xx4xDQBCz2MwqrBnC23Z9PLI5PMG5cV1SdpE1E2m_pYf3GipeQmaksVoIgy-RhPmg";
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