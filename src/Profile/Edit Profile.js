import CrossBtnLight from '../images/icons/CrossLight.png';
import React, { useEffect, useState } from "react";
import { useGetAllUniversityNamesQuery } from "../app/service/university-pagesAPI";
import {
    useGetAllUploadedPicturesQuery,
    useUpdateUploadedPictureMutation,
} from "../app/service/uploadAPI";
import { useUpdateUserProfileMutation } from "../app/service/usersAPI";
import { setCredentials } from "../app/features/authentication/AuthenticationReducer";
import { useDispatch, useSelector } from "react-redux";
import { toggleUIState } from "../app/features/ui/UIReducer";
import { useGetAllFieldsQuery } from "../app/service/field-componentsAPI";
import CustomDropdown from '../components/Elements/CustomDropDown';
import InterestCircle from '../components/Elements/InterestCircle';
import PasswordReset from './PasswordReset'; // 导入密码重置组件

function EditProfile() {

    useEffect(() => {
        // Disable background scrolling
        document.body.style.overflow = 'hidden';
        
        // Clean up function to re-enable scrolling when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const { user } = useSelector((state) => state.auth);

    const [displayName, setDisplayName] = useState(user?.username);
    const [email, setEmail] = useState(user?.email);
    const [institution, setInstitution] = useState("");
    const [studentStatus, setStudentStatus] = useState("");
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [userInterests, setUserInterests] = useState(user?.interests || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [photoFile] = useState(null);

    // 添加密码重置状态
    const [showPasswordReset, setShowPasswordReset] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            setDisplayName(user.username);
            setEmail(user.email);
            setInstitution(user.university?.universityName || "");
            setStudentStatus(user.studentStatus || "");
            setLoading(false);
            setProfilePhoto(user.avatar?.formats?.thumbnail?.url || "");
        }
    }, [user]);

    const { data: universities } = useGetAllUniversityNamesQuery();
    const { data: response } = useGetAllUploadedPicturesQuery();

    const [updateProfilePicture] = useUpdateUploadedPictureMutation();
    const [updateUserProfile] = useUpdateUserProfileMutation();

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

    const handleAddInterest = async (newInterest) => {
        if (!newInterest) return;

        const updatedInterests = [...userInterests, newInterest];
        setUserInterests(updatedInterests);

        try {
            const updatedUser = {
                ...user,
                interests: updatedInterests
            };

            await updateUserProfile(updatedUser).unwrap();
            dispatch(setCredentials(updatedUser));
        } catch (error) {
            console.error("Error updating interests", error);
        }
    };

    const handleUpdateProfile = async () => {
        const selectedUniversity = universities.data.find(
            (university) => university.attributes.universityName === institution
        );

        const universityId = selectedUniversity ? selectedUniversity.id : null;

        const updatedUser = {
            ...user,
            username: displayName,
            email: email,
            university: {
                id: universityId,
                universityName: institution,
            },
            studentStatus: studentStatus
        };

        const formData = new FormData();
        formData.append("files", photoFile);

        const valuesChanged = (
            updatedUser.username !== user.username ||
            updatedUser.email !== user.email ||
            updatedUser.university?.universityName !== user.university?.universityName ||
            updatedUser.studentStatus !== user.studentStatus
        );

        if (photoFile && photoFile.name !== profilePhoto.slice(profilePhoto.lastIndexOf("/") + 1)) {
            try {
                const id = response.data.filter(u => u.formats.thumbnail.url.toLowerCase().includes(profilePhoto))[0].id;

                try {
                    setLoading(true);

                    const uploadData = { id: id, formData: formData };
                    const uploadResponse = await updateProfilePicture(uploadData).unwrap();
                    console.log('Upload Success:', uploadResponse);
                    setError("Profile Updated!");

                    updatedUser.avatar = uploadResponse.data;

                    try {
                        const updateResponse = await updateUserProfile(updatedUser).unwrap();
                        console.log('Update Success:', updateResponse);
                        setError("Profile Updated!");

                        dispatch(setCredentials(updatedUser));

                        setProfilePhoto(uploadResponse.data.formats.thumbnail.url);
                    } catch (err) {
                        console.error('Error uploading file:', err);
                        setError(err?.message ?? "Error!");
                    }

                } catch (error) {
                    console.error(JSON.stringify(error));
                }
            } catch (error) {
                console.error(JSON.stringify(error));
            }

        } else if (valuesChanged) {
            try {
                setLoading(true);

                const updateResponse = await updateUserProfile(updatedUser).unwrap();
                console.log('Update Success:', updateResponse);
                setError("Profile Updated!");

                dispatch(setCredentials(updatedUser));
            } catch (updateError) {
                console.error('Error updating user profile:', updateError);
                setError(updateError?.message ?? "Error updating profile!");
            }

            setLoading(false);
        } else {
            setError("No values changed!");
        }

    };

    const [availableFields, setAvailableFields] = useState([]);
    
    const { data: fields, isLoading: loadingFields } = useGetAllFieldsQuery({ pageType: "subject", fieldNameField: "subjectFieldName" });

    useEffect(() => {
        if (fields?.data) {
            const filteredFields = fields.data.filter(field => 
                !userInterests.some(interest => interest.programFieldName === field.attributes.subjectFieldName)
            );
            setAvailableFields(filteredFields);
        }
    }, [fields, userInterests]);

    // 如果显示密码重置界面，则渲染密码重置组件
    if (showPasswordReset) {
        return <PasswordReset onClose={() => setShowPasswordReset(false)} />;
    }

    return (
        <div className="fixed top-0 left-0 m-0 w-screen h-[100dvh] flex justify-center items-center z-10 bg-black bg-opacity-50">
            <div className="popUpStyling justify-between min-h-full">
                <div className="flex flex-col justify-center items-center w-full flex-grow mt-12 sm:mt-0">
                    {user && (
                        <div className="mx-auto text-center w-full h-full flex flex-col justify-between flex-grow">

                            <div className="flex justify-between items-center relative w-full h-[8vh] sm:mt-[-10px]">

                                <button 
                                    className="bg-sc-red shadow-md rounded-md flex justify-evenly items-center text-white font-bold cursor-pointer w-[150px] h-[50px] py-2 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={handleUpdateProfile}>
                                    <p>{loading ? "Updating Profile..." : "Update Profile"}</p>
                                </button>

                                <div className="flex">
                                    <button
                                        className="h-[50px] w-[150px] rounded-md bg-white dark:bg-gray-600 shadow-md text-xl font-bold text-gray-500 dark:text-gray-200 sm:hover:shadow-xl transition duration-300"
                                        onClick={() => {
                                            dispatch(toggleUIState({ key: 'showEditProfile' }));
                                            dispatch(toggleUIState({ key: 'showProfile' }));
                                        }}>Back to Profile
                                    </button>
                                    <img src={CrossBtnLight}
                                        className="h-[50px] ml-3 bg-white dark:bg-gray-600 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
                                        alt="Cancel button"
                                        onClick={() => dispatch(toggleUIState({ key: 'showEditProfile' }))}/>
                                </div>
                                
                            </div>

                            <InterestCircle 
                                userInterests={userInterests} 
                                setUserInterests={setUserInterests}
                                updateUserProfile={updateUserProfile}
                                dispatch={dispatch}
                                setCredentials={setCredentials}
                                user={user}
                                edit
                            />

                            <CustomDropdown
                                availableFields={availableFields}
                                loadingFields={loadingFields}
                                handleAddInterest={handleAddInterest}
                                userInterests={userInterests}
                            />

                            <br />

                            {/* 修改按钮区域：Change Picture 和 Forget Password 并排 */}


{/* 修改按钮区域：Change Picture 和 Forget Password 并排 */}
<div className="w-[95%] sm:w-1/2 flex mx-auto space-x-4">
    <div className="flex-1">
        <input type="file" id="fileInput" className="hidden"
            onChange="setPhotoFile(event.target.files[0])" accept="image/*"/>
        <label htmlFor="fileInput" className="blueEditStyling w-full block">
            Change Picture
        </label>
    </div>
    
    <div className="flex-1">
        <button 
            onClick={() => setShowPasswordReset(true)}
            className="blueEditStyling w-full block"
        >
            Forget Password
        </button>
    </div>
</div>



                            <div className="block sm:grid sm:grid-cols-2">
                                <div className="w-[95%]">
                                    <div className="editTextStyling">Display name</div>
                                    <input className="editInputStyling" placeholder={user?.username}
                                        onChange={(e) => setDisplayName(e.target.value)} type='text'></input>
                                </div>

                                <div className="w-[95%]">
                                    <div className="editTextStyling">Student status</div>
                                    <select className="editInputStyling" defaultValue={user?.studentStatus}
                                            onChange={(e) => setStudentStatus(e.target.value)}>
                                        <option value='Undergraduate'>Undergraduate</option>
                                        <option value='Postgraduate'>Postgraduate</option>
                                        <option value='Looking for University'>Looking for a University</option>
                                    </select>
                                </div>

                                <div className="w-[95%]">
                                    <div className="editTextStyling">Email</div>
                                    <input className="editInputStyling" placeholder={user?.email}
                                        onChange={(e) => setEmail(e.target.value)} type='email'></input>
                                </div>

                                <div className="w-[95%]">
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

                            {error && <h4 className="error">{error}</h4>}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditProfile;