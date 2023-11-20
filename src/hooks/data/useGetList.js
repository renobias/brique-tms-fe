import { pickDataProvider } from "../../definitions/helpers";
import { useDataProvider } from "./useDataProvider";
import { useNotification } from "../utility";
import { useState } from "react";


export function useGetList({ dataProviderName, resource, pagination, meta, handleResult }) {
    const { openNotification } = useNotification();
    const dataProvider = useDataProvider();
    const [state, setState] = useState({
        isLoading: false,
        page: null,
        perPage: null,
        totalAllData: null,
        totalPages: null,
        totalCurrentPageData: null,
        data: [],
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
            const { page, per_page, total_all_data, total_currentpage_data, total_pages, data, status, statusText, } = await dataProvider(pickDataProvider(dataProviderNameFire || dataProviderName)).getList({ resource: resourceFire || resource, pagination: paginationFire || pagination, meta: metaFire || meta });
            // const { data, status, statusText, total, total_pages, total_all_data } = await dataProvider(pickDataProvider(dataProviderName)).getList({ resource, pagination, meta });
            setTimeout(() => {
                console.log("test loading")
            }, 5000)
            state.isLoading = false;
            state.page = page;
            state.perPage = per_page;
            state.totalAllData = total_all_data;
            state.totalPages = total_pages;
            state.totalCurrentPageData = total_currentpage_data;
            state.data = [...data];
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