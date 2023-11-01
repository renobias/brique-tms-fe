import { Spin } from 'antd'
import React from 'react'

export const LoadingTransparentPage = ({ children, isLoading = true }) => {
    if (isLoading) {
        return (
            <div
                style={{ opacity: 0.5, position: "relative" }}
            >
                {children}
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Spin size="large" />
                </div>
            </div>
        )
    }

    return (
        <div>{children}</div>
    )
}
