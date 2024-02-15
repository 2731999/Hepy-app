import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
// import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaMinus } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import img_person from '../images/img_person.png';
import Calendar from '../components/Calendar'

const ProfileDetails = () => {
    const [cookies, setCookie, removeCookie] = useCookies("user")
    const [selectedDOB, setSelectedDOB] = useState(null);
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: '',
        last_name: '',
        selectedImages: [null],
        DOB: selectedDOB,
    });
    const [error, setError] = useState('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleImageChange = (index, image) => {
        setFormData((prevUser) => {
            const newSelectedImages = [...prevUser.selectedImages];
            newSelectedImages[index] = URL.createObjectURL(image);
            return {
                ...prevUser,
                selectedImages: newSelectedImages,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.first_name || !formData.last_name || !formData.DOB) {
            setError('Please fill in all required details.');
            return;
        }

        console.log("First Name:", formData.first_name);
        console.log("Last Name:", formData.last_name);
        console.log("DOB:", formData.DOB);

        try {
            const response = await axios.put('https://hepy-backend.vercel.app/user', { formData });
            const success = response.status === 200;

            if (success) {
                navigate('/Notification');
            }
        } catch (err) {
            console.log(err);
        }
    };


    const handleImageClick = (index) => {
        const fileInput = document.getElementById(`imageInput${index}`);
        if (fileInput) {
            fileInput.setAttribute('capture', 'user');
            fileInput.click();
        }
    };

    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    let navigate = useNavigate()


    return (
        <div className="profile-container">
            <div>
                <h1>Profile Details</h1>
                <div className="slider-container">
                    {formData.selectedImages.map((selectedImage, index) => (
                        <div className="container" key={index} onClick={() => handleImageClick(index)}>
                            <label htmlFor={`imageInput${index}`}>
                                <img
                                    src={selectedImage || img_person}
                                    alt={`${index}`}
                                    className="gallery-image"
                                />
                            </label>
                            <input
                                type="file"
                                id={`imageInput${index}`}
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageChange(index, e.target.files[0])}
                            />
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className='form'>
                    <div className="form-group">
                        <label className='formHead'>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className='form-group-textarea'
                        />
                    </div>
                    <div className="form-group">
                        <label className='formHead'>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className='form-group-textarea'
                        />
                    </div>
                    <div className="form-group">
                        <label className='formHead'>Date of Birth</label>
                        <Calendar dob={formData.DOB} onDateSelect={(date) => setFormData({ ...formData, DOB: date })} />
                    </div>
                </form>
            </div>
            <div className='profileDetailFooter'>
                <div className='profilePhara'>
                    <p>Only your initials will be shown to users.</p>
                    <p>Please upload a minimum of 1 photo.</p>
                    <p>Please confirm all details as you cannot change them once you are verified.</p>
                    <p>Terms & conditions</p>
                </div>
                <button type="submit" className="verify-button" onClick={handleSubmit}>
                    Verify
                </button>
            </div>
            {error && <div className="profile-error-message">{error}</div>}
        </div>
    );
};

export default ProfileDetails;
