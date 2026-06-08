import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './SearchPage.css';

function SearchPage() {
    // Categories and Conditions arrays for dropdown generation
    const categories = ['Living', 'Bedroom', 'Kitchen', 'Office', 'Kids', 'Other'];
    const conditions = ['New', 'Like New', 'Older'];

    // State initialization
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6); // Initialize with default middle value
    const [searchResults, setSearchResults] = useState([]);
    
    const navigate = useNavigate();

    // Run an initial blank search on component load to populate products
    useEffect(() => {
        handleSearch();
    }, []);

    // Fetch search results based on user inputs
    const handleSearch = async () => {
        const baseUrl = `${urlConfig.backendUrl}/api/search?`;
        
        // Grab values directly from dropdowns to build clean URL query parameters
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: document.getElementById('categorySelect') ? document.getElementById('categorySelect').value : '',
            condition: document.getElementById('conditionSelect') ? document.getElementById('conditionSelect').value : '',
        }).toString();

        try {
            const response = await fetch(`${baseUrl}${queryParams}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    // Navigate to the details page of a selected gift
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Search for Gifts</h2>
            
            <div className="search-box p-4 border rounded bg-light shadow-sm">
                {/* Text input field for search criteria */}
                <div className="mb-3">
                    <label htmlFor="searchQuery" className="form-label font-weight-bold">Product Name</label>
                    <input
                        type="text"
                        id="searchQuery"
                        className="form-control"
                        placeholder="Type to search for gifts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="row">
                    {/* Category Dropdown */}
                    <div className="col-md-4 mb-3">
                        <label htmlFor="categorySelect" className="form-label font-weight-bold">Category</label>
                        <select id="categorySelect" className="form-control">
                            <option value="">All</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Condition Dropdown */}
                    <div className="col-md-4 mb-3">
                        <label htmlFor="conditionSelect" className="form-label font-weight-bold">Condition</label>
                        <select id="conditionSelect" className="form-control">
                            <option value="">All</option>
                            {conditions.map(condition => (
                                <option key={condition} value={condition}>{condition}</option>
                            ))}
                        </select>
                    </div>

                    {/* Age Range Slider */}
                    <div className="col-md-4 mb-3">
                        <label htmlFor="ageRange" className="form-label font-weight-bold">Less than {ageRange} years old</label>
                        <input
                            type="range"
                            className="form-control-range w-100"
                            id="ageRange"
                            min="1"
                            max="10"
                            value={ageRange}
                            onChange={e => setAgeRange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Search Button to trigger search operation */}
                <button onClick={handleSearch} className="btn btn-primary w-100 mt-2">
                    Search Products
                </button>
            </div>

            {/* Display fetched search results */}
            <div className="search-results mt-5 row">
                {searchResults.length > 0 ? (
                    searchResults.map(product => (
                        <div key={product.id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                {product.image && (
                                    <img src={product.image} alt={product.name} className="card-img-top object-fit-cover" style={{ height: '200px' }} />
                                )}
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text text-muted flex-grow-1">
                                        {product.description ? `${product.description.slice(0, 100)}...` : 'No description available.'}
                                    </p>
                                </div>
                                <div className="card-footer bg-transparent border-top-0">
                                    <button onClick={() => goToDetailsPage(product.id)} className="btn btn-outline-primary w-100">
                                        View More
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info text-center" role="alert">
                            No products found. Please revise your filters.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;