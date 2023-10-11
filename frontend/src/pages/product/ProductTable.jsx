import {useProductListQuery} from "./useQueries.jsx";
import { MaterialReactTable } from "material-react-table";
import {Box, Chip, FormControl, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import {useDeleteProductMutation} from "./useMutations.jsx";
import {FormDialog} from "../../components/FormDialog.jsx";
import {useState} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {filterRowsBySearchCriteria} from "./helper.js";

const initialModalData = {
    open: false,
    type: "Add",
    existingProductData: {},
};

const columnsSize = 100;

export const ProductTable = () => {
    const [modalData , setModalData] = useState({
        ...initialModalData,
    });

    const [searchColumn, setSearchColumn] = useState("");
    const [searchText, setSearchText] = useState("");

    const {isLoading, error, data: productList} = useProductListQuery();
    const deleteProductMutation = useDeleteProductMutation();

    const filteredRows = filterRowsBySearchCriteria(productList ?? [], searchText, searchColumn);

    const deleteProduct = (productId) => {
        deleteProductMutation.mutate(productId)
    }

    const columns = [
        {
            accessorKey: 'productId',
            header: 'Product Number',
            size: columnsSize,
        },
        {
            accessorKey: 'productName',
            header: 'Product Name',
            size: columnsSize,
        },
        {
            accessorKey: 'scrumMaster',
            header: 'Scrum Master',
            size: columnsSize,
        },
        {
            accessorKey: 'productOwner',
            header: 'Product Owner',
            size: columnsSize,
        },
        {
            accessorKey: 'developerNames',
            header: 'Developer Names',
            size: columnsSize,
            accessorFn: (originalRow) => {
                return (
                    <Stack
                        direction="row"
                        alignItems="center"
                        flexWrap="wrap"
                        spacing={1}
                        useFlexGap
                    >
                        {
                            originalRow?.developerNames?.map((developerName) => (
                                <Chip key={developerName} label={developerName} size="small"/>
                            ))
                        }

                    </Stack>
                )
            }
        },
        {
            accessorKey: 'startDate',
            header: 'Start Date',
            size: columnsSize,
            accessorFn: (originalRow) => {
                const startDate = originalRow.startDate ?? ""
                return startDate.split('T')[0];

            }
        },
        {
            accessorKey: 'methodology',
            header: 'Methodology',
            size: columnsSize,
        },
        {
            accessorKey: 'location',
            header: 'Location',
            size: columnsSize,
        },
    ];

    const handleSearchSelectChange = (value) => {
        setSearchColumn(value);
    }

    return <>
        <MaterialReactTable
            state={{isLoading}}
            getRowId={(originalRow) => originalRow.productId}
            columns={columns}
            data={filteredRows}
            enableRowActions
            renderTopToolbarCustomActions={()=>(
                <>
                    <Button variant="contained"  onClick={() => {
                        setModalData({
                            ...initialModalData,
                            open: true
                        })
                    }}>Add Product</Button>

                    <Box>
                        <TextField variant="outlined" label={"search"} size="small" value={searchText} onChange={(event) => setSearchText(event.target.value)}/>
                        <FormControl sx={{ marginLeft: "12px", minWidth: 200 }} size="small">
                            <InputLabel id="demo-select-small-label">Search Criteria</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                label="Search Criteria"
                                onChange={(event) => handleSearchSelectChange(event.target.value)}
                            >
                                <MenuItem value={"scrumMaster"}>Scrum Master</MenuItem>
                                <MenuItem value={"developerNames"}>Developer Names</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </>

            )}
            renderRowActions={({ row, table }) => (
                <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                    <IconButton
                        onClick={() => {
                            setModalData({
                                open: true,
                                type: "Edit",
                                existingProductData: row.original
                            })
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => deleteProduct(row.original.productId)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}
        />

        <FormDialog
            modelData={modalData}
            onClose={() => setModalData({ ...initialModalData })}
        />
    </>
}