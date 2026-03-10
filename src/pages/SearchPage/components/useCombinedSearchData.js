import { useEffect, useState } from "react";
import { useGetAllUniversitiesQuery } from "../../../app/service/university-pagesAPI";
import { useGetSearchResultsQuery } from "../../../app/service/any-pagesAPI";
import { BASE_URL } from "../../../API";
import abbreviationMap from "./abbreviationMap";
import { useGetDestinationsQuery } from "../../../app/service/destinationsAPI";
import { useGetFacilitiesQuery } from "../../../app/service/facilitiesApi";
import UNI_LOGO from "../../../images/icons/graduation.png"; // Default logo for universities

// ---- LOGO helpers & default ----
const DEFAULT_UNI_LOGO = UNI_LOGO;

// If it's a relative path (/uploads/...) → concat with BASE_URL; absolute path (http/https) → return as is
const toAbsolute = (maybeUrl) => {
  if (!maybeUrl) return null;
  return /^https?:\/\//i.test(maybeUrl) ? maybeUrl : `${BASE_URL}${maybeUrl}`;
};

// Select an available URL from Strapi media attributes by priority
const pickMediaUrl = (attr) => {
  if (!attr) return null;
  // 1) thumbnail
  if (attr.formats?.thumbnail?.url) return attr.formats.thumbnail.url;
  // 2) other common sizes
  for (const s of ["small", "medium", "large"]) {
    if (attr.formats?.[s]?.url) return attr.formats[s].url;
  }
  // 3) original url
  return attr.url || null;
};

export default function useCombinedSearchData() {
  const { data: universitiesData, isLoading: universitiesLoading, error: universitiesError } =
    useGetAllUniversitiesQuery();

  const { data: programsData, isLoading: programsLoading, error: programsError } =
    useGetSearchResultsQuery({
      pageType: "program",
      fieldComponentName: "program_field_component",
      graduationLevelField: "programGraduationLevel",
    });

  const { data: facilitiesData, isLoading: facilitiesLoading, error: facilitiesError } =
    useGetFacilitiesQuery();

  const { data: destinationsData, isLoading: destinationsLoading, error: destinationsError } =
    useGetDestinationsQuery();

  const [allPosts, setAllPosts] = useState({ reviews: [], blogs: [], qnas: [] });

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const [universityPostRes, programPostRes] = await Promise.all([
          fetch(
            `${BASE_URL}/api/university-pages?pagination[pageSize]=100&populate[reviews][populate]=*&populate[blogs][populate]=*&populate[qnas][populate]=*`
          ),
          fetch(
            `${BASE_URL}/api/program-pages?pagination[pageSize]=100&populate[reviews][populate]=*&populate[blogs][populate]=*&populate[qnas][populate]=*`
          ),
        ]);
        const [universityPostData, programPostData] = await Promise.all([
          universityPostRes.json(),
          programPostRes.json(),
        ]);

        const allReviews = [],
          allBlogs = [],
          allQnas = [];

        const extractPosts = (page) => {
          const attrs = page.attributes || {};
          if (attrs.reviews?.data) allReviews.push(...attrs.reviews.data);
          if (attrs.blogs?.data) allBlogs.push(...attrs.blogs.data);
          if (attrs.qnas?.data) allQnas.push(...attrs.qnas.data);
        };

        universityPostData.data?.forEach(extractPosts);
        programPostData.data?.forEach(extractPosts);

        setAllPosts({ reviews: allReviews, blogs: allBlogs, qnas: allQnas });
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    if (!universitiesLoading && !programsLoading && universitiesData && programsData) {
      fetchAllPosts();
    }
  }, [universitiesData, programsData, universitiesLoading, programsLoading]);

  // ---------- Format data ----------

  // 1) Universities
  const universityResults =
    universitiesData?.data?.map((university) => {
      const attrs = university.attributes || {};
      const uniName = attrs.universityName;

      // These two lines must be inside the map callback!
      const uniLogoAttr = attrs.universityLogo?.data?.attributes;
      const rawLogoUrl = pickMediaUrl(uniLogoAttr);

      return {
        id: university.id,
        type: "university",
        name: uniName,
        description: attrs.universityDescription || "No description available",
        location: attrs.universityLocation || "Location not specified",
        tags: attrs.universityTags || [],
        rating: attrs.universityRating || 0,
        logo: toAbsolute(rawLogoUrl) || DEFAULT_UNI_LOGO,
        website: attrs.universityWebsite || "#",
        altNames: abbreviationMap[uniName] || [],
      };
    }) || [];

  // 2) Programs (reuse the logo from associated university)
  const programResults =
    programsData?.data?.map((program) => {
      const attrs = program.attributes || {};
      const universityId = attrs.university_page?.data?.id;
      const universityName = attrs.university_page?.data?.attributes?.universityName || "Unknown University";

      return {
        id: program.id,
        type: "program",
        name: attrs.programName,
        university: universityName,
        description: attrs.programDescription || "No description available",
        duration: attrs.programGraduationLevel || "Not specified",
        tags: attrs.program_field_component?.data?.attributes?.programFieldName
          ? [attrs.program_field_component.data.attributes.programFieldName]
          : [],
        rating: attrs.programRating || 0,
        acronym: attrs.programAcronym || "",
        website: attrs.webpage || "#",
        universityId,
        logo: universityResults?.find((u) => u.id === universityId)?.logo || DEFAULT_UNI_LOGO,
      };
    }) || [];

  // 3) Facilities → Helpful Links (use default image to avoid <img src={null}>)
  const accommodationResults =
    facilitiesData?.data?.map((f) => ({
      id: f.id,
      type: "helpful-links",
      name: f.facilityName,
      description: f.facilityDescription || "No description available",
      location: f.facilityLocation || "Location not specified",
      rating: f.facilityRating || 0,
      logo: DEFAULT_UNI_LOGO,
      link: f.facilityLinks || "",
      facilityType: f.facilityType || "",
      universityName: f.universityPageTitle || "",
      universityId: f.universityPageId || null,
    })) || [];

  // 4) Destinations
  const destinationResults =
    destinationsData?.data?.map((d) => {
      const rawLogo = d.destinationLogo || d.destinationHeaderImage || null;
      return {
        id: d.id,
        type: "destination",
        name: d.destinationName,
        description: d.destinationDescription || "No description available",
        location: d.destinationLocation || "Location not specified",
        rating: d.destinationRating || 0,
        logo: toAbsolute(rawLogo) || DEFAULT_UNI_LOGO,
        headerImage: d.destinationHeaderImage ? toAbsolute(d.destinationHeaderImage) : null,
        webpageName: d.webpageName || "",
        webpage: d.webpage || "#",
        altNames: [],
      };
    }) || [];

  // 5) Posts (review / blog / qna: reuse university logo)
  const reviewResults = allPosts.reviews.map((review) => {
    const attrs = review.attributes || {};
    const universityId =
      attrs.university_page?.data?.id ||
      attrs.program_page?.data?.attributes?.university_page?.data?.id;

    const universityName =
      attrs.university_page?.data?.attributes?.universityName ||
      attrs.program_page?.data?.attributes?.university_page?.data?.attributes?.universityName ||
      "Unknown University";

    return {
      id: review.id,
      type: "post",
      postType: "review",
      title: (attrs.reviewText?.substring(0, 50) || "No title") + "...",
      author: attrs.users_permissions_user?.data?.attributes?.username || "Anonymous",
      date: attrs.createdAt,
      preview: attrs.reviewText || "No content",
      likes: attrs.reviewLikes || 0,
      comments: attrs.comments?.data?.length || 0,
      universityId,
      universityName,
      logo: universityResults?.find((u) => u.id === universityId)?.logo || DEFAULT_UNI_LOGO,
    };
  });

  const blogResults = allPosts.blogs.map((blog) => {
    const attrs = blog.attributes || {};
    const universityId =
      attrs.university_page?.data?.id ||
      attrs.program_page?.data?.attributes?.university_page?.data?.id;

    const universityName =
      attrs.university_page?.data?.attributes?.universityName ||
      attrs.program_page?.data?.attributes?.university_page?.data?.attributes?.universityName ||
      "Unknown University";

    return {
      id: blog.id,
      type: "post",
      postType: "blog",
      title: (attrs.blogText?.substring(0, 50) || "No title") + "...",
      author: attrs.users_permissions_user?.data?.attributes?.username || "Anonymous",
      date: attrs.createdAt,
      preview: attrs.blogText || "No content",
      likes: attrs.blogLikes || 0,
      comments: attrs.comments?.data?.length || 0,
      universityId,
      universityName,
      logo: universityResults?.find((u) => u.id === universityId)?.logo || DEFAULT_UNI_LOGO,
    };
  });

  const qnaResults = allPosts.qnas.map((qna) => {
    const attrs = qna.attributes || {};
    const universityId =
      attrs.university_page?.data?.id ||
      attrs.program_page?.data?.attributes?.university_page?.data?.id;

    const universityName =
      attrs.university_page?.data?.attributes?.universityName ||
      attrs.program_page?.data?.attributes?.university_page?.data?.attributes?.universityName ||
      "Unknown University";

    return {
      id: qna.id,
      type: "post",
      postType: "qna",
      title: (attrs.qnaText?.substring(0, 50) || "No title") + "...",
      author: attrs.users_permissions_user?.data?.attributes?.username || "Anonymous",
      avatar:
        toAbsolute(attrs.users_permissions_user?.data?.attributes?.avatar?.data?.attributes?.url) ||
        "https://backend-dev.studentschoice.blog/uploads/Default_Profile_Photo_3220d06254.jpg",
      date: attrs.createdAt,
      preview: attrs.qnaText || "No content",
      likes: attrs.qnaLikes || 0,
      comments: attrs.comments?.data?.length || 0,
      universityId,
      universityName,
      logo: universityResults?.find((u) => u.id === universityId)?.logo || DEFAULT_UNI_LOGO,
    };
  });

  // 合并
  const allResults = [
    ...universityResults,
    ...programResults,
    ...reviewResults,
    ...blogResults,
    ...qnaResults,
    ...destinationResults,
    ...accommodationResults,
  ];

  return {
    allResults,
    universitiesLoading,
    programsLoading,
    universitiesError,
    programsError,
    facilitiesLoading,
    facilitiesError,
    destinationsLoading,
    destinationsError,
  };
}