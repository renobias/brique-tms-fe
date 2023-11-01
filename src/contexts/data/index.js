import React from "react";

export const defaultDataProvider = () => {
    return {
        default: {
            create: () => Promise.resolve({ data: { id: 1 } }),
            createMany: () => Promise.resolve({ data: [] }),
            deleteOne: () => Promise.resolve({ data: { id: 1 } }),
            deleteMany: () => Promise.resolve({ data: [] }),
            getList: () => Promise.resolve({ data: [], total: 0 }),
            getMany: () => Promise.resolve({ data: [] }),
            getOne: () => Promise.resolve({ data: { id: 1 } }),
            update: () => Promise.resolve({ data: { id: 1 } }),
            updateMany: () => Promise.resolve({ data: [] }),
            custom: () => Promise.resolve({ data: {} }),
            getApiUrl: () => "",
        },
    };
};

export const DataContext = React.createContext(
    defaultDataProvider()
)

export const DataContextProvider = ({ children, ...rest }) => {
    // sisa props datacontextprovider(rest) dicopy dan dikumpulin dijadikan satu object
    let dataProviders;
    if (!rest.getList || !rest.getOne) {
        dataProviders = rest;
    } else {
        dataProviders = {
            default: rest,
        };
    }
    return (
        <DataContext.Provider value={dataProviders}>
            {children}
        </DataContext.Provider>
    );
}