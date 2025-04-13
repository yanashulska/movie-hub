import './MoreDetails.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const MoreDetails = () => {
    const { id, contentType } = useParams();
    const [detailsData, setDetailsData] = useState(null);
    const [director, setDirector] = useState('')
    const [writer, setWriter] = useState('')

    const bearerToken = import.meta.env.VITE_API_BEARER_TOKEN;
    const fetchDetails = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`
            }
        };
        const url = `https://api.themoviedb.org/3/${contentType}/${id}?language=en-US`;

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            setDetailsData(data)
        } catch (error) {
            console.error('Error fetching content', error)
        };
    }

    const fetchCredits = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`
            }
        }
        const url = `https://api.themoviedb.org/3/${contentType}/${id}/credits?language=en-US`;

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            const director = data.crew.find((member) => member.job === 'Director');
            const writer = data.crew.find((member) => member.job === 'Writer');
            setDirector(director ? director.name : 'N/A');
            setWriter(writer ? writer.name : 'N/A');
        } catch (error) {
            console.error('Error fetching movie credits', error);
        }
    };


    useEffect(() => {
        if (id && contentType) {
            fetchDetails();
            fetchCredits();
        }
    }, [id, contentType]);

    if (!detailsData) {
        return <div>Loading</div>
    }


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-GB', options)
    }

    const genres = detailsData.genres?.map((genre) => genre.name).join(', ') || 'N/A';
    const languages = detailsData.spoken_languages?.map((language) => language.name).join(', ') || 'N/A';
    const countryOfOrigin = detailsData.production_countries?.map((country) => country.name).join(', ') || 'N/A';
    const releaseDate = formatDate(detailsData.release_date || detailsData.first_air_date || 'N/A');

    return (
        <div className='additional-info-container'>
            <div className='page-title'>
                More Details
            </div>

            <div className='additional-info'>
                <div className='info-item'>
                    <p className='info-item-title'>Genres</p>
                    <div className='info-items'>{genres}</div>
                </div>

                <div className='info-item'>
                    <p className='info-item-title'>Country of origin</p>
                    <div className='info-items'>{countryOfOrigin}</div>
                </div>

                <div className='info-item'>
                    <p className='info-item-title'>Languages</p>
                    <div className='info-items'>{languages}</div>
                </div>

                <div className='info-item'>
                    <p className='info-item-title'>Director</p>
                    <div className='info-items'>{director}</div>
                </div>

                <div className='info-item'>
                    <p className='info-item-title'>Release date</p>
                    <div className='info-items'>{releaseDate}</div>
                </div>

                <div className='info-item'>
                    <p className='info-item-title'>Writer</p>
                    <div className='info-items'>{writer}</div>
                </div>

            </div>
        </div>
    )
}

export default MoreDetails