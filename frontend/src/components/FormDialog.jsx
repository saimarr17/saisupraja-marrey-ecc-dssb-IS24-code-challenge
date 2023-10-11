import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useEffect, useState} from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography} from "@mui/material";
import {isValidProductData, isValidValue} from "../pages/product/helper.js";
import {useCreateProductMutation, useUpdateProductMutation} from "../pages/product/useMutations.jsx";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

export const methodologyValues = ["Agile", "Waterfall"];

const initialFormData = {
    productName: "",
    scrumMaster: "",
    productOwner: "",
    developerNames: "",
    startDate: new Date().toISOString(),
    methodology: "Agile",
    location: "",
}

export const FormDialog = (props) => {
    const { modelData, onClose } = props;
    const { open, type, existingProductData } = modelData;
    const {productName, scrumMaster, productOwner, developerNames, startDate, methodology,location, productId} = existingProductData;

    const updateProductMutation = useUpdateProductMutation();
    const addProductMutation = useCreateProductMutation();

    const [formData,setFormData] = useState({
        ...initialFormData,
    })

    useEffect(() => {
        if (type !== "Edit") {
            return;
        }
        
        setFormData({
            productName: productName ?? "",
            scrumMaster: scrumMaster ?? "",
            productOwner: productOwner ?? "",
            developerNames: developerNames?.join(",") ?? "",
            startDate: startDate,
            methodology: methodology ?? "Agile",
            location: location ?? "",
        });

    }, [existingProductData, type]);

    const handleClose = () => {
        setFormData({
            ...initialFormData,
        })
        onClose();
    };

    const isValid = isValidProductData(formData, type);

    const onSave = () => {
        if (type === "Edit") {
            updateProductMutation.mutate({
                productId,
                productOwner: formData.productOwner,
                productName: formData.productName,
                scrumMaster: formData.scrumMaster,
                developerNames: formData.developerNames.split(","),
                location: formData.location,
                startDate: formData.startDate,
                methodology: formData.methodology,
            }, {
                onSuccess: () => {
                    setFormData({
                        ...initialFormData,
                    });
                    onClose();
                }
            });
        } else {
            addProductMutation.mutate({
                productOwner: formData.productOwner,
                productName: formData.productName,
                scrumMaster: formData.scrumMaster,
                developerNames: formData.developerNames.split(","),
                startDate: formData.startDate,
                methodology: formData.methodology,
            }, {
                onSuccess: () => {
                    setFormData({
                        ...initialFormData,
                    });
                    onClose();
                }
            })
        }
    }

    const onChange = (value, valueName) => {
        const newState = { ...formData };

        if (valueName in newState) {
            newState[valueName] = value;
        }

        setFormData(newState);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{type === "Edit" ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Product Name"
                    type="text"
                    fullWidth
                    value={formData.productName}
                    variant="standard"
                    required
                    onChange={(event) => onChange(event.target.value, "productName")}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Scrum Master"
                    type="text"
                    fullWidth
                    value={formData.scrumMaster}
                    variant="standard"
                    required
                    onChange={(event) => onChange(event.target.value, "scrumMaster")}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Product Owner"
                    type="text"
                    fullWidth
                    value={formData.productOwner}
                    variant="standard"
                    required
                    onChange={(event) => onChange(event.target.value, "productOwner")}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Developer Names (separted with commas ',' up to 5)"
                    placeholder="Alex,Steve"
                    type="text"
                    fullWidth
                    value={formData.developerNames}
                    variant="standard"
                    required
                    onChange={(event) => onChange(event.target.value, "developerNames")}
                />
                {type === "Add" && <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{ overflowY: "hidden"}}>
                        <DatePicker
                            label="Start Date"
                            autoFocus
                            value={dayjs(formData.startDate)}
                            slotProps={{ textField: { variant: 'standard' } }}
                            onChange={(newValue) => {
                                const date = new Date(newValue);
                                onChange(date.toISOString(), "startDate")
                            }}
                        />
                    </DemoContainer>

                </LocalizationProvider>
                }

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    spacing={2}
                >
                    <Typography variant="body1">Methodology</Typography>
                    <FormControl>
                        <RadioGroup
                            value={formData.methodology}
                            required
                            onChange={(event) => onChange(event.target.value, "methodology")}
                            row
                        >
                            {methodologyValues.map((value) => (
                                <FormControlLabel
                                    control={<Radio/>}
                                    label={value}
                                    key={value}
                                    value={value} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Stack>

                {type === "Edit" && <TextField
                    autoFocus
                    margin="dense"
                    label="Location"
                    type="text"
                    fullWidth
                    required
                    value={formData.location}
                    variant="standard"
                    onChange={(event) => onChange(event.target.value, "location")}
                />}

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={!isValid} onClick={() => onSave()}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}