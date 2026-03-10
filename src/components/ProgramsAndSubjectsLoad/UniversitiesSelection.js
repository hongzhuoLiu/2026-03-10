import {BASE_URL} from "../../API";
import {useDispatch, useSelector} from "react-redux";
import {
    setUniversitySelected
} from "../../app/features/filteringSubjectsAndPrograms/filteringSubjectsAndProgramsReducer";
import {useGetAllUniversityLogosQuery} from "../../app/service/university-pagesAPI";

function UniversitiesSelection({ disablePrimarySizing = false }) {
    const universitiesTitle = "Universities";

    const dispatch = useDispatch();

    const { data: universities, isLoading: loadingUniversities } = useGetAllUniversityLogosQuery();

    const selectedUniversityId = useSelector(state => state.filteringSubjectsAndPrograms.universitySelected);

    const handleUniversityClick = (id) => {
        if (id === selectedUniversityId) {
            dispatch(setUniversitySelected(""));
        } else {
            dispatch(setUniversitySelected(id));
        }
    };

    return (<div className={disablePrimarySizing ? "" : "primaryPageSizing"}>
            <h2 className="titleTextSecondary">{universitiesTitle}</h2>
            <div className="flex flex-col sm:grid sm:grid-cols-4 2xl:grid-cols-6 w-full h-full relative">
                <button
                    key={0}
                    className={0 === selectedUniversityId ? "allUniStylingSelected uniStylingSize" : "uniStyling uniStylingSize"}
                    onClick={() => handleUniversityClick(0)}
                >
                    <div
                        className={0 === selectedUniversityId ? "text-2xl font-bold text-white dark:text-gray-200" : "text-2xl font-bold text-gray-600 dark:text-gray-600"}
                    >
                        All universities
                    </div>
                </button>

                {!loadingUniversities && universities.data.map((university) => (<button
                    key={university.id}
                    className={university.id === selectedUniversityId ? "uniStylingSelected uniStylingSize" : "uniStyling uniStylingSize"}
                    onClick={() => handleUniversityClick(university.id)}
                >
                    <img
                        src={`${BASE_URL}${university.attributes.universityLogo.data.attributes.formats.thumbnail.url}`}
                        className="w-full h-full object-contain sm:cursor-pointer"
                        alt={university.attributes.universityLogo.data.attributes.alternativeText}
                    />
                </button>))}
            </div>
        </div>)
}

export default UniversitiesSelection;