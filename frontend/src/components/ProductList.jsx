import React, { useEffect, useState } from 'react';
import "../css/product-list.css"
import {Link} from "react-router-dom";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/product/list')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleProductSelect = (productId) => {
        const index = selectedProducts.indexOf(productId);
        if (index !== -1) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const handleDeleteButtonClick = () => {
        fetch('http://localhost:8000/product/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({
                ids: selectedProducts
            })
        })
            .then(response => response.json())
            .then(data => {
                setProducts(products.filter(product => !selectedProducts.includes(product.id)));
                setSelectedProducts([]);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div className="product-list">
            <button className="delete-button" onClick={handleDeleteButtonClick}>MASS DELETE</button>
            <Link to="/add">
                <button className="add-button">ADD</button>
            </Link>
            <div className="grid-container">
                {products.map(product => (
                    <div className="grid-item" key={product.id}>
                        <input className="delete-checkbox" type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => handleProductSelect(product.id)} />
                        <div className="product-info">
                            <span className="product-id" hidden>{product.id}</span>
                            <span className="product-sku card-text">{product.sku}</span>
                            <span className="product-name card-text">{product.name}</span>
                            <span className="product-price card-text">{product.price} $</span>
                            <div className="product-attributes">
                                {Object.keys(product.attributes).map(attributeKey => (
                                    <div key={attributeKey}>
                                        <span className="attribute-index card-text">{attributeKey}:</span>
                                        <span className="attribute-value card-text">{product.attributes[attributeKey]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}