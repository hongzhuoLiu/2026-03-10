import { useState } from "react";
import PageHeading from "../../components/Elements/PageHeading";
import { useGetAllUniversityNamesQuery } from "../../app/service/university-pagesAPI";
import { useCreateFacilityMutation } from "../../app/service/facilitiesApi";
import { useCreateDestinationMutation, useUploadDestinationImageMutation } from "../../app/service/destinationsAPI";
import PreviewUniReview from "../PreviewPages/PreviewUniReview";
import PreviewDetailView from "../PreviewPages/PreviewDetailView";
import AddContentSearch from "../../components/PlaceSearchBox/AddContentSearch";
import SortingDropDownAddContent from "../../components/Elements/SortingDropDownAddContent";
import Add from "../../images/icons/add.png";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

function AddContent() {
    const user = useSelector((state) => state.auth.user); 

    const contentTypeOptions = [
        { value: "university", label: "University" },
        { value: "subject", label: "Program" },
        { value: "course", label: "Subject" },
        { value: "destinations", label: "Destinations" },
        { value: "accommodation", label: "Accommodation" },
        { value: "health", label: "Health" },
        { value: "fitness", label: "Fitness" },
        { value: "eateries", label: "Eateries" },
        { value: "clubs", label: "Clubs & Societies" },
        { value: "culture", label: "Culture & Religion" }
    ];

    const graduateLevelOptions = [
        { value: "Undergraduate", label: "Undergraduate" },
        { value: "Postgraduate", label: "Postgraduate" },
        { value: "Research", label: "Research" }
    ];

    const destinationTypeOptions = [
        { value: "Country", label: "Country" },
        { value: "City", label: "City" },
        { value: "State", label: "State" },
        { value: "Province", label: "Province" },
        { value: "Region", label: "Region" },
        { value: "Other", label: "Other" }
    ];

    const [contentTypeSelect, setContentTypeSelect] = useState("university");
    const [subjectStatus, setSubjectStatus] = useState("Undergraduate");
    const [institution, setInstitution] = useState("");
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [organizationDescription, setOrganizationDescription] = useState("");
    const [rating, setRating] = useState("");
    const [location, setLocation] = useState("");

    // University form fields
    const [uniName, setUniName] = useState("");
    const [uniLocation, setUniLocation] = useState("");
    const [uniLogo, setUniLogo] = useState(null);
    const [uniBanner, setUniBanner] = useState(null);
    const [uniWebsite, setUniWebsite] = useState("");

    // Program/Subject form fields
    const [itemName, setItemName] = useState("");
    const [itemCode, setItemCode] = useState("");
    const [itemDesc, setItemDesc] = useState("");
    const [itemWebsite, setItemWebsite] = useState("");

    // Destinations form fields
    const [destName, setDestName] = useState("");
    const [destLocation, setDestLocation] = useState("");
    const [destLogo, setDestLogo] = useState(null);
    const [destHeaderImage, setDestHeaderImage] = useState(null);
    const [destType, setDestType] = useState("Country");
    const [destWebpage, setDestWebpage] = useState("");
    const [destWebpageName, setDestWebpageName] = useState("");
    const [destLogoFile, setDestLogoFile] = useState(null);
    const [destHeaderFile, setDestHeaderFile] = useState(null);

    // Generic organization form fields
    const [orgName, setOrgName] = useState("");
    const [orgDesc, setOrgDesc] = useState("");
    const [orgWebsite, setOrgWebsite] = useState("");

    // RTK Query hooks
    const { data: universities } = useGetAllUniversityNamesQuery();
    const [createFacility, { isLoading: isCreatingFacility }] = useCreateFacilityMutation();

    const handleLogoUpload = (event) => {
        setUniLogo(URL.createObjectURL(event.target.files[0]));
    };

    const handleBannerUpload = (event) => {
        setUniBanner(URL.createObjectURL(event.target.files[0]));
    };

    const [createDestination, { isLoading: isCreatingDestination }] = useCreateDestinationMutation();
    
    const [uploadDestinationImage] = useUploadDestinationImageMutation();

    const handleDestLogoUpload = (event) => {
        const file = event.target.files[0];
        const objectUrl = URL.createObjectURL(file);
        setDestLogo(objectUrl);
        setDestLogoFile(file);
        
        console.log("Destination Logo uploaded:", {
            fileName: file.name,
            fileType: file.type,
            fileSize: `${(file.size / 1024).toFixed(2)} KB`,
            objectUrl: objectUrl
        });
    };

    const handleDestHeaderImageUpload = (event) => {
        const file = event.target.files[0];
        const objectUrl = URL.createObjectURL(file);
        setDestHeaderImage(objectUrl);
        setDestHeaderFile(file);
        
        console.log("Destination Header Image uploaded:", {
            fileName: file.name,
            fileType: file.type,
            fileSize: `${(file.size / 1024).toFixed(2)} KB`,
            objectUrl: objectUrl
        });
    };  

    const handleUniversityInputChange = (e) => {
        const input = e.target.value.toLowerCase();
        const filtered = universities?.data.filter((u) =>
            u.attributes.universityName.toLowerCase().includes(input)
        );
        setFilteredUniversities(filtered || []);
        setInstitution(input);
    };

    const handleUniversityItemClick = (universityName) => {
        setInstitution(universityName);
        setFilteredUniversities([]);
    };

    const handleContentTypeChange = (value) => {
        setContentTypeSelect(value);
    };

    // Submit handler function
    const handleSubmit = async () => {

        // Check if user is logged in
        if (!user) {
            toast.warn("Please log in to submit content.",{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: {
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    backgroundColor: "#fff3cd",
                    color: "#856404",
                    border: "2px solid #ffeeba",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                },
            });
            return;
        }

        // For university, subject and course content types - only show preview
        if (contentTypeSelect === "university" || 
            contentTypeSelect === "subject" || 
            contentTypeSelect === "course") {
            // Just show preview for now
            setShowPreview(true);
            return;
        }
        
        // For destinations content type - handle submission to API
        if (contentTypeSelect === "destinations") {
            try {
                // Validate required fields
                if (!destName) {
                    console.error("Destination name is required");
                    alert("Destination name is required");
                    return;
                }

                // Handle image uploads - get file objects
                let destinationLogoId = null;
                let destinationHeaderImageId = null;
                
                // Upload logo image if present
                if (destLogo && destLogoFile) {

                    const originalFileName = destLogoFile.name;
                    const originalFileType = destLogoFile.type;
                    const fileExtension = originalFileName.split('.').pop();
                    
                    // Convert blob URL to File object
                    const logoResponse = await fetch(destLogo);
                    const logoBlob = await logoResponse.blob();
                    const logoFile = new File(
                        [logoBlob], 
                        `dest_logo_${Date.now()}.${fileExtension}`, 
                        { type: originalFileType }
                    );
                    
                    // Upload the image to Strapi
                    console.log("About to upload logo image, file size:", logoFile.size);
                    const logoUploadResponse = await uploadDestinationImage({
                        file: logoFile,
                    }).unwrap();
                    console.log("Logo upload response:", logoUploadResponse);
                    
                    const uploadedFileId = logoUploadResponse[0].id;
                    console.log("Logo uploaded successfully, ID:", uploadedFileId);
                    
                    destinationLogoId = uploadedFileId;
                }
                
                // Upload header image if present
                if (destHeaderImage && destHeaderFile) {
                    // Convert blob URL to File object
                    const originalFileName = destHeaderFile.name;
                    const originalFileType = destHeaderFile.type;
                    const fileExtension = originalFileName.split('.').pop();
                    
                    // Convert blob URL to File object
                    const headerResponse = await fetch(destHeaderImage);
                    const headerBlob = await headerResponse.blob();
                    const headerFile = new File(
                        [headerBlob], 
                        `dest_header_${Date.now()}.${fileExtension}`, 
                        { type: originalFileType }
                    );
                    
                    // Upload the image to Strapi
                    const headerUploadResponse = await uploadDestinationImage({
                        file: headerFile,
                    }).unwrap();
                    
                    const uploadedFileId = headerUploadResponse[0].id;
                    console.log("Header image uploaded successfully, ID:", uploadedFileId);
                    
                    destinationHeaderImageId = uploadedFileId;
                }
                
                // Prepare submission data - map form fields to API fields
                const destinationData = {
                    destinationName: destName,
                    destinationLocation: destLocation,
                    destinationType: destType,
                    webpageName: destWebpageName,
                    webpage: destWebpage,
                    destinationDescription: orgDesc,
                    ...(destinationLogoId && { destinationLogo: destinationLogoId }),
                    ...(destinationHeaderImageId && { destinationHeaderImage: destinationHeaderImageId })
                };
                
                console.log("Submitting destination data:", destinationData);

                // Send request to create destination
                const response = await createDestination(destinationData).unwrap();
                
                // Handle successful response
                const newDestinationId = response.data.id;
                alert(`Destination created successfully! ID: ${newDestinationId}`);
                
                // Reset form fields
                setDestName("");
                setDestLocation("");
                setDestLogo(null);
                setDestHeaderImage(null);
                setDestType("Country");
                setDestWebpage("");
                setDestWebpageName("");
                setOrgDesc("");
                
            } catch (error) {
 
                console.error("Error creating destination:", error);
                console.error("Error details:", {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                    status: error.status,
                    data: error.data,
                    response: error.response,
                });
                
                if (error.data) {
                    alert(`Creation failed: ${JSON.stringify(error.data)}`);
                } else {
                    alert(`Creation failed: ${error.message || "Unknown error"}`);
                }
            }
            
            return;
        }
        
        // For facility types (accommodation, health, fitness, eateries, clubs, culture)
        try {
            // Get university ID from selected university
            const universityId = institution && universities?.data 
                ? universities.data.find(u => u.attributes.universityName === institution)?.id 
                : null;
            
            // Map contentTypeSelect to facilityType enum value
            const facilityTypeMap = {
                "accommodation": "Accommodation",
                "health": "Health",
                "fitness": "Fitness",
                "eateries": "Eateries",
                "clubs": "Clubs & Societies",
                "culture": "Culture & Religion"
            };
            
            // Prepare submission data
            const facilityData = {
                facilityName: orgName,
                facilityType: facilityTypeMap[contentTypeSelect],
                facilityDescription: organizationDescription,
                facilityLocation: location, // This should be properly set from PlaceSearchBox
                facilityLinks: orgWebsite,
                facilityAdditionalInformation: orgDesc,
                // Add university relation if available
                ...(universityId && { university_page: universityId })
            };
            
            // Validate required fields
            if (!facilityData.facilityName) {
                console.error("Name is required");
                alert("Name is required");
                return;
            }
            
            // Log the data being sent to help with debugging
            console.log("Submitting facility data:", facilityData);
            
            // Send create request
            const response = await createFacility(facilityData).unwrap();
            
            // Success handling
            // Use the response data
            const newFacilityId = response.data.id;
            alert(`Facility created successfully! ID: ${newFacilityId}`);
            
            // Reset form
            setOrgName("");
            setOrganizationDescription("");
            setInstitution("");
            setLocation("");
            setRating(0);
            setOrgWebsite("");
            setOrgDesc("");
            
        } catch (error) {
            // Error handling
            console.error("Error creating facility:", error);
            alert(`Creation failed: ${error.message || "Unknown error"}`);
        }
    };
    return (
        <div className="w-screen bg-white dark:bg-gray-900">
            <div className="h-full w-full">
                <PageHeading pageName="Add Content" icon={Add} />
                
                {/* Content Type Dropdown */}
                <div className="flex justify-center my-4">
                    <div className="w-64 z-40">
                        <SortingDropDownAddContent
                            options={contentTypeOptions}
                            selectedValue={contentTypeSelect}
                            onChange={handleContentTypeChange}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    {/* University Form */}
                    {contentTypeSelect === "university" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:mx-52">
                            <div className="w-full">
                                <div className="editTextStyling mb-2">University Name</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Enter university name"
                                    value={uniName}
                                    onChange={(e) => setUniName(e.target.value)}
                                />
                            </div>
                            <div className="w-full">
                                <div className="editTextStyling mb-2">University Location</div>
                                <AddContentSearch 
                                    onLocationSelected={(place) => {
                                        if (place && place.formatted_address) {
                                            setUniLocation(place.formatted_address);
                                        }
                                    }}
                                    initialValue={uniLocation}
                                    className="w-full"
                                    inputClassName="editInputStyling px-4 py-2"
                                />
                                {uniLocation && (
                                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Selected: {uniLocation}
                                    </div>
                                )}
                            </div>
                            <div className="w-full">
                                <div className="editTextStyling mb-2">University Logo</div>
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="hidden"
                                    onChange={handleLogoUpload}
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="fileInput"
                                    className="block w-full px-4 py-3 ml-1 appearance-none rounded-md cursor-pointer bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 border-2 border-dashed border-gray-500"
                                >
                                    Upload Logo
                                </label>
                            </div>
                            <div className="w-full">
                                <div className="editTextStyling mb-2">University Backdrop</div>
                                <input
                                    type="file"
                                    id="fileInput2"
                                    className="hidden"
                                    onChange={handleBannerUpload}
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="fileInput2"
                                    className="block w-full px-4 py-3 ml-1 appearance-none rounded-md cursor-pointer bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 border-2 border-dashed border-gray-500"
                                >
                                    Upload Backdrop
                                </label>
                            </div>
                            <div className="col-span-1 md:col-span-2 w-full">
                                <div className="editTextStyling mb-2">University Website</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Paste university website URL"
                                    value={uniWebsite}
                                    onChange={(e) => setUniWebsite(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                                <button
                                    className="shadow-md rounded-md flex justify-center items-center text-black bg-white dark:text-gray-800 font-bold cursor-pointer w-full py-3 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={() => setShowPreview(true)}
                                >
                                    Preview
                                </button>
                                <button
                                    className="shadow-md rounded-md flex justify-center items-center text-white bg-sc-red dark:text-gray-200 font-bold cursor-pointer w-full py-3 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Program Form */}
                    {contentTypeSelect === "subject" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:mx-52">
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Program Name</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Enter program name"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                />
                            </div>
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Program Code</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Enter program code"
                                    value={itemCode}
                                    onChange={(e) => setItemCode(e.target.value)}
                                />
                            </div>
                            <div className="relative z-10 w-full">
                                <div className="editTextStyling mb-2">University Name</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    value={institution}
                                    placeholder="Enter university name"
                                    onChange={handleUniversityInputChange} 
                                    type='text'
                                />
                                {filteredUniversities.length > 0 && (
                                    <ul className="universityList absolute w-full bg-white dark:bg-gray-800 shadow-lg rounded-md mt-1 max-h-48 overflow-y-auto">
                                        {filteredUniversities.map((university, index) => (
                                            <li 
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                onClick={() => handleUniversityItemClick(university.attributes.universityName)}
                                            >
                                                {university.attributes.universityName}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="w-full">
                                <div className="editTextStyling mb-4">Graduate Level</div>
                                <SortingDropDownAddContent 
                                    options={graduateLevelOptions}
                                    selectedValue={subjectStatus}
                                    onChange={(value) => setSubjectStatus(value)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 w-full">
                                <div className="editTextStyling mb-2">Program Website</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Paste program website URL"
                                    value={itemWebsite}
                                    onChange={(e) => setItemWebsite(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 w-full">
                                <div className="editTextStyling mb-2">Program Description</div>
                                <textarea
                                    className="editInputStyling w-full h-32 md:h-48 px-4 py-2 resize-none rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200"
                                    placeholder="Enter the program description"
                                    value={itemDesc}
                                    onChange={(e) => setItemDesc(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                                <button
                                    className="shadow-md rounded-md flex justify-center items-center text-black bg-white dark:text-gray-800 font-bold cursor-pointer w-full py-3 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={() => setShowPreview(true)}
                                >
                                    Preview
                                </button>
                                <button
                                    className="shadow-md rounded-md flex justify-center items-center text-white bg-sc-red dark:text-gray-200 font-bold cursor-pointer w-full py-3 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Subject Form */}
                    {contentTypeSelect === "course" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:mx-52">
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Subject Name</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Enter subject name"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                />
                            </div>
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Subject Code</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Enter subject code"
                                    value={itemCode}
                                    onChange={(e) => setItemCode(e.target.value)}
                                />
                            </div>
                            <div className="relative z-10 w-full">
                                <div className="editTextStyling mb-2">University Name</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    value={institution}
                                    placeholder="Enter university name"
                                    onChange={handleUniversityInputChange} 
                                    type='text'
                                />
                                {filteredUniversities.length > 0 && (
                                    <ul className="universityList absolute w-full bg-white dark:bg-gray-800 shadow-lg rounded-md mt-1 max-h-48 overflow-y-auto">
                                        {filteredUniversities.map((university, index) => (
                                            <li 
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                onClick={() => handleUniversityItemClick(university.attributes.universityName)}
                                            >
                                                {university.attributes.universityName}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="w-full">
                                <div className="editTextStyling mb-4">Graduate Level</div>
                                <SortingDropDownAddContent 
                                    options={graduateLevelOptions}
                                    selectedValue={subjectStatus}
                                    onChange={(value) => setSubjectStatus(value)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 w-full">
                                <div className="editTextStyling mb-2">Subject Website</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Paste subject website URL"
                                    value={itemWebsite}
                                    onChange={(e) => setItemWebsite(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 w-full">
                                <div className="editTextStyling mb-2">Subject Description</div>
                                <textarea
                                    className="editInputStyling w-full h-32 md:h-48 px-4 py-2 resize-none rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200"
                                    placeholder="Enter the subject description"
                                    value={itemDesc}
                                    onChange={(e) => setItemDesc(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                                <button
                                    className="shadow-md rounded-md flex justify-center items-center text-black bg-white dark:text-gray-800 font-bold cursor-pointer w-full py-3 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={() => setShowPreview(true)}
                                >
                                    Preview
                                </button>
                                <button
                                    className="shadow-md rounded-md flex justify-center items-center text-white bg-sc-red dark:text-gray-200 font-bold cursor-pointer w-full py-3 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Destinations Form */}
                    {contentTypeSelect === "destinations" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:mx-52">
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Destination Name</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Enter destination name"
                                    value={destName}
                                    onChange={(e) => setDestName(e.target.value)}
                                />
                            </div>
                            
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Destination Location</div>
                                <AddContentSearch 
                                    onLocationSelected={(place) => {
                                        if (place && place.formatted_address) {
                                            setDestLocation(place.formatted_address);
                                        }
                                    }}
                                    initialValue={destLocation}
                                    className="w-full"
                                    inputClassName="editInputStyling px-4 py-2"
                                />
                                {destLocation && (
                                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Selected: {destLocation}
                                    </div>
                                )}
                            </div>
                            
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Destination Logo</div>
                                <input
                                    type="file"
                                    id="destLogoInput"
                                    className="hidden"
                                    onChange={handleDestLogoUpload}
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="destLogoInput"
                                    className="block w-full px-4 py-3 ml-1 appearance-none rounded-md cursor-pointer bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 border-2 border-dashed border-gray-500"
                                >
                                    Upload Logo
                                </label>
                            </div>
                            
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Destination Header Image</div>
                                <input
                                    type="file"
                                    id="destHeaderInput"
                                    className="hidden"
                                    onChange={handleDestHeaderImageUpload}
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="destHeaderInput"
                                    className="block w-full px-4 py-3 ml-1 appearance-none rounded-md cursor-pointer bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 border-2 border-dashed border-gray-500"
                                >
                                    Upload Header Image
                                </label>
                            </div>
                            
                            <div className="w-full">
                                <div className="editTextStyling mb-4">Destination Type</div>
                                <SortingDropDownAddContent 
                                    options={destinationTypeOptions}
                                    selectedValue={destType}
                                    onChange={(value) => setDestType(value)}
                                />
                            </div>
                            
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Webpage Name</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Enter webpage name"
                                    value={destWebpageName}
                                    onChange={(e) => setDestWebpageName(e.target.value)}
                                />
                            </div>
                            
                            <div className="col-span-1 md:col-span-2 w-full">
                                <div className="editTextStyling mb-2">Webpage URL</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Paste webpage URL"
                                    value={destWebpage}
                                    onChange={(e) => setDestWebpage(e.target.value)}
                                />
                            </div>
                            
                            <div className="col-span-1 md:col-span-2 w-full">
                                <div className="editTextStyling mb-2">Additional Information</div>
                                <textarea
                                    className="editInputStyling w-full h-32 md:h-48 px-4 py-2 resize-none rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200"
                                    placeholder="Enter additional information"
                                    value={orgDesc}
                                    onChange={(e) => setOrgDesc(e.target.value)}
                                />
                            </div>
                            
                            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                                <button
                                    className="shadow-md rounded-md flex justify-center items-center text-black bg-white dark:text-gray-800 font-bold cursor-pointer w-full py-3 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={() => setShowPreview(true)}
                                >
                                    Preview
                                </button>
                                <button
                                    className="shadow-md rounded-md flex justify-center items-center text-white bg-sc-red dark:text-gray-200 font-bold cursor-pointer w-full py-3 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={handleSubmit}
                                    disabled={isCreatingDestination}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Generic Organization Form (for other new content types) */}
                    {(contentTypeSelect === "accommodation" || 
                      contentTypeSelect === "health" || 
                      contentTypeSelect === "fitness" || 
                      contentTypeSelect === "eateries" || 
                      contentTypeSelect === "clubs" || 
                      contentTypeSelect === "culture") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:mx-52">
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Name</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Enter name"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                />
                            </div>
                            
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Description</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Enter description"
                                    value={organizationDescription}
                                    onChange={(e) => setOrganizationDescription(e.target.value)}
                                />
                            </div>
                            
                            <div className="relative z-10 w-full">
                                <div className="editTextStyling mb-2">University Name</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    value={institution}
                                    placeholder="Enter university name"
                                    onChange={handleUniversityInputChange} 
                                    type='text'
                                />
                                {filteredUniversities.length > 0 && (
                                    <ul className="universityList absolute w-full bg-white dark:bg-gray-800 shadow-lg rounded-md mt-1 max-h-48 overflow-y-auto">
                                        {filteredUniversities.map((university, index) => (
                                            <li 
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                onClick={() => handleUniversityItemClick(university.attributes.universityName)}
                                            >
                                                {university.attributes.universityName}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            
                            <div className="w-full">
                                <div className="editTextStyling mb-2">Location</div>
                                <AddContentSearch 
                                    onLocationSelected={(place) => {
                                        if (place && place.formatted_address) {
                                            setLocation(place.formatted_address);
                                        }
                                    }}
                                    initialValue={location}
                                    className="w-full"
                                    inputClassName="editInputStyling px-4 py-2"
                                />
                                {location && (
                                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Selected: {location}
                                    </div>
                                )}
                            </div>
                            
                            <div className="col-span-1 md:col-span-2 w-full">
                                <div className="editTextStyling mb-2">Website of the organisation</div>
                                <input 
                                    className="editInputStyling w-full px-4 py-2" 
                                    placeholder="Paste website URL"
                                    value={orgWebsite}
                                    onChange={(e) => setOrgWebsite(e.target.value)}
                                />
                            </div>
                            
                            <div className="col-span-1 md:col-span-2 w-full">
                                <div className="editTextStyling mb-2">Additional Information</div>
                                <textarea
                                    className="editInputStyling w-full h-32 md:h-48 px-4 py-2 resize-none rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200"
                                    placeholder="Enter additional information"
                                    value={orgDesc}
                                    onChange={(e) => setOrgDesc(e.target.value)}
                                />
                            </div>
                            
                            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                                <button
                                    className="shadow-md rounded-md flex justify-center items-center text-black bg-white dark:text-gray-800 font-bold cursor-pointer w-full py-3 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={() => setShowPreview(true)}
                                >
                                    Preview
                                </button>
                                <button
                                    className="shadow-md rounded-md flex justify-center items-center text-white bg-sc-red dark:text-gray-200 font-bold cursor-pointer w-full py-3 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={handleSubmit}
                                    disabled={isCreatingFacility}
                                >
                                    {isCreatingFacility ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Previews */}
                    {showPreview && contentTypeSelect === "university" && (
                        <PreviewUniReview
                            uniBanner={uniBanner}
                            uniName={uniName}
                            uniLocation={uniLocation}
                            uniLogo={uniLogo}
                            onClose={() => setShowPreview(false)}
                        />
                    )}
                    {showPreview && contentTypeSelect === "destinations" && (
                        <PreviewDetailView
                            uniName="Destination"
                            itemName={destName}
                            itemGrad={destType}
                            itemDesc={orgDesc}
                            destLogo={destLogo}
                            destHeaderImage={destHeaderImage}
                            location={destLocation}
                            orgWebsite={destWebpage}
                            onClose={() => setShowPreview(false)}
                        />
                    )}
                    {showPreview && (contentTypeSelect === "subject" || contentTypeSelect === "course") && (
                        <PreviewDetailView
                            uniName={institution}
                            itemName={itemName}
                            itemGrad={subjectStatus}
                            itemDesc={itemDesc}
                            onClose={() => setShowPreview(false)}
                        />
                    )}
                    {showPreview && (contentTypeSelect === "accommodation" || 
                    contentTypeSelect === "health" || 
                    contentTypeSelect === "fitness" || 
                    contentTypeSelect === "eateries" || 
                    contentTypeSelect === "clubs" || 
                    contentTypeSelect === "culture") && (
                        <PreviewDetailView
                            uniName={contentTypeOptions.find(option => option.value === contentTypeSelect)?.label || ""}
                            itemName={orgName}
                            itemGrad={organizationDescription}
                            itemDesc={orgDesc}
                            // Additional props
                            institution={institution}
                            location={location}
                            rating={rating}
                            orgWebsite={orgWebsite}
                            contentType={contentTypeSelect}
                            // University ID from universities list
                            universityId={
                                institution && universities?.data 
                                ? universities.data.find(u => u.attributes.universityName === institution)?.id 
                                : ""
                            }
                            onClose={() => setShowPreview(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddContent;