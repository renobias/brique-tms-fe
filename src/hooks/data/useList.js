import { pickDataProvider } from "../../definitions/helpers";
import { useDataProvider } from "./useDataProvider";
import { useNotification } from "../utility";
import { useState } from "react";


export function useList({ dataProviderName, resource, pagination, meta, handleResult }) {
    const { openNotification } = useNotification();
    const dataProvider = useDataProvider();
    const [state, setState] = useState({
        isLoading: false,
        data: [],
        total_all_data: null,
        total_pages: null,
        statusCode: "",
        message: "",
        gnrMessage: "",
    });

    async function fire({ dataProviderName: dataProviderNameFire, resource: resourceFire, pagination: paginationFire, meta: metaFire, handleResult: handleResultFire }) {
        // async function fire() {
        try {
            setState({
                ...state,
                isLoading: true
            });
            const { data, status, statusText, total, total_pages, total_all_data } = await dataProvider(pickDataProvider(dataProviderNameFire || dataProviderName)).getList({ resource: resourceFire || resource, pagination: paginationFire || pagination, meta: metaFire || meta });
            // const { data, status, statusText, total, total_pages, total_all_data } = await dataProvider(pickDataProvider(dataProviderName)).getList({ resource, pagination, meta });
            state.isLoading = false

            state.data = data;
            state.total = total;
            state.total_all_data = total_all_data;
            state.total_pages = total_pages;
            state.statusCode = status;
            state.message = statusText;
            return { state }
        }
        catch (error) {
            state.statusCode = error?.statusCode;
            state.message = error?.message;
            state.gnrMessage = error?.gnrMessage;
            openNotification({
                title: state.gnrMessage,
                description: `Error (status code: ${state.statusCode} description: ${state.message}`,
                type: 'error'
            });
            return { state }
        }
        finally {
            setState({
                ...state,
                isLoading: false
            });
            if (handleResultFire) {
                handleResultFire()
            } else if (handleResult) {
                handleResult()
            }
        }
    }

    return {
        fire,
        state
    }
}