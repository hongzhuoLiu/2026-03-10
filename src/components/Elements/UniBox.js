import { BASE_URL } from "../../API";
import { useGetUploadedPictureByAltTextQuery } from "../../app/service/uploadAPI";

function UniBox({ image, uniName, uniImage, position, rating = "Not rated", onClick, isLoading, advertisement}) {
    const { data: responseStar, isLoading: loadingStar } = useGetUploadedPictureByAltTextQuery("starIcon");

    if (isLoading) {
        return (
            <div
                className="w-full h-[20vh] sm:h-full bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path
                        d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                </svg>
            </div>
        );
    }

    return (
        <div
            className="w-full h-[20vh] sm:h-full bg-white rounded-md shadow-md transition-transform duration-300 relative bg-cover bg-center cursor-pointer z-0 sm:hover:z-10 sm:hover:scale-105 sm:hover:-rotate-3 sm:hover:bg-black sm:hover:bg-opacity-60"
            onClick={onClick}
            style={{ backgroundImage: `url(${uniImage})` }}
            onMouseEnter={(e) => {
                e.currentTarget.style.zIndex = 30;
            }}
            onMouseLeave={(e) => {
                const target = e.currentTarget;
                setTimeout(() => {
                if (target) {
                    target.style.zIndex = 0;
                }
                }, 300); // Delay to match the animation duration (300ms)
            }}
        >
            {/* Gradient Overlay */}
            <div 
                className="absolute inset-0 rounded-md block dark:hidden" 
                style={{
                    background: "linear-gradient(to bottom, rgba(250, 250, 250, 1), rgba(250, 250, 250, 0) 90%), linear-gradient(to top, rgba(64, 64, 64, 1), rgba(64, 64, 64, 0) 20%)"
                }}
            ></div>

            <div 
                className="absolute inset-0 rounded-md hidden dark:block" 
                style={{
                    background: "linear-gradient(to bottom, rgba(207, 207, 207, 1), rgba(207, 207, 207, 0) 90%), linear-gradient(to top, rgba(64, 64, 64, 1), rgba(64, 64, 64, 0) 20%)"
                }}
            ></div>
    
            <div className="relative flex justify-center h-2/5 w-4/5 m-auto">
                <img src={image} alt={uniName + ' Logo'} className="w-full h-4/5 object-contain pt-2"/>    
            </div>

            {/* Position  */}
            {!advertisement && (
                <div className="absolute bottom-0 left-0 flex items-center p-1">
                    <p className="mr-1 font-bold text-white text-2xl">#{position}</p>
                </div>
            )}
            
            {/* Star rating */}
            {!advertisement && (
                <div className="absolute bottom-0 right-0 flex items-center p-1">
                    <p className="mr-1 font-bold text-white text-xl">{rating}</p>
                    {!loadingStar ? (
                        <img
                            src={`${BASE_URL}${responseStar[0].formats.thumbnail.url}`}
                            alt={responseStar[0].alternativeText}
                            className="w-6 h-6"
                        />
                    ) : (
                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    )}
                </div>
            )}

            {/* Sponsored text */}
            {/* {advertisement && (
                <div className="absolute bottom-0 right-0 h-6 w-24 bg-white rounded-br-md rounded-tl-md">
                    <p>Sponsored</p>
                </div>
            )} */}
        </div>
    );
}

export default UniBox;