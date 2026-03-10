import { useDispatch, useSelector } from "react-redux";
import { setFieldSelected } from "../../app/features/filteringSubjectsAndPrograms/filteringSubjectsAndProgramsReducer";
import { useGetAllFieldsQuery } from "../../app/service/field-componentsAPI";
import { useState } from "react";
import SelectedOptions from "../FieldSearchSelector/SelectedOptions";
import FieldSearchSelector from "../FieldSearchSelector/FieldSearchSelector";
import Suggestions from "../FieldSearchSelector/Suggestions";

function FieldsSelection({ pageType }) {
    const headingTitle = "Fields";
    // const fieldNameField = `${pageType}FieldName`;

    // const dispatch = useDispatch();
    // const selectedFieldId = useSelector(state => state.filteringSubjectsAndPrograms.fieldSelected);

    // const handleFieldClick = (id) => {
    //     if (id === selectedFieldId) {
    //         dispatch(setFieldSelected(""));
    //     } else {
    //         dispatch(setFieldSelected(id));
    //     }
    // };

    // const { data: fields, isLoading: loadingFields } = useGetAllFieldsQuery({ pageType, fieldNameField });


    const [selectedOptions, setSelectedOptions] = useState([]);
    const [search, setSearch] = useState("");
    const options = [
        "Science", "Psychology", "Physics", "Politics", "Commerce", "Health & Medicine",
        "Chemistry", "Mathematics", "History", "Archaeology", "Geography", "Zoology",
        "Engineering", "Biology", "Botany", "Neurology", "Biochemistry", "Economics",
        "Computer Science", "Marketing", "Accounting"
    ];

    const handleSelect = (option) => {
        if (!selectedOptions.includes(option)) {
            setSelectedOptions([...selectedOptions, option]);
        }
        // setSearch(""); // Clear search after selection
    };

    const handleRemove = (option) => {
        setSelectedOptions(selectedOptions.filter((item) => item !== option));
    };

    return (
        <div className="primaryPageSizing">
            <h2 className="titleTextSecondary">{headingTitle}</h2>


            <div className="border-2 border-black dark:border-white  mx-4 mt-2 text-gray-300 rounded-lg p-2">
                <div className="flex flex-wrap items-end">
                    <div className="w-full">
                        {selectedOptions?.length > 0 && (
                            <SelectedOptions selectedOptions={selectedOptions} handleRemove={handleRemove} />
                        )}
                    </div>
                    <div className="w-full flex justify-end mt-2">
                        <FieldSearchSelector search={search} setSearch={setSearch} />
                    </div>
                </div>

                <hr className="border-0 border-t-2 border-dotted border-black dark:border-white w-full my-2" />

              
                <div className="p-4">
                    <Suggestions
                        search={search}
                        options={options}
                        selectedOptions={selectedOptions}
                        handleSelect={handleSelect}
                    />
                </div>
            </div>

{/* 
            <div className="flex flex-col sm:grid sm:grid-cols-4 2xl:grid-cols-5 gap-4">
                {loadingFields ? (
                    // Skeleton loaders
                    [...Array(16)].map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse h-12 w-full bg-gray-300 rounded-md dark:bg-gray-700"
                        />
                    ))
                ) : (
                    fields.data.map((field) => (
                        <div
                            key={field.id}
                            id={field.id}
                            className={field.id === selectedFieldId ? "fieldSelectedStyling" : "fieldStyling"}
                            onClick={() => handleFieldClick(field.id)}
                        >
                            {field.attributes[fieldNameField]}
                        </div>
                    ))
                )}
            </div> */}
        </div>
    );
}

export default FieldsSelection;