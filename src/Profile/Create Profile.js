import React, {useState, useEffect} from "react";
import DefaultProfilePic from "../images/miscellaneous/DefaultProfilePhoto.jpg";
import CrossBtnLight from '../images/icons/CrossLight.png';
import {useDispatch, useSelector} from "react-redux";
import {useGetAllUniversityNamesQuery} from "../app/service/university-pagesAPI";
import { useGetAllFieldsQuery } from "../app/service/field-componentsAPI";
import {useUpdateUserProfileMutation} from "../app/service/usersAPI";
import {useUploadPictureMutation} from "../app/service/uploadAPI";
import {setCredentials} from "../app/features/authentication/AuthenticationReducer";
import {toggleUIState} from "../app/features/ui/UIReducer";
import InterestCircle from "../components/Elements/InterestCircle";
import CustomDropdown from "../components/Elements/CustomDropDown";

function CreateProfile() {

    useEffect(() => {
        // Disable background scrolling
        document.body.style.overflow = 'hidden';
        
        // Clean up function to re-enable scrolling when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const {user} = useSelector((state) => state.auth)

    const [institution, setInstitution] = useState('The Australian National University');
    const [studentStatus, setStudentStatus] = useState('Looking for University');
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [photoFile, setPhotoFile] = useState(DefaultProfilePic);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [userInterests, setUserInterests] = useState(user?.interests || []); // State for interests
    const [availableFields, setAvailableFields] = useState([]); // Get programFieldComponents
    const { data: fields, isLoading: loadingFields } = useGetAllFieldsQuery({ pageType: "subject", fieldNameField: "subjectFieldName" });

    useEffect(() => {
        if (fields?.data) {
            const filteredFields = fields.data.filter(field => 
                !userInterests.some(interest => interest.programFieldName === field.attributes.subjectFieldName)
            );
            setAvailableFields(filteredFields);
        }
    }, [fields, userInterests]);

    const handleAddInterest = async (newInterest) => {
        if (!newInterest) return; // Prevent empty selection

        const updatedInterests = [...userInterests, newInterest];
        setUserInterests(updatedInterests); // Update UI

        // Update backend
        try {
            const updatedUser = {
                ...user,
                interests: updatedInterests
            };

            await updateUserProfile(updatedUser).unwrap();
            dispatch(setCredentials(updatedUser)); // Update Redux state
        } catch (error) {
            console.error("Error updating interests", error);
        }
    };

    const dispatch = useDispatch()

    const {data: universities} = useGetAllUniversityNamesQuery();


    const handleUniversityInputChange = (e) => {
        const input = e.target.value.toLowerCase();
        const filtered = universities.data.filter(u => u.attributes.universityName.toLowerCase().includes(input));
        setFilteredUniversities(filtered);
        setInstitution(input);
    };

    const handleUniversityItemClick = (universityName) => {
        setInstitution(universityName);
        setFilteredUniversities([]);
    };

    const [uploadProfilePicture] = useUploadPictureMutation();
    const [updateUserProfile] = useUpdateUserProfileMutation();


    const handleUpdateProfile = async () => {
        const selectedUniversity = universities.data.find(
            (university) => university.attributes.universityName === institution
        );

        const universityId = selectedUniversity ? selectedUniversity.id : null;

        const updatedUser = {
            ...user,
            university: {
                id: universityId,
                universityName: institution,
            },
            studentStatus: studentStatus,
        };

        const formData = new FormData();
        formData.append("files", photoFile);

        const valuesChanged = (
            updatedUser.university?.universityName !== user.university?.universityName ||
            updatedUser.studentStatus !== user.studentStatus
        );


        try {
            setLoading(true);

            if (photoFile !== DefaultProfilePic) {
                const uploadResponse = await uploadProfilePicture(formData).unwrap();
                console.log('Upload Success:', uploadResponse);
                setError("Profile Updated!");
            }

            if (valuesChanged) {
                const updateResponse = await updateUserProfile(updatedUser).unwrap();
                console.log('Update Success:', updateResponse);
                setError("Profile Updated!");

                dispatch(setCredentials(updatedUser));

                dispatch(toggleUIState({key: 'showCreateProfile'}));
                dispatch(toggleUIState({key: 'showProfile'}));
            } else {
                setError("No values changed!");
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error?.data?.message || "Error!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed top-0 left-0 m-0 w-screen h-[100dvh] flex justify-center items-center z-10 bg-black bg-opacity-50">

            <div className="popUpStyling justify-between min-h-full">
                <div className="flex justify-center items-center w-full h-full">
                    <div className="mx-auto text-center w-full h-full flex flex-col justify-between flex-grow">

                        <div className="flex justify-end items-center relative w-full h-[8vh] mt-[7vh] sm:mt-0">
                            <img src={CrossBtnLight}
                                 className="h-[50px] ml-3 bg-white dark:bg-gray-600 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
                                 alt="Cancel button"
                                 onClick={() => dispatch(toggleUIState({key: 'showCreateProfile'}))}/>
                        </div>

                        <h1 className="text-center text-3xl text-sc-red font-bold mt-0 sm:mt-[-5%]">Let's finish up your profile!</h1>

                        <div className="mt-5">

                            <InterestCircle 
                                userInterests={userInterests} 
                                setUserInterests={setUserInterests}
                                updateUserProfile={updateUserProfile}
                                dispatch={dispatch}
                                setCredentials={setCredentials} // Pass setCredentials as a prop
                                user={user}
                                edit
                            />

                            {/* Add Interests Dropdown */}
                            <CustomDropdown
                                availableFields={availableFields}
                                loadingFields={loadingFields}
                                handleAddInterest={handleAddInterest}
                                userInterests={userInterests}
                            />

                        </div>
                        
                        <div className="w-[95%] sm:w-1/2 flex mx-auto">
                            {/* Need to fix this input */}
                            <input type="file" id="fileInput" className="hidden"
                                   onChange={(e) => setPhotoFile(e.target.files[0])} accept="image/*"/>

                            <label for="fileInput" className="blueEditStyling mt-4">
                                Change Picture
                            </label>
                        </div>

                        <div className="block sm:flex justify-between mr-3">
                            <div className="w-full sm:w-[49%]">
                                <div className="editTextStyling">Student status</div>
                                <select className="editInputStyling" defaultValue={'Looking for University'}
                                        onChange={(e) => setStudentStatus(e.target.value)}>
                                    <option value='Undergraduate'>Undergraduate</option>
                                    <option value='Postgraduate'>Postgraduate</option>
                                    <option value='Looking for University'>Looking for a University</option>
                                </select>
                            </div>

                            <div className="w-full sm:w-[49%]">
                                <div className="editTextStyling">University</div>
                                <input className="editInputStyling" value={institution}
                                       onChange={handleUniversityInputChange} type='text'/>
                                {filteredUniversities.length > 0 && (
                                    <ul className="universityList">
                                        {filteredUniversities.map((university, index) => (
                                            <h2 key={index}
                                                onClick={() => handleUniversityItemClick(university.attributes.universityName)}>
                                                {university.attributes.universityName}
                                            </h2>
                                        ))}
                                    </ul>
                                )}
                            </div>

                        </div>

                        <button className="popUpButtonStyling" onClick={handleUpdateProfile}>
                            <p>{loading ? "Finishing Profile..." : "Finish Profile"}</p>
                        </button>
                        {error && <h4 className="error">{error}</h4>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateProfile