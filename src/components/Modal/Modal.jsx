import './Modal.css';
import { Link } from 'react-router-dom';

const Modal = ({ isOpen, closeModal, modalContent }) => {

    if (!isOpen) return null;

    const fallbackIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-file-earmark-image-fill" viewBox="0 0 16 16">
            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707v5.586l-2.73-2.73a1 1 0 0 0-1.52.127l-1.889 2.644-1.769-1.062a1 1 0 0 0-1.222.15L2 12.292V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zm-1.498 4a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
            <path d="M10.564 8.27 14 11.708V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.293l3.578-3.577 2.56 1.536 2.426-3.395z" />
        </svg>

    )
    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <button className='close-btn' onClick={closeModal} aria-label="Close modal"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg></button>
                <div className='modal-header'>
                    <div className="modal-img-container">
                        {modalContent.poster_path && modalContent.poster_path !== "" ? (
                            <img className='modal-img' src={`https://image.tmdb.org/t/p/w500${modalContent.poster_path}`} alt={modalContent.title || modalContent.name} />
                        ) : (
                            <div>{fallbackIcon}</div>
                        )}
                    </div>
                    <div className='modal-content-details'>
                        <div className='modal-title'>{modalContent.title || modalContent.name} <Link to={`/${modalContent.media_type === 'movie' ? 'movie' : 'tv'}/${modalContent.id}`} className='arrow-btn'> &gt; </Link></div>
                        <div className='modal-title-item'>{modalContent.release_date.slice(0, 4) || modalContent.first_air_date?.slice(0, 4) || 'N/A'} <span> | </span> {modalContent.media_type}</div>
                        <div className='modal-title-item'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" className="bi bi-star-fill" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg> {modalContent.vote_average.toFixed(1)}
                        </div>
                    </div>
                </div>
                <div className='modal-description'>
                    {modalContent.overview}</div>
                <div className='modal-character'>
                    {modalContent.character && (
                        <>
                            <div>
                                <p className='modal-title-item-character'>Actor's character:</p></div>
                            <div>
                                {modalContent.character}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Modal