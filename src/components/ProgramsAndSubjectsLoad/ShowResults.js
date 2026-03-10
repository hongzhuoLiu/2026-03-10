import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useGetSearchResultsQuery} from "../../app/service/any-pagesAPI";
import {useState, useMemo, useEffect} from "react";

function ShowResults({pageType}) {
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerRow = 4; // 4 results per row
    const rowsPerPage = 3; // How many rows per page
    const resultsPerPage = resultsPerRow * rowsPerPage;

    const fieldComponentName = `${pageType}_field_component`;
    const graduationLevelField = `${pageType}GraduationLevel`;
    const resultNameField = `${pageType}Name`;
    const resultPath = pageType;

    const resultsTitle = "Results";
    const noResultsTitle = "No Results";

    // const sortType = "University";
    // const orderType = "Highest to lowest";

    const navigate = useNavigate();

    const fieldId = useSelector(state => state.filteringSubjectsAndPrograms.fieldSelected);
    const graduationLevel = useSelector(state => state.filteringSubjectsAndPrograms.graduationLevelSelected);
    const universityId = useSelector(state => state.filteringSubjectsAndPrograms.universitySelected);

    const handleResultClick = (universityId, id, slug) => {
        // Use slug if available, otherwise fall back to id
        const identifier = slug || id;
        navigate(`/universities/${universityId}/${resultPath}/${identifier}`);
    };

    const { data: searchResult, isLoading } = useGetSearchResultsQuery({
        pageType,
        universityId,
        graduationLevel,
        fieldId,
        fieldComponentName,
        graduationLevelField,
    });


    const processedResults = useMemo(() => {
        if (!searchResult?.data) return [];
        
    
        const groupedByUniversity = searchResult.data.reduce((acc, result) => {
            const uniId = result.attributes.university_page?.data?.id;
            if (!uniId) return acc;
            
            if (!acc[uniId]) {
                acc[uniId] = {
                    universityName: result.attributes.university_page.data.attributes.universityName,
                    results: []
                };
            }
            acc[uniId].results.push(result);
            return acc;
        }, {});

     
        return Object.entries(groupedByUniversity).map(([uniId, data]) => ({
            universityId: uniId,
            universityName: data.universityName,
            results: data.results
        }));
    }, [searchResult]);

    const totalPages = useMemo(() => {
        if (!processedResults.length) return 0;
        

        const totalResults = processedResults.reduce((sum, uni) => sum + uni.results.length, 0);
        return Math.ceil(totalResults / resultsPerPage);
    }, [processedResults, resultsPerPage]);


    const getCurrentPageResults = useMemo(() => {
        if (!processedResults.length) return [];
        
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        

        const allResults = processedResults.flatMap(uni => 
            uni.results.map(result => ({
                ...result,
                universityId: uni.universityId,
                universityName: uni.universityName
            }))
        );
        
        return allResults.slice(startIndex, endIndex);
    }, [processedResults, currentPage, resultsPerPage]);


    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= maxVisiblePages; i++) {
                    pageNumbers.push(i);
                }
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pageNumbers.push(i);
                }
            }
        }
        return pageNumbers;
    };

    const Pagination = () => {
        if (!totalPages) return null;
        
        const pageNumbers = getPageNumbers();

        return (
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-rose-900 text-white hover:bg-rose-950'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`w-8 h-8 rounded-full ${
                            currentPage === number
                                ? 'bg-rose-900 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {number}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-rose-900 text-white hover:bg-rose-950'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        );
    };


    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    return (
        <div className="primaryPageSizing">
            <h2 className="titleTextSecondary">{resultsTitle}</h2>

            {!isLoading && getCurrentPageResults.length > 0 ? (
                <div>
                    {Array.from(new Set(getCurrentPageResults.map(result => result.universityId))).map((uniId) => {
                        const universityResults = getCurrentPageResults.filter(result => result.universityId === uniId);
                        const universityName = universityResults[0]?.universityName;

                        return (
                            <div key={uniId}>
                                <div className="grid grid-cols-1 p-0 m-0">
                                    <div className="text-sc-red dark:text-gray-200 my-1 relative text-center text-3xl pt-5 font-bold">
                                        {universityName}
                                    </div>
                                </div>
                                <div className={`grid grid-cols-${resultsPerRow} gap-4`}>
                                    {universityResults.map((result, resultIndex) => (
                                        <div
                                            key={resultIndex}
                                            className="fieldStyling"
                                            onClick={() => handleResultClick(uniId, result.id, result.attributes?.slug)}
                                        >
                                            {result.attributes[resultNameField]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    <Pagination />
                </div>
            ) : (
                <div className="grid grid-cols-1 p-0 m-0">
                    <div className="text-sc-red dark:text-gray-200 my-1 relative text-center text-3xl pt-5 font-bold">
                        {noResultsTitle}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShowResults;