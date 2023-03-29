import React, { useState } from 'react';
import {Link} from "react-router-dom";
import { validationUtils } from "../utils/validations.js";
import "../css/product-add.css"

export default function ProductAdd() {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [weight, setWeight] = useState('');
    const [size, setSize] = useState('');
    const [height, setHeight] = useState('');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('');
    const [hideDisc, setHideDisc] = useState(true);
    const [hideBook, setHideBook] = useState(true);
    const [hideFurniture, setHideFurniture] = useState(true);
    const [showNameValidation, setShowNameValidation] = useState(false);
    const [showSkuValidation, setShowSkuValidation] = useState(false);
    const [showWeightValidation, setShowWeightValidation] = useState(false);
    const [showSizeValidation, setShowSizeValidation] = useState(false);
    const [showHeightValidation, setShowHeightValidation] = useState(false);
    const [showLengthValidation, setShowLengthValidation] = useState(false);
    const [showWidthValidation, setShowWidthValidation] = useState(false);
    const [showPriceValidation, setShowPriceValidation] = useState(false);
    const [showTypeValidation, setShowTypeValidation] = useState(false);

    const cancelButton = React.createRef();
    const attributeDescription = React.createRef();
    const apiError = React.createRef();

    const resetAttributes = () => {
        setHeight('');
        setWidth('');
        setLength('');
        setSize('');
        setWeight('');
        setHideDisc(true);
        setHideBook(true);
        setHideFurniture(true);
    }

    const handleNameChange = (event) => {
        if (!validationUtils.validateNonEmptyString(event.target.value)) {
            setShowNameValidation(true);
        } else {
            setShowNameValidation(false);
        }
        setName(event.target.value);
    };

    const handleSkuChange = (event) => {
        if (!validationUtils.validateNonEmptyString(event.target.value)) {
            setShowSkuValidation(true);
        } else {
            setShowSkuValidation(false);
        }
        setSku(event.target.value);
    };

    const handlePriceChange = (event) => {
        if (!validationUtils.validatePrice(event.target.value)) {
            setShowPriceValidation(true);
        } else {
            setShowPriceValidation(false);
        }
        setPrice(event.target.value);
    };

    const handleTypeChange = (event) => {
        if (!validationUtils.validateNonEmptyString(event.target.value)) {
            setShowTypeValidation(true);
        } else {
            setShowTypeValidation(false);
        }
        setType(event.target.value);
        resetAttributes();
        if (event.target.value === 'Book') {
            setHideBook(false);
            attributeDescription.current.textContent = 'Weight of the book in KG, if it has 5 kilograms, text 5';
        } else if (event.target.value === 'DVD') {
            setHideDisc(false);
            attributeDescription.current.textContent = 'Size of the disc in MB, if it has 5 MB, text 5';
        } else if (event.target.value === 'Furniture') {
            setHideFurniture(false);
            attributeDescription.current.textContent = 'Dimensions of the furniture in meters, text only numbers';
        } else {
            attributeDescription.current.textContent = '';
        }
    };

    const handleWeightChange = (event) => {
        if (!validationUtils.validateNumericString(event.target.value)) {
            setShowWeightValidation(true);
        } else {
            setShowWeightValidation(false);
        }
        setWeight(event.target.value)
    };

    const handleHeightChange = (event) => {
        if (!validationUtils.validateNumericString(event.target.value)) {
            setShowHeightValidation(true);
        } else {
            setShowHeightValidation(false);
        }
        setHeight(event.target.value);
    };

    const handleWidthChange = (event) => {
        if (!validationUtils.validateNumericString(event.target.value)) {
            setShowWidthValidation(true);
        } else {
            setShowWidthValidation(false);
        }
        setWidth(event.target.value);
    };

    const handleLengthChange = (event) => {
        if (!validationUtils.validateNumericString(event.target.value)) {
            setShowLengthValidation(true);
        } else {
            setShowLengthValidation(false);
        }
        setLength(event.target.value);
    };

    const handleSizeChange = (event) => {
        if (!validationUtils.validateNumericString(event.target.value)) {
            setShowSizeValidation(true);
        } else {
            setShowSizeValidation(false);
        }
        setSize(event.target.value);
    };

    const handleSaveClick = async () => {
        const requestBody = {
            name: name,
            sku: sku,
            type: type,
            price: +(price),
            attributes: {}
        };
        let hasError = false;
        if (!validationUtils.validateNonEmptyString(name)) {
            setShowNameValidation(true);
            hasError = true;
        }
        if (!validationUtils.validateNonEmptyString(sku)) {
            setShowSkuValidation(true);
            hasError = true;
        }
        if (!validationUtils.validatePrice(price)) {
            setShowPriceValidation(true);
            hasError = true;
        }
        if (!validationUtils.validateNonEmptyString(type)) {
            setShowTypeValidation(true);
            hasError = true;
        }

        if (type === 'Book') {
            if (!validationUtils.validateNumericString(weight)) {
                setShowWeightValidation(true);
                hasError = true;
            }
            requestBody.attributes.weight = weight + ' KG';
        } else if (type === 'DVD') {
            if (!validationUtils.validateNumericString(size)) {
                setShowSizeValidation(true);
                hasError = true;
            }
            requestBody.attributes.size = size + ' MB';
        } else if (type === 'Furniture') {
            if (!validationUtils.validateNumericString(height)) {
                setShowHeightValidation(true);
                hasError = true;
            }
            if (!validationUtils.validateNumericString(width)) {
                setShowWidthValidation(true);
                hasError = true;
            }
            if (!validationUtils.validateNumericString(length)) {
                setShowLengthValidation(true);
                hasError = true;
            }
            requestBody.attributes.dimensions = `${height}x${width}x${length}`;
        }
        if (hasError) {
            return;
        }
        const apiErrorDiv = apiError.current;

        await fetch('http://localhost:8000/product/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(requestBody)

        }).then(response => response.json())
            .then(data => {
                if (!data) {
                    throw Error;
                }
            }).catch(error => {
            console.error(error);
            hasError = true;
            apiErrorDiv.textContent = 'There was an error registering the product, maybe this SKU is already in use, try changing it';
        });
        if (hasError) {
            return;
        }
        cancelButton.current.click();
    };

    return (
        <div className="product-add">
            <h2 className="card-title form-title">Add Product</h2>
            <form id="product_form">
                <div className="form-group">
                    <label htmlFor="sku">SKU:</label>
                    <input type="text" id="sku" name="sku" value={sku} onChange={handleSkuChange}/>
                    {showSkuValidation && (<div className="validation-message alert alert-danger">Please provide a SKU</div>)}
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={name} onChange={handleNameChange}/>
                    {showNameValidation && (<div className="validation-message alert alert-danger">Please provide a name</div>)}
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input type="text" id="price" name="price" value={price} onChange={handlePriceChange}/>
                    {showPriceValidation && (<div className="validation-message alert alert-danger">Please provide a valid price</div>)}
                </div>
                <div className="form-group">
                    <label htmlFor="type">Type Switcher:</label>
                    <select id="productType" name="productType" value={type} onChange={handleTypeChange}>
                        <option value="">Please select a type</option>
                        <option value="Book">Book</option>
                        <option value="DVD">DVD</option>
                        <option value="Furniture">Furniture</option>
                    </select>
                    {showTypeValidation && (<div className="validation-message alert alert-danger">Please select a type</div>)}
                </div>
                {!hideBook && (
                    <div className="book-attribute-form">
                        <label htmlFor="weight">Weight:</label>
                        <input type="text" id="weight" name="weight" value={weight} onChange={handleWeightChange}/>
                        {showWeightValidation && (<div className="validation-message alert alert-danger">Please provide a valid weight</div>)}
                    </div>
                )}
                {!hideFurniture && (
                    <div className="furniture-attribute-form">
                        <label htmlFor="height">Height:</label>
                        <input type="text" id="height" name="height" value={height} onChange={handleHeightChange}/>
                        {showHeightValidation && (<div className="validation-message alert alert-danger">Please provide a valid height</div>)}
                        <br/>
                        <label htmlFor="width">Width:</label>
                        <input type="text" id="width" name="width" value={width} onChange={handleWidthChange}/>
                        {showWidthValidation && (<div className="validation-message alert alert-danger">Please provide a valid width</div>)}
                        <br/>
                        <label htmlFor="length">Length:</label>
                        <input type="text" id="lenght" name="lenght" value={length} onChange={handleLengthChange}/>
                        {showLengthValidation && (<div className="validation-message alert alert-danger">Please provide a valid length</div>)}
                        <br/>
                    </div>
                )}
                {!hideDisc && (
                    <div className="disc-attribute-form">
                        <label htmlFor="size">Size:</label>
                        <input type="text" id="size" name="size" value={size} onChange={handleSizeChange}/>
                        {showSizeValidation && (<div className="validation-message alert alert-danger">Please provide a valid size</div>)}
                    </div>
                )}
                <div className="attribute-description alert-info" ref={attributeDescription}></div>
                <div className="form-group">
                    <button type="button" onClick={handleSaveClick}>Save</button>
                    <Link to="/">
                        <button ref={cancelButton} type="button">Cancel</button>
                    </Link>
                </div>
                <div className="api-error alert-danger" ref={apiError}></div>
            </form>
        </div>
    );
}
