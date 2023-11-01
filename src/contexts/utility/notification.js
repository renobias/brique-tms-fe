import { notification } from "antd";
import React from "react";

export const notificationContext = React.createContext({
    openNotification: () => {
        throw new Error(
            'Notification has not been provided'
        )
    }
});

export const NotificationProvider = ({ children }) => {
    let notificationProvider;
    const [api, contextHolder] = notification.useNotification();

    const openNotification = ({ title, description, type, placement = 'bottom' }) => {
        api[type]({
            message: title,
            description,
            placement,
            // duration: 0
        });
    };

    notificationProvider = {
        openNotification
    }

    return (
        <notificationContext.Provider value={notificationProvider}>
            {contextHolder}
            {children}
        </notificationContext.Provider>
    )
}