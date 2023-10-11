import {methodologyValues} from "../../components/FormDialog.jsx";

export const isValidProductData = (productData, type) => {
    const isvalid = true;

    for (const [key, value] of Object.entries(productData)) {
        if (type === "Add" && key === "location") {
            continue;
        }

        const result = isValidValue(key, value);
        if (!result) {
            return false;
        }
    }

    return isvalid;
}

export const isValidValue = (key, value = "") => {
    switch (key) {
        case "productName":
        case "scrumMaster":
        case "productOwner":
        case "location":
        case "startDate":
            const newValue = value?.trim() ?? "";
            return newValue.length !== 0;
        case "developerNames":
            const names = value?.split(",");
            return names.length !== 0 && names.length <= 5;
        case "methodology":
            return methodologyValues.includes(value);
        default:

    }
}

export const filterRowsBySearchCriteria = (rows, searchText, searchColumn) => {
    if (!rows || searchText.length === 0 || !searchColumn) {
        return rows;
    }

    if (searchColumn === "scrumMaster") {
        const filteredRows = rows.filter((row) => row.scrumMaster.includes(searchText));
        return filteredRows;
    }

    const filteredRows = rows.filter((row) => {
        const developerNames = row.developerNames;
        return developerNames.includes(searchText);
    })

    return filteredRows;
}