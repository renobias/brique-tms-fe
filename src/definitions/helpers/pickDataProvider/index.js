export const pickDataProvider = (
    dataProviderName,
) => {
    if (dataProviderName) {
        return dataProviderName;
    }

    return "default";
};