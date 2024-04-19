import React from 'react';
import Select, { createFilter } from 'react-select';

const InputSearch2 = ({
    itemsList = [],
    placeholderInput = "",
    getNameFn,
    setItemSelected,
    id,
    onFocus,
    autoFocus,
    itemSelected
}) => {
    const filterConfig = {
        ignoreCase: true,
        ignoreAccents: true,
        trim: false,
        matchFrom: 'start',
    };
    return (
        <>
            <style>
                {`
                .basic-single {
                    z-index: 9999;
                }
                .select__control {                    
                    border: 1px solid #ced4da;
                    height: calc(2.70rem + 2px);
                    border: 1px solid #cad1d7;
                }
                .select__single-value {
                    color: #8898aa;
                }
                `}
            </style>
            <Select
                autoFocus={autoFocus}
                id={id}
                onFocus={onFocus}
                className="basic-single"
                classNamePrefix="select"
                value={itemSelected ? { value: itemSelected, label: getNameFn(itemSelected) } : { value: false, label: placeholderInput }}
                defaultValue={itemSelected ? { value: itemSelected, label: getNameFn(itemSelected) } : { value: false, label: placeholderInput }}
                isDisabled={false}
                isLoading={false}
                isClearable={true}
                isRtl={false}
                isSearchable={true}
                name={placeholderInput}
                filterOption={createFilter(filterConfig)}
                options={itemsList.map((item) => {
                    return {
                        value: item,
                        label: getNameFn(item)
                    }
                })
                }
                onChange={(e) => {
                    try {
                        setItemSelected(e.value)
                    } catch (error) {

                    }
                }}
            />
        </>
    );
}

export default InputSearch2