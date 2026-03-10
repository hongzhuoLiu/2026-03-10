import { useEffect } from "react";
import FieldsSelection from "../../components/ProgramsAndSubjectsLoad/FieldsSelection";
import GraduationLevelSelection from "../../components/ProgramsAndSubjectsLoad/GraduationLevelSelection";
import UniversitiesSelection from "../../components/ProgramsAndSubjectsLoad/UniversitiesSelection";
import ShowResults from "../../components/ProgramsAndSubjectsLoad/ShowResults";
import Atom from "../../images/icons/atomicCol.png";
import PageHeading from "../../components/Elements/PageHeading";
import {setDefaultSelected} from "../../app/features/filteringSubjectsAndPrograms/filteringSubjectsAndProgramsReducer";
import {useDispatch} from "react-redux";
import PlaceSearchBox from "../../components/PlaceSearchBox/PlaceSearchBox";

function Programs() {
    const dispatch = useDispatch();
    dispatch(setDefaultSelected());

    useEffect(() => {
        const pageTitle = "Explore Programs Worldwide | Compare Academic Programs | StudentsChoice";
        const pageDescription = " Explore, filter and compare university programs by field, leve & location. Access reviews, insights and resources from real students.";
        const origin = window.location.origin;
        const canonicalUrl = `${origin}/programs`;

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
        setOrCreateMetaByName("twitter:image:alt", "StudentsChoice — discover and compare universities and programs");

        // JSON-LD: CollectionPage for Programs
        setJsonLd("seo-jsonld-programs", {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Programs at StudentsChoice",
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
        <>
            <PageHeading pageName={"Programs"} icon={Atom}/>

            <FieldsSelection pageType={"program"}/>

            <GraduationLevelSelection/>

            <UniversitiesSelection/>
            
            <PlaceSearchBox />

            <ShowResults pageType={"program"}/>
        </>
    )
}

export default Programs;