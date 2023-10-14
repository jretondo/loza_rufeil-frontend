import React, { useEffect, useState } from 'react';
import { Col, Collapse, FormGroup, Input, Label, Row } from 'reactstrap';

const InputSearch = ({ itemsList = [], itemSelected = {}, title = "", placeholderInput = "", getNameFn, setItemSelected, searchFn }) => {
    const [textSearched, setTextSearched] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [filteredList, setFilteredList] = useState(itemsList)

    const changeText = (e, keyUp) => {
        const value = keyUp ? textSearched : e.target.value
        setTextSearched(value)
        if (value === "") {
            const newList = itemsList.slice(0, 20)
            setFilteredList(newList)
        } else {
            try {
                const newList = itemsList.filter((item) => searchFn(item, value)).slice(0, 20)
                setFilteredList(newList)
                newList.length === 0 && setFilteredList(itemsList)
            } catch (error) {
                setFilteredList(itemsList)
            }
        }
    }

    const KeyUp = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            try {
                setItemSelected(JSON.parse(e.target.value));
            } catch (error) {
                console.log('error', error);
            }
        }
    }

    const escapeHandler = (e) => {
        if (e.keyCode === 27) {
            e.preventDefault()
            setIsOpen(!isOpen)
        } else {
            setIsOpen(true)
        }
    }

    useEffect(() => {
        const newList = itemsList.slice(0, 20)
        setFilteredList(newList)
    }, [itemsList])

    return (
        <FormGroup style={!title ? { marginBottom: "0px" } : {}}>
            {title && <Label for="searchInp">{title}</Label>}
            {itemSelected ?
                <Row>
                    <Col md="10" style={{ marginRight: 0, paddingRight: "5px" }}>
                        <Input disabled value={getNameFn(itemSelected)} />
                    </Col>
                    <Col md="2" style={{ textAlign: "left", marginLeft: 0, paddingLeft: "5px" }}>
                        <button
                            onClick={e => {
                                e.preventDefault();
                                setItemSelected(false);
                            }}
                            className="btn btn-danger"
                        >X</button>
                    </Col>
                </Row> :
                <> <Input
                    type="text"
                    id="searchInp"
                    placeholder={placeholderInput}
                    value={textSearched}
                    onChange={e => changeText(e)}
                    onBlur={() => setIsOpen(false)}
                    onFocus={() => setIsOpen(true)}
                    onKeyUp={escapeHandler}
                />
                    <Collapse
                        isOpen={isOpen}
                        style={{ position: "absolute", zIndex: 5, width: "92%" }}
                    >
                        <FormGroup>
                            <Input
                                type="select"
                                multiple
                                onFocus={() => setIsOpen(true)}
                                onClick={(e) => {
                                    setItemSelected(JSON.parse(e.target.value));
                                }}
                                onKeyUp={e => KeyUp(e)}
                                onBlur={() => setIsOpen(false)}
                            >
                                {filteredList.length > 0 && filteredList.map((item, key) => {
                                    return (
                                        <option
                                            key={key}
                                            value={JSON.stringify(item)}
                                        >
                                            {getNameFn(item)}
                                        </option>
                                    )
                                })}
                            </Input>
                        </FormGroup>
                    </Collapse></>}
        </FormGroup>
    );
}

export default InputSearch