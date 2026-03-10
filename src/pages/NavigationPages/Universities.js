import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../API";
import { useEffect, useState } from "react";
import GradCap from '../../images/icons/graduationCol.png';
import SelectButtonGroup from '../../components/Elements/SelectButtonGroup';
import Grid from '../../images/icons/Grid.png';
import List from '../../images/icons/List.png';
import StarYellow from '../../images/icons/StarYellowFill.png';

import PageHeading from "../../components/Elements/PageHeading";

import { useGetUniversitiesPageTextQuery } from "../../app/service/universitiesPageTextAPI";
import AddContentSearch from "../../components/PlaceSearchBox/AddContentSearch";


function Universities() {
    const [universities, setUniversities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [sortOption, setSortOption] = useState('alphabetical');
    const [displayOption, setDisplayOption] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const universitiesPerRow = 4; // 4 universities per row
    const rowsPerPage = 2; // How many rows per page
    const universitiesPerPage = universitiesPerRow * rowsPerPage;

    const { data: universitiespageText, isError: isPageTextError, isLoading: isPageTextLoading } = useGetUniversitiesPageTextQuery();

    console.log(isPageTextError)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sortField =
                    sortOption === 'alphabetical'
                        ? 'universityName:asc'
                        : sortOption === 'highestRating'
                            ? 'universityRating:desc'
                            : 'universityRating:asc';
                const response = await fetch(
                    `${BASE_URL}/api/university-pages?populate[universityLogo][fields][0]=alternativeText&populate[universityLogo][fields][1]=formats&sort[0]=${sortField}`
                );
                const responseData = await response.json();

                setUniversities(responseData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [sortOption]);

    const handleClick = (slugOrId) => {
        navigate(`/universities/${slugOrId}`);
    };

    const handleSearch = async () => {
        try {
            if (searchQuery.trim() !== "") {
                const response = await fetch(
                    `https://backendstudentschoicedev.sithumd.com/api/fuzzy-search/search?query=${searchQuery}`
                );
                const searchData = await response.json();

                const updatedSearchData = await Promise.all(
                    searchData['university-pages'].map(async (item) => {
                        const response = await fetch(
                            `https://backendstudentschoicedev.sithumd.com/api/university-pages/${item.id}?populate[universityLogo][fields][0]=formats`
                        );
                        const bannerData = await response.json();

                        return {
                            ...item,
                            universitySlug: bannerData?.data?.attributes?.slug || null,
                            universityLogo: bannerData?.data?.attributes?.universityLogo || null,
                        };
                    })
                );

                setSearchResult(updatedSearchData);
                setShowResults(true);
            }
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    useEffect(() => {
        if (showResults) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    }, [showResults]);

    // Dynamic SEO injection for Universities page
    useEffect(() => {
        const pageTitle = "Explore Universities Worldwide | Universities in Australia | Students Choice";
        const pageDescription = "Discover and compare universities worldwide. Search by name, location, and ratings. Find reviews, insights and guidance from real students";
        const origin = window.location.origin;
        const canonicalUrl = `${origin}/universities`;

        const setOrCreateMetaByName = (name, content) => {
            let tag = document.querySelector(`meta[name="${name}"]`);
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute("name", name);
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
        };

        const setOrCreateMetaByProperty = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute("property", property);
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
        };

        const setOrCreateLinkCanonical = (href) => {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement("link");
                link.setAttribute("rel", "canonical");
                document.head.appendChild(link);
            }
            link.setAttribute("href", href);
        };

        const setJsonLd = (id, json) => {
            let script = document.getElementById(id);
            if (!script) {
                script = document.createElement("script");
                script.type = "application/ld+json";
                script.id = id;
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(json);
        };

        // Title
        document.title = pageTitle;

        // Meta description and robots
        setOrCreateMetaByName("description", pageDescription);
        setOrCreateMetaByName("robots", "index,follow");

        // Canonical
        setOrCreateLinkCanonical(canonicalUrl);

        // Open Graph
        setOrCreateMetaByProperty("og:type", "website");
        setOrCreateMetaByProperty("og:site_name", "StudentsChoice");
        setOrCreateMetaByProperty("og:title", pageTitle);
        setOrCreateMetaByProperty("og:description", pageDescription);
        setOrCreateMetaByProperty("og:url", canonicalUrl);
        setOrCreateMetaByProperty("og:image", `${origin}/og.png`);

        // Twitter
        setOrCreateMetaByName("twitter:card", "summary_large_image");
        setOrCreateMetaByName("twitter:title", pageTitle);
        setOrCreateMetaByName("twitter:description", pageDescription);
        setOrCreateMetaByName("twitter:image", `${origin}/og.png`);
        setOrCreateMetaByName("twitter:image:alt", "StudentsChoice — discover and compare universities worldwide");

        // JSON-LD: CollectionPage for Universities
        setJsonLd("seo-jsonld-universities", {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Universities at StudentsChoice",
            "url": canonicalUrl,
            "description": pageDescription,
            "isPartOf": {
                "@type": "WebSite",
                "name": "StudentsChoice",
                "url": origin
            }
        });

        return undefined;
    }, []);

    const sortOptions = [
        { text: "Alphabetical", type: "alphabetical" },
        { text: "Highest Rating", type: "highestRating" },
        { text: "Lowest Rating", type: "lowestRating" }
    ];

    const displayOptions = [
        { image: Grid, type: "grid" },
        { image: List, type: "list" }
    ];


    const indexOfLastUniversity = currentPage * universitiesPerPage;
    const indexOfFirstUniversity = indexOfLastUniversity - universitiesPerPage;
    const currentUniversities = universities.slice(indexOfFirstUniversity, indexOfLastUniversity);
    const totalPages = Math.ceil(universities.length / universitiesPerPage);


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

    return (
        <div className="m-0 text-sc-red overflow-hidden bg-white dark:bg-gray-900">
            <PageHeading pageName="Universities" icon={GradCap} />

            <div className="primaryPageSizing">
                {!isPageTextLoading &&
                    <div className="titleTextSecondary">{universitiespageText?.data.attributes.searchTitle}</div>
                }

                <div className="flex-col sm:flex-row items-center">
                    <input
                        className="editInputStyling"
                        placeholder="Search university name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                        }}
                    />
                </div>

                <div className="items-center w-full">
                    <div className="titleTextSecondary">Search by location</div>
                    <AddContentSearch
                        className="w-full"
                        inputClassName="editInputStyling"
                    />
                </div>

                <div className="sm:w-full w-[90%] flex justify-center items-center ml-5">
                    <button
                        className="cursor-pointer inline-block bg-rose-900 hover:bg-rose-950 text-white font-bold py-3 px-20 rounded transition duration-300 w-full sm:w-auto mx-auto mt-7"
                        onClick={handleSearch}>
                        Search
                    </button>
                </div>


                <div className="flex flex-col sm:flex-row mt-[2.5rem] items-center sm:items-start justify-center sm:justify-between gap-4">
                    <div className="flex items-center">
                        <h2 className="hidden sm:block text-left text-3xl font-bold ml-2 text-sc dark:text-gray-300">Sort by</h2>
                        <div className="flex justify-center mx-auto">
                            <SelectButtonGroup
                                options={sortOptions}
                                selectedOption={sortOption}
                                onOptionChange={setSortOption}
                            />
                        </div>

                    </div>
                    <div>
                        <SelectButtonGroup
                            options={displayOptions}
                            selectedOption={displayOption}
                            onOptionChange={setDisplayOption}
                            buttonWidth={50}
                        />
                    </div>
                </div>

                <div className={`relative flex flex-col w-full h-full mt-5 ${displayOption === 'grid' ? 'grid sm:gap-5 gap-3 grid-cols-4' : 'gap-4'}`}>
                    {universities.length === 0 && !isPageTextLoading ? (
                        // Skeleton loading while universities are being fetched
                        [...Array(universitiesPerPage)].map((_, index) => (
                            <div key={index} className="animate-pulse h-[14vh] bg-gray-300 rounded-md dark:bg-gray-600 scale-[0.9]" />
                        ))
                    ) : (
                        currentUniversities.map((university) => (
                            <button
                                className={`relative w-auto ${displayOption === 'list' ? 'h-[10vh] dark:bg-gray-600' : 'h-[10vh] sm:h-[15vh]'} rounded-md bg-white dark:bg-gray-300 shadow-md sm:hover:shadow-xl transition duration-300`}
                                key={university.id}
                                onClick={() => handleClick(university.attributes?.slug || university.id)}
                            >
                                {displayOption === 'list' ? (
                                    <div className="flex items-center justify-between w-full h-full gap-4 px-4">
                                        {/* Logo */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            {/* Logo */}
                                            <div className="bg-gray-300 p-2.5 rounded-lg shadow-md">
                                                <div className="w-20 h-12 flex items-center justify-center">
                                                    <img
                                                        src={BASE_URL + university.attributes.universityLogo.data.attributes.formats.thumbnail.url}
                                                        className="w-full h-full object-contain"
                                                        alt={university.attributes.universityLogo.data.attributes.alternativeText}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between w-full gap-4">
                                                <p className="hidden sm:block text-2xl text-left font-bold truncate ml-5 dark:text-gray-200 w-[500px]">
                                                    {university.attributes.universityName}
                                                </p>
                                                {university.attributes.universityRating === 0 ?
                                                    <p className="sm:text-xl text-lg text-center font-bold truncate dark:text-gray-200 sm:w-[500px] w-[175px]">
                                                        No rating yet
                                                    </p> :
                                                <div className="flex-1 sm:h-4 h-3 sm:mr-5 ml-1 sm:ml-20 bg-gray-200 dark:bg-gray-900 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-sc-red rounded-full"
                                                        style={{
                                                            width: `${(university.attributes.universityRating / 5) * 100}%`,
                                                        }}
                                                    ></div>
                                                </div>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 text-lg sm:text-2xl font-bold dark:text-gray-200 justify-end sm:w-[60px] w-[45px]">
                                            <p>
                                                {university.attributes.universityRating === 0
                                                    ? '-'
                                                    : university.attributes.universityRating.toFixed(1)}
                                            </p>
                                            <img className="w-3 sm:w-4 h-3 sm:h-4 sm:ml-1 ml-0" src={StarYellow} alt="Star" />
                                        </div>
                                    </div>
                                ) : (
                                    // Grid View
                                    <div className="flex w-full h-full items-center justify-center p-5">
                                        <img
                                            src={BASE_URL + university.attributes.universityLogo.data.attributes.formats.thumbnail.url}
                                            alt={university.attributes.universityLogo.data.attributes.alternativeText}
                                            className="object-contain h-full w-full"
                                        />
                                        <div className="absolute bottom-0 right-0 flex items-center py-0 text-m font-bold dark:text-gray-600">
                                            <p>
                                                {university.attributes.universityRating === 0
                                                    ? "-"
                                                    : university.attributes.universityRating.toFixed(1)}
                                            </p>
                                            <img className="w-4 h-4 ml-1" src={StarYellow} alt="Star" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>

                {universities.length > 0 && <Pagination />}
            </div>

            <br />

            {showResults && (
                <div className="relative w-[95%] px-2 pb-1 mx-auto">
                    <div className="text-left text-2xl ml-2 mb-0 text-sc-red dark:text-gray-300 font-bold">Results</div>

                    <ul className={`relative flex flex-col w-full h-full ${displayOption === 'grid' ? 'sm:grid sm:grid-cols-4 2xl:grid-cols-6' : ''}`}>

                        {searchResult.slice(0, 6).map((university) => (
                            <div key={university.id}>
                                <button
                                    className={`w-full ${displayOption === 'list' ? 'h-[10vh]' : 'h-[15vh]'} rounded-md padding-[3%] bg-white dark:bg-gray-600 shadow-md scale-[0.9] sm:hover:shadow-xl transition duration-300`}
                                    onClick={() => handleClick(university.universitySlug || university.id)}
                                >
                                    <img
                                        src={BASE_URL + university.universityLogo.data.attributes.formats.thumbnail.url}
                                        alt={university.universityName}
                                        className={`cursor-pointer p-5 object-contain h-full w-full`}
                                    />
                                </button>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Universities;