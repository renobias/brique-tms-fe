import { message } from "antd";
import React from "react";

export const messageContext = React.createContext({
    openMessage: () => {
        throw new Error(
            'Message has not been provided'
        )
    }
});

export const MessageProvider = ({ children }) => {
    let messageProvider;
    const [messageApi, contextHolder] = message.useMessage();

    const openMessage = ({ type, content }) => {
        messageApi.open({
            type,
            content
        });
    };

    messageProvider = {
        openMessage
    }

    return (
        <messageContext.Provider value={messageProvider}>
            {contextHolder}
            {children}
        </messageContext.Provider>
    )
}