import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { useGetDestinationsQuery } from '../../app/service/destinationsAPI';
import GradCap from '../../images/icons/locationPin.png';
import GradCapWhite from '../../images/icons/locationPin_white.png';
import SelectButtonGroup from '../../components/Elements/SelectButtonGroup';
import Grid from '../../images/icons/Grid.png';
import List from '../../images/icons/List.png';
import StarYellow from '../../images/icons/StarYellowFill.png';
import { BASE_URL } from '../../API';

function Destinations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('alphabetical');
  const [displayOption, setDisplayOption] = useState('grid');
  const { data: destinationData, isLoading } = useGetDestinationsQuery();
  const navigate = useNavigate();

  const sortOptions = [
    { text: 'Alphabetical', type: 'alphabetical' },
    { text: 'Highest rating', type: 'HighestRating' },
    { text: 'Lowest rating', type: 'LowestRating' },
  ];

  const displayOptions = [
    { image: Grid, type: 'grid' },
    { image: List, type: 'list' },
  ];

  const filteredAndSorted = useMemo(() => {
    if (!destinationData?.data) return [];

    const filtered = destinationData.data.filter((d) => {
      const name = d.destinationName?.toLowerCase() || '';
      const location = d.destinationLocation?.toLowerCase() || '';
      return name.includes(searchQuery.toLowerCase()) || location.includes(searchQuery.toLowerCase());
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'alphabetical') {
        return a.destinationName.localeCompare(b.destinationName);
      } else if (sortOption === 'HighestRating') {
        return (b.destinationRating || 0) - (a.destinationRating || 0);
      } else {
        return (a.destinationRating || 0) - (b.destinationRating || 0);
      }
    });

    return sorted;
  }, [destinationData, searchQuery, sortOption]);

  const handleClick = (id) => navigate(`/destination/${id}`);

  // Dynamic SEO injection for Destinations page
  useEffect(() => {
    const pageTitle = "Explore destinations for studying abroad worldwide | Students Choice";
    const pageDescription = "Discover the best study abroad destinations worldwide. Compare countries, cities, and regions for international education opportunities. Find your perfect study destination with detailed ratings and reviews.";
    const origin = window.location.origin;
    const canonicalUrl = `${origin}/destinations`;

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
        script.id = id;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(json);
    };

    // Title
    document.title = pageTitle;

    // Meta description and robots
    setOrCreateMetaByName("description", pageDescription);
    setOrCreateMetaByName("keywords", "study abroad destinations, international education, study overseas, global universities, study abroad countries, international students");
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
    setOrCreateMetaByName("twitter:image:alt", "StudentsChoice — discover study abroad destinations");

    // JSON-LD: CollectionPage for Destinations
    setJsonLd("seo-jsonld-destinations", {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Study Abroad Destinations at StudentsChoice",
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

  return (
    <div className="m-0 text-sc-red overflow-hidden bg-white dark:bg-gray-900">
      <div className="flex justify-center sm:justify-start mt-2">
        <h1 className="titleTextPrimary">Destinations</h1>
        <img className="h-[50px] sm:h-[60px] ml-3 block dark:hidden" src={GradCap} alt="Icon" />
        <img className="h-[50px] sm:h-[60px] ml-3 hidden dark:block" src={GradCapWhite} alt="Icon" />
      </div>

      <div className="primaryPageSizing">
        {/* Serach section */}
        <div className="flex flex-col w-full mt-8">
          <span className="titleTextSecondary text-left text-xl font-semibold mb-2">Search for destinations</span>
          <input
            className="editInputStyling"
            placeholder="Search for country, state or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Display Sort by */}
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
        
        {/* Display destinations */}
        <div className={`mt-5 ${displayOption === 'grid' ? 'sm:grid sm:grid-cols-4 gap-5 2xl:grid-cols-6' : 'flex flex-col items-center gap-4'}`}>
          {(isLoading ? Array.from({ length: 12 }) : filteredAndSorted).map((destination, index) => (
            <button
              key={destination?.id || index}
              onClick={() => destination?.id && handleClick(destination.id)}
              className={`relative ${displayOption === 'list' ? 'w-full h-[10vh] grid items-center grid-cols-[2.5fr,2fr,1fr]' : 'w-full h-[25vh] aspect-square'} bg-gray-100 dark:bg-gray-600 rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden`}
            >
              {destination?.destinationName ? (
                <>
                  {displayOption === 'list' ? (
                    <>
                      {/* Name column - left */}
                      <div className="flex flex-col items-start justify-left gap-1 ml-2">
                        <span className="font-bold text-xl sm:text-xl justify-center dark:text-gray-200 truncate" style={{ maxWidth: '90%' }}>
                          {destination.destinationName == 'Australian Capital Territory' ? 'ACT' : destination.destinationName}
                        </span>
                        {destination.destinationLocation != destination.destinationName && (<span className="text-base sm:text-base dark:text-gray-300 truncate" style={{ maxWidth: '100%' }}>
                          {destination.destinationLocation}
                        </span>)}

                      </div>
                      {/* Healthbar-like rating column - center */}
                      <div className="items-center justify-center [scale:0.8] sm:flex">
                        <div className="sm:w-3/4 h-4 sm:flex sm:h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-900 dark:bg-rose-900 rounded-full"
                            style={{
                              width: `${(destination.destinationRating / 5) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      {/* Rating number and star column - right */}
                      <div className="flex items-center justify-end gap-1 mr-2">
                        <span className="font-bold text-xl sm:text-xl dark:text-gray-200">
                          {destination.destinationRating == null || destination.destinationRating === 0
                            ? "-"
                            : Number.isInteger(destination.destinationRating)
                              ? destination.destinationRating
                              : destination.destinationRating.toFixed(1)}
                        </span>
                        <img className="w-[2vh] h-[2vh]" src={StarYellow} alt="Star" />
                      </div>
                      {/* Name column - left */}
                      {/* <div className="flex flex-col items-start ml-2">
                        <span className="font-bold text-xl dark:text-gray-200 truncate">{destination.destinationName}</span>
                        {destination.destinationLocation !== destination.destinationName && (
                          <span className="text-base dark:text-gray-300 truncate">{destination.destinationLocation}</span>
                        )}
                      </div> */}
                      {/* Healthbar-like rating column - center */}
                      {/* <div className="sm:flex items-center justify-center hidden">
                        <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-900 rounded-full" style={{ width: `${(destination.destinationRating / 5) * 100}%` }} />
                        </div>
                      </div> */}
                      {/* Rating number and star column - right */}
                      {/* <div className="flex items-center justify-end gap-1 mr-2">
                        <span className="font-bold text-xl dark:text-gray-200">
                          {destination.destinationRating?.toFixed(1) ?? '-'}
                        </span>
                        <img className="w-[2vh] h-[2vh]" src={StarYellow} alt="Star" />
                      </div> */}
                    </>
                  ) : (
                    <>
                      <div className="absolute w-[25vh] top-4 left-1/2 pr-4 -translate-x-1/2 z-10 bg-black/60 text-white px-3 py-1 rounded-2xl font-bold flex items-center justify-center gap-1">
                        <img className="h-[2vh]" src={GradCapWhite} alt="Icon" />
                        <span>{destination.destinationName}</span>
                      </div>
                      <div className="absolute bottom-0 right-0 -translate-x-1/2 z-10 bg-black/60 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1">
                        <span>{destination.destinationRating?.toFixed(1) ?? '-'}</span>
                        <img className="w-4 h-4" src={StarYellow} alt="Star" />
                      </div>
                      <img src={BASE_URL + destination.destinationLogo} alt={destination.destinationName} className="absolute inset-0 w-full h-full object-cover" />
                    </>
                  )}
                </>
              ) : (
                <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-full w-full rounded-md" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Destinations;
