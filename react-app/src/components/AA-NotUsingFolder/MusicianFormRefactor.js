import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllMusicians, addingFullMusician } from "../../store/musician";

const MusicianFormRefactor = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.session.user);

    // const [musicians, setMusicians] = useState([]);
    const [musician_name, setMusicianName] = useState("");
    const [profile_img, setProfileImg] = useState('');
    const [biography, setBiography] = useState("");


    const userId = user.id
    const onSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!profile_img || !biography || !musician_name) {
            alert("Please fill in all fields and select an image");
            return;
        }

        try {
            const result = await dispatch(
                addingFullMusician(profile_img, biography, userId, musician_name)
            );

            if (result && result.error) {
                console.error("Error creating musician:", result.error);
                alert("Error creating musician: " + result.error);
                return;
            }

            // Refresh the musicians list
            dispatch(getAllMusicians());

            // Navigate to user profile
            history.push(`/users/${user.id}`);
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred");
        }
    };

    const updateProfileImg = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, JPG, or PNG)');
                e.target.value = '';
                return;
            }

            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                e.target.value = '';
                return;
            }

            setProfileImg(file);
        }
    };

    return (
        <div className="outer_card">
            <h1 id="add-musician-text">Add A Musician</h1>
            <form className="musician-form" onSubmit={onSubmit}>
                <div className="input_container">
                    <label htmlFor="musician_name" >
                        Musician Name
                    </label>
                    <input
                        type="text"
                        name="musician_name"
                        placeholder="Musician Name"
                        onChange={(e) => setMusicianName(e.target.value)}
                        value={musician_name}
                    />
                </div>
                <label htmlFor="add-profile-pic" >
                    Add Profile Picture
                </label>
                <input

                    type="file"
                    accept="image/*"
                    name="profile_img"
                    onChange={updateProfileImg}
                />
                <label htmlFor="biography" style={{ color: "white" }}>
                    Biography
                </label>
                <textarea
                    name="biography"
                    type="text"
                    placeholder="biography..."
                    onChange={(e) => setBiography(e.target.value)}
                    value={biography}
                />
                <button className="submit" type="submit" id="create_musician">
                    Submit
                </button>
            </form>
        </div>
    );
};
export default MusicianFormRefactor;

// Sample code from PayChecker.js for context
// PayChecker.js

function calculateBasePay(hoursWorked, hourlyRate = 15) {
    return hoursWorked * hourlyRate;
}

function calculateOvertimePay(hoursWorked, hourlyRate = 15) {
    const overtimeHours = Math.max(0, hoursWorked - 40);
    return overtimeHours * hourlyRate * 1.5;
}

function calculateTotalPay({
    hoursWorked,
    serviceCharge = 0,
    gratuity = 0,
    shiftPremium = 0,
    pto = 0,
    holidayPay = 0,
    predictPay = 0,
}) {
    const basePay = calculateBasePay(hoursWorked);
    const overtimePay = calculateOvertimePay(hoursWorked);
    return (
        basePay +
        overtimePay +
        serviceCharge +
        gratuity +
        shiftPremium +
        pto +
        holidayPay +
        predictPay
    );
}

const week1 = {
    hoursWorked: 44.75,
    serviceCharge: 638.81,
    gratuity: 226.55,
    shiftPremium: 0,
    pto: 0,
    holidayPay: 0,
    predictPay: 0,
};

const week2 = {
    hoursWorked: 28.18,
    serviceCharge: 530.71,
    gratuity: 150.00,
    shiftPremium: 0,
    pto: 0,
    holidayPay: 0,
    predictPay: 0,
};
