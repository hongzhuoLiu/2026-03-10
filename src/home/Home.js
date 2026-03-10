import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../API";

import { useGetUploadedPictureByAltTextQuery } from "../app/service/uploadAPI";
import { useGetAllUniversityImagesQuery } from "../app/service/university-pagesAPI";
import { useSelector } from "react-redux";
import { useGetSearchResultsQuery } from "../app/service/any-pagesAPI";

import { useGetHomepageTextQuery } from "../app/service/homepageAPI";

import Recommended from "../components/Elements/Recommended";
import UniBox from "../components/Elements/UniBox";

function Home() {
    const { user } = useSelector((state) => state.auth);

    // Client-requested SEO title and description format
    const pageTitle = "Students Choice | Rate & Compare Universities | Global Student Community";
    const pageDescription = "Compare reviews across all aspects of student life. Global community for uni students. Blog, ask questions & find helpful resources. FREE TO USE. Click here for more.";

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user && user.interests) {
            console.log('User interests:', user.interests);
        }
    }, [user]);

    // Dynamic SEO injection for Home page
    useEffect(() => {
        const origin = window.location.origin;
        const canonicalUrl = `${origin}/`;

        // Helper functions for SEO meta tags
        const setOrCreateMetaByName = (name, content) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = name;
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        const setOrCreateMetaByProperty = (property, content) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.property = property;
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        const setOrCreateLinkCanonical = (href) => {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'canonical';
                document.head.appendChild(link);
            }
            link.href = href;
        };

        const setJsonLd = (id, data) => {
            let script = document.getElementById(id);
            if (script) {
                script.remove();
            }
            script = document.createElement('script');
            script.id = id;
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(data);
            document.head.appendChild(script);
        };

        // Set dynamic SEO tags
        document.title = pageTitle;
        setOrCreateMetaByName("description", pageDescription);
        setOrCreateMetaByName("robots", "index,follow");
        setOrCreateLinkCanonical(canonicalUrl);

        // Open Graph tags
        setOrCreateMetaByProperty("og:title", pageTitle);
        setOrCreateMetaByProperty("og:description", pageDescription);
        setOrCreateMetaByProperty("og:url", canonicalUrl);
        setOrCreateMetaByProperty("og:type", "website");
        setOrCreateMetaByProperty("og:site_name", "StudentsChoice");

        // Twitter Card tags
        setOrCreateMetaByName("twitter:card", "summary_large_image");
        setOrCreateMetaByName("twitter:title", pageTitle);
        setOrCreateMetaByName("twitter:description", pageDescription);

        // JSON-LD structured data
        setJsonLd("seo-jsonld-home", {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "StudentsChoice",
            "url": canonicalUrl,
            "description": pageDescription,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${canonicalUrl}search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            },
            "publisher": {
                "@type": "Organization",
                "name": "StudentsChoice",
                "url": canonicalUrl
            }
        });
    }, []);

    const { data: responseAtom, isLoading: loadingAtom } = useGetUploadedPictureByAltTextQuery("atomIcon");
    const { data: responseBook, isLoading: loadingBook } = useGetUploadedPictureByAltTextQuery("bookIcon");
    const { data: responseGradCap, isLoading: loadingGradCap } = useGetUploadedPictureByAltTextQuery("gradCapIcon");
    const { data: responseConfetti, isLoading: loadingConfetti } = useGetUploadedPictureByAltTextQuery("confetti");

    const { data: responseRankedLight, isLoading: loadingRankedLight } = useGetUploadedPictureByAltTextQuery("rankedLight");
    const { data: responseRankedDark, isLoading: loadingRankedDark } = useGetUploadedPictureByAltTextQuery("rankedDark");

    const { data: responseSparklesLight, isLoading: loadingSparklesLight } = useGetUploadedPictureByAltTextQuery("sparklesLight");
    const { data: responseSparklesDark, isLoading: loadingSparklesDark } = useGetUploadedPictureByAltTextQuery("sparklesDark");

    // Fetch university images
    const { data: responseUniversityImages, isLoading: loadingUniversityImages } = useGetAllUniversityImagesQuery();

    // Fetch homepage text
    const { data: homepageText, error, isLoading } = useGetHomepageTextQuery();

    // Skip logic: avoid fetching subjects and courses if the user doesn't exist or has no interests
    const skipQuery = !user || !user.interests?.length;

    // Fetch recommended subjects and courses based on user interests, but skip if no user or interests
    const { data: recommendedSubjects, isLoading: loadingSubjects } = useGetSearchResultsQuery(
        {
            pageType: "subject",
            interests: user ? user.interests : [],
        },
        { skip: skipQuery }
    );
    const { data: recommendedCourses, isLoading: loadingCourses } = useGetSearchResultsQuery(
        {
            pageType: "course",
            interests: user ? user.interests : [],
        },
        { skip: skipQuery }
    );


    const navigate = useNavigate();

    const handleClick = (slugOrId) => {
        navigate(`/universities/${slugOrId}`);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading data</div>;
    }

    return (
        <div className="w-screen bg-white dark:bg-gray-900">
            <div className="flex h-full">
                {!loadingConfetti ? (
                    <img className="hidden lg:block h-full w-[20%] my-auto"
                        src={`${BASE_URL}${responseConfetti[0].formats.large.url}`}
                        alt={responseConfetti[0].alternativeText}
                    />
                ) : (
                    <div
                        className="hidden sm:block h-full w-[20%] my-auto bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
                )}

                <div className="hidden lg:flex h-screen w-[15%] flex-col justify-center mt-[-1%]">
                    {!loadingUniversityImages ? (
                        responseUniversityImages.data.slice(0, 5).map((uni, index) => (
                            <Pill key={index}
                                index={index}
                                image={`${BASE_URL}${uni.attributes.universityLogo.data.attributes.formats.thumbnail.url}`}
                                onClick={() => handleClick(uni.attributes?.slug || uni.id)}
                            />
                        ))
                    ) : (
                        [1, 2, 3, 4, 5].map((_, index) => (
                            <Pill key={index}
                                index={index}
                                isLoading={true}
                            />
                        ))
                    )}
                </div>

                <div className="w-full sm:px-4 lg:px-0 lg:ml-[-7%] lg:w-[70%] mx-auto text-center">
                    <h1 className="text-sc-red dark:text-gray-200 font-bold text-4xl sm:text-6xl mt-4">
                        {homepageText.data.attributes.welcomeText}
                    </h1>
                    <h2 className="text-gray-700 dark:text-gray-300 text-xl sm:text-2xl font-bold">
                        {homepageText.data.attributes.shortSlogan}
                    </h2>
                    <h3 className="text-gray-700 dark:text-gray-400 text-lg sm:text-xl px-1">
                        {homepageText.data.attributes.longSlogan}
                    </h3>
                    {/* Buttons */}
                    <div className="flex justify-between mt-0 sm:my-5 mx-2">
                        <Link className="w-[32%]" to="/universities">
                            {!loadingGradCap ? (
                                <Button
                                    image={`${BASE_URL}${responseGradCap[0].formats.thumbnail.url}`}
                                    altText={responseGradCap[0].alternativeText}
                                    text={responseGradCap[0].caption}
                                    phText={"Universities"}
                                />
                            ) : (
                                <Button
                                    isLoading={loadingGradCap}
                                />
                            )}
                        </Link>
                        <Link className="w-[32%]" to="/programs">
                            {!loadingBook ? (
                                <Button
                                    image={`${BASE_URL}${responseBook[0].formats.thumbnail.url}`}
                                    altText={responseBook[0].alternativeText}
                                    text={responseBook[0].caption}
                                    phText={"Programs"}
                                />
                            ) : (
                                <Button
                                    isLoading={loadingGradCap}
                                />)}
                        </Link>
                        <Link className="w-[32%]" to="/subjects">
                            {!loadingAtom ? (
                                <Button
                                    image={`${BASE_URL}${responseAtom[0].formats.thumbnail.url}`}
                                    altText={responseAtom[0].alternativeText}
                                    text={responseAtom[0].caption}
                                    phText={"Subjects"}
                                />
                            ) : (
                                <Button
                                    isLoading={loadingGradCap}
                                />
                            )}
                        </Link>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start w-full mx-auto mb-2">
                        <h1 className="text-3xl font-bold ml-2 sm:ml-0 text-rose-900 dark:text-gray-300 mt-5">
                            {homepageText.data.attributes.topRanked}</h1>
                        {!loadingRankedLight ? (
                            <img
                                src={`${BASE_URL}${responseRankedLight[0].formats.thumbnail.url}`}
                                className="w-[30px] ml-2 mt-5 block dark:hidden"
                                alt={responseRankedLight[0].alternativeText}
                            />
                        ) : (
                            <div
                                className="w-[30px] h-[30px] ml-2 mt-5 bg-gray-300 dark:bg-gray-600 animate-pulse block dark:hidden">
                                <div
                                    className="w-[30px] h-[30px] ml-2 mt-5 bg-gray-300 dark:bg-gray-600 animate-pulse hidden light:flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path
                                            d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                        {!loadingRankedDark ? (
                            <img
                                src={`${BASE_URL}${responseRankedDark[0].formats.thumbnail.url}`}
                                className="w-[30px] ml-2 mt-5 hidden dark:block"
                                alt={responseRankedDark[0].alternativeText}
                            />
                        ) : (
                            <div
                                className="w-[30px] h-[30px] ml-2 mt-5 bg-gray-300 dark:bg-gray-600 animate-pulse hidden dark:flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path
                                        d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div
                        className="grid grid-cols-1 sm:grid-cols-4 grid-rows-4 sm:grid-rows-2 gap-2 sm:h-[35%] w-full px-2 sm:px-0">
                        {!loadingUniversityImages ? (
                            responseUniversityImages.data.slice(0, 6).map((uni, index) => (
                                index === 0 ? (
                                    <div key={index} className="sm:row-span-2">
                                        <UniBox
                                            uniName={uni.attributes.universityName}
                                            image={`${BASE_URL}${uni.attributes.universityLogo.data.attributes.formats.thumbnail.url}`}
                                            uniImage={`${BASE_URL}${uni.attributes.universityHeaderImage.data.attributes.formats.small.url}`}
                                            rating={uni.attributes.universityRating}
                                            position={index + 1}
                                            onClick={() => handleClick(uni.attributes?.slug || uni.id)}
                                        />
                                    </div>
                                ) : index === 1 ? (
                                    <div key={index} className="sm:col-span-2">
                                        <UniBox
                                            uniName={uni.attributes.universityName}
                                            image={`${BASE_URL}${uni.attributes.universityLogo.data.attributes.formats.thumbnail.url}`}
                                            uniImage={`${BASE_URL}${uni.attributes.universityHeaderImage.data.attributes.formats.small.url}`}
                                            rating={uni.attributes.universityRating}
                                            position={index + 1}
                                            onClick={() => handleClick(uni.attributes?.slug || uni.id)}
                                        />
                                    </div>
                                ) : index === 5 ? (
                                    <UniBox
                                        key={index}
                                        uniName={uni.attributes.universityName}
                                        image={`${BASE_URL}${uni.attributes.universityLogo.data.attributes.formats.thumbnail.url}`}
                                        uniImage={`${BASE_URL}${uni.attributes.universityHeaderImage.data.attributes.formats.small.url}`}
                                        rating={uni.attributes.universityRating}
                                        position={index + 1}
                                        onClick={() => handleClick(uni.attributes?.slug || uni.id)}
                                        advertisement
                                    />
                                ) : (
                                    <UniBox
                                        key={index}
                                        uniName={uni.attributes.universityName}
                                        image={`${BASE_URL}${uni.attributes.universityLogo.data.attributes.formats.thumbnail.url}`}
                                        uniImage={`${BASE_URL}${uni.attributes.universityHeaderImage.data.attributes.formats.small.url}`}
                                        rating={uni.attributes.universityRating}
                                        position={index + 1}
                                        onClick={() => handleClick(uni.attributes?.slug || uni.id)}
                                    />
                                )
                            ))
                        ) : (
                            [1, 2, 3, 4, 5, 6].map((_, index) => (
                                index === 0 ? (
                                    <div key={index} className="sm:row-span-2">
                                        <UniBox
                                            position={index + 1}
                                            isLoading={loadingUniversityImages}
                                        />
                                    </div>
                                ) : index === 1 ? (
                                    <div key={index} className="sm:col-span-2">
                                        <UniBox
                                            position={index + 1}
                                            isLoading={loadingUniversityImages} />
                                    </div>
                                ) : (
                                    <UniBox
                                        key={index}
                                        position={index + 1}
                                        isLoading={loadingUniversityImages}
                                    />
                                )
                            ))
                        )}
                    </div>

                    {user && (
                        <div>

                            <div className="flex items-center justify-center sm:justify-start w-full">
                                <h1 className="text-3xl font-bold ml-2 sm:ml-0 text-rose-900 dark:text-gray-300 mt-5">Featured for {user.username}</h1>
                                {!loadingSparklesLight ? (
                                    <img
                                        src={`${BASE_URL}${responseSparklesLight[0].formats.thumbnail.url}`}
                                        className="w-[30px] ml-2 mt-5 block dark:hidden"
                                        alt={responseSparklesLight[0].alternativeText}
                                    />
                                ) : (
                                    <div
                                        className="w-[30px] h-[30px] ml-2 mt-5 bg-gray-300 dark:bg-gray-600 animate-pulse block dark:hidden">
                                        <div
                                            className="w-[30px] h-[30px] ml-2 mt-5 bg-gray-300 dark:bg-gray-600 animate-pulse hidden light:flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                <path
                                                    d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                                {!loadingSparklesDark ? (
                                    <img
                                        src={`${BASE_URL}${responseSparklesDark[0].formats.thumbnail.url}`}
                                        className="w-[30px] ml-2 mt-5 hidden dark:block"
                                        alt={responseSparklesDark[0].alternativeText}
                                    />
                                ) : (
                                    <div
                                        className="w-[30px] h-[30px] ml-2 mt-5 bg-gray-300 dark:bg-gray-600 animate-pulse hidden dark:flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path
                                                d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                        </svg>
                                    </div>
                                )}

                            </div>


                            {/* Featured for User */}
                            {user && (
                                <div>

                                    {/* Recommended Subjects */}
                                    <div className="flex gap-x-4 pt-2 pb-5 pr-4 pl-1 overflow-x-auto no-scrollbar">
                                        {!loadingSubjects &&
                                            recommendedSubjects?.data.slice(0, 10).map((subject, index) => {
                                                const uniId = subject.attributes.university_page.data.id; // Fetch university ID
                                                const subId = subject.id; // Fetch subject ID
                                                return (
                                                    <Recommended
                                                        key={index}
                                                        type={1}
                                                        text={subject.attributes.subjectName}
                                                        click={`/universities/${uniId}/subject/${subId}`} // Pass the URL string directly
                                                    />
                                                );
                                            })}
                                    </div>

                                    {/* Recommended Courses */}
                                    <div className="flex gap-x-4 pt-2 pb-5 pr-4 pl-1 overflow-x-auto no-scrollbar">
                                        {!loadingCourses &&
                                            recommendedCourses?.data.slice(0, 10).map((course, index) => {
                                                const uniId = course.attributes.university_page.data.id; // Fetch university ID
                                                const uniSlug = course.attributes.university_page.data.attributes?.slug; // Fetch university slug
                                                const courseId = course.id; // Fetch course ID
                                                const courseSlug = course.attributes?.slug; // Fetch course slug
                                                return (
                                                    <Recommended
                                                        key={index}
                                                        type={2}
                                                        text={course.attributes.courseName}
                                                        click={`/universities/${uniSlug || uniId}/subject/${courseSlug || courseId}`} // Use slug if available, fallback to id
                                                    />
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}

function Pill({ index, image, onClick, isLoading }) {
    let top;
    let left;

    switch (index) {
        case 0:
            top = -10;
            left = -100;
            break;
        case 1:
            top = -5;
            left = -75;
            break;
        case 2:
            left = -65;
            break;
        case 3:
            top = 5;
            left = -75;
            break;
        case 4:
            top = 10;
            left = -100;
            break;
        default:
            break;
    }

    const style = {
        transform: `rotate(${-30 + (index * 15)}deg)`,
        position: 'relative',
        top: top ? `${top}%` : undefined,
        left: left ? `${left}%` : undefined
    };

    if (isLoading) {
        return (
            <div
                className="bg-gray-300 dark:bg-gray-600 w-full h-[10%] rounded-lg animate-pulse flex items-center justify-center"
                style={style}>
                <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path
                        d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
            </div>
        );
    }

    return (
        <div
            className="bg-white dark:bg-gray-300 shadow-md rounded-lg p-[2%] w-full h-[10%] cursor-pointer sm:hover:shadow-xl transition duration-300ms"
            style={style} onClick={onClick}>
            <img className="h-full w-fill object-contain" src={image} alt="Uni logo" />
        </div>
    );
}


function Button({ image, altText, text, phText, isLoading }) {
    if (isLoading) {
        return (
            <div
                className="w-full h-12 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse flex items-center justify-between px-4">
                <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path
                        d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
                    />
                </svg>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-48"></div>
            </div>

        );
    }

    return (
        <div>
            <div className="hidden sm:flex sm:w-full w-11/12 h-12 sm:h-12 bg-white dark:bg-gray-600  justify-between 
                items-center shadow-md rounded-md pr-3 ml-auto mr-auto sm:mb-0 mb-3 sm:hover:shadow-xl transition duration-300">
                <img className="h-[70%] w-1/5 object-contain" src={image} alt={altText} />
                <h1 className="w-4/5 text-gray-700 dark:text-gray-200 font-semibold text-lg sm:text-[12px] leading-[14px]">{text}</h1>
            </div>

            <div className="p-2 sm:hidden flex flex-col w-11/12 h-22 bg-white dark:bg-gray-600  justify-between 
                items-center shadow-md rounded-md ml-auto mr-auto sm:mb-0 mb-3 sm:hover:shadow-xl transition duration-300">
                <img className="h-10 object-contain" src={image} alt={altText} />
                <h1 className="text-gray-700 dark:text-gray-200 font-semibold text-lg">{phText}</h1>
            </div>

        </div>

    );
}

export default Home