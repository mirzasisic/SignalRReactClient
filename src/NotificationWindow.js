import React from 'react';

import Notification from './Notification';

const NotificationWindow = ({notifications}) => {
    const notificationList = notifications
      .map(m => <Notification
        recipient={m.recipient}
        initiator={m.initiator}
        date={m.createdAt}
        message={m.message}/>);

    return(
        <div>
            {notificationList}
        </div>
    )
};

export default NotificationWindow;