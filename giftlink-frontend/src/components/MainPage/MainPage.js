import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`);
                }
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchGifts();
    }, []);

    const goToDetails = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="container mt-3">
            <div className="row">
                {gifts.map((gift) => {
                    // FIXED: Read image paths straight from the local frontend asset workspace
                    const imageUrl = gift.image ? gift.image : null;

                    return (
                        <div key={gift._id || gift.id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm" onClick={() => goToDetails(gift.id)} style={{ cursor: 'pointer', zIndex: 10 }}>
                                <div className="image-placeholder">
                                    {imageUrl ? (
                                        <img 
                                            src={imageUrl} 
                                            alt={gift.name} 
                                            className="card-img-top" 
                                            style={{ height: '200px', objectFit: 'cover' }} 
                                        />
                                    ) : (
                                        <div className="no-image-available text-center py-5 bg-light text-muted">No Image Available</div>
                                    )}
                                </div>
                                <div className="card-body bg-white text-dark">
                                    <h5 className="card-title font-weight-bold">{gift.name}</h5>
                                    <p className="card-text text-secondary mb-1">Category: {gift.category}</p>
                                    <p className="card-text text-secondary">Added: {formatDate(gift.date_added)}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MainPage;