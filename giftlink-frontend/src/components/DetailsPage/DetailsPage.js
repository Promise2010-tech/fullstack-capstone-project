import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

function DetailsPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Task 1: Check for authentication and redirect if necessary
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
            navigate('/app/login');
            return;
        }

        // Task 3: Scroll to the top of the page on component mount
        window.scrollTo(0, 0);

        // Task 2: Fetch gift details using the gift ID from the URL
        const fetchGiftDetails = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error; status: ${response.status}`);
                }
                const data = await response.json();
                setGift(data);
            } catch (err) {
                // Task 7: Ensure error handling for failed fetch operations
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGiftDetails();
    }, [productId, navigate]);

    // Task 4: Handle user click to navigate back to the previous page
    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) return <div className="container mt-5 text-center"><h3>Loading product details...</h3></div>;
    if (error) return <div className="container mt-5 text-center text-danger"><h3>Error: {error}</h3></div>;
    if (!gift) return <div className="container mt-5 text-center"><h3>Gift item not found.</h3></div>;

    // Comments extraction (fallback to empty array if undefined)
    const comments = gift.comments || [];

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-4" onClick={handleBackClick}>
                &larr; Back to List
            </button>
            
            <div className="row">
                {/* Task 5: Display Gift Image */}
                <div className="col-md-6 mb-4">
                    {/* UPDATED: Matches Task 1 class selector */}
                    <div className="image-placeholder-large text-center border rounded bg-light">
                        {gift.image ? (
                            /* UPDATED: Matches Task 2 class selector */
                            <img src={gift.image} alt={gift.name} className="img-fluid product-image-large" />
                        ) : (
                            /* UPDATED: Matches Task 3 class selector */
                            <div className="no-image-available-large py-5 text-muted">No Image Available</div>
                        )}
                    </div>
                </div>

                {/* Task 6: Display Gift Details */}
                <div className="col-md-6">
                    {/* UPDATED: Matches Task 5 class selector */}
                    <h2 className="details-title font-weight-bold">{gift.name}</h2>
                    <div className="card shadow-sm mb-4">
                        {/* UPDATED: Matches Task 4 class selector */}
                        <div className="card-header">Gift Attributes</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><strong>Category:</strong> {gift.category}</li>
                            <li className="list-group-item"><strong>Condition:</strong> {gift.condition}</li>
                            <li className="list-group-item"><strong>Age (Years/Months):</strong> {gift.age_days ? `${Math.round(gift.age_days / 30)} months` : 'N/A'}</li>
                            <li className="list-group-item"><strong>Date Added:</strong> {new Date(gift.date_added * 1000).toLocaleDateString()}</li>
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h4>Description</h4>
                        <p className="text-secondary">{gift.description}</p>
                    </div>
                </div>
            </div>

            {/* Task 7: Dynamically render the comments section for the gift */}
            {/* UPDATED: Matches Task 6 class selector */}
            <div className="comments-section shadow-sm border rounded">
                <h3>Comments ({comments.length})</h3>
                <hr />
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={comment.id || index} className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <p className="card-text mb-1">{comment.comment}</p>
                                <small className="text-muted">By: {comment.author || 'Anonymous'}</small>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No comments posted yet for this gift item.</p>
                )}
            </div>
        </div>
    );
}

export default DetailsPage;