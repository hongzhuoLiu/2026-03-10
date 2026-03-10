// Small helpers
const normalize = (s) => (s ?? "").toString().toLowerCase().trim();

const extractFields = (item) => {
  const out = [];
  if (item.name) out.push(item.name);
  if (item.university) out.push(item.university);
  if (item.acronym) out.push(item.acronym);
  if (Array.isArray(item.altNames)) out.push(...item.altNames);
  if (Array.isArray(item.tags)) out.push(...item.tags);
  if (item.title) out.push(item.title); // posts
  if (item.webpageName) out.push(item.webpageName);
  return out;
};

// Returns a score: 2 = startsWith, 1 = includes, 0 = no match
const matchScore = (haystack, needle) => {
  if (!haystack || !needle) return 0;
  if (haystack.startsWith(needle)) return 2;
  if (haystack.includes(needle)) return 1;
  return 0;
};

export default function useSearchEngine(allResults = [], selectedFilters = []) {
  /**
   * Basic keyword search over all items (without applying filters)
   * - If q is empty -> return allResults
   */
  function search(q) {
    const needle = normalize(q);
    if (!needle) return allResults || [];

    const results = [];
    for (const item of allResults || []) {
      const fields = extractFields(item).map(normalize);
      let best = 0;
      for (const f of fields) {
        const s = matchScore(f, needle);
        if (s > best) best = s;
        if (best === 2) break; // early stop on strong match
      }
      if (best > 0) results.push(item);
    }
    return results;
  }

  /**
   * Search + apply selectedFilters
   * selectedFilters may include:
   *  - 'university', 'program', 'subject', 'destination', 'helpful-links'
   *  - 'review', 'blog', 'qna' (for posts via item.postType)
   */
  function filteredSearch(q) {
    const base = search(q);
    if (!selectedFilters || selectedFilters.length === 0) return [];

    return base.filter((item) => {
      if (item.type === "post" && item.postType) {
        return selectedFilters.includes(item.postType);
      }
      return selectedFilters.includes(item.type);
    });
  }

  /**
   * Generate up to 8 suggestion candidates for the given input.
   * Returns items like: { id, type, label, subtitle, score }
   */
  function generateSuggestions(input) {
    const q = normalize(input);
    if (!q) return [];

    const candidates = [];

    for (const item of allResults || []) {
      let best = 0;
      const fields = extractFields(item).map(normalize);

      for (const f of fields) {
        const s = matchScore(f, q);
        if (s > best) best = s;
        if (best === 2) break; // strong match
      }
      if (best === 0) continue;

      // type boost (optional)
      let typeBoost = 0;
      if (item.type === "university") typeBoost = 1.5;
      else if (item.type === "program") typeBoost = 1.2;

      const score = best + typeBoost;

      const label =
        item.name ||
        item.title ||
        item.webpageName ||
        (item.university ? `${item.university}${item.acronym ? " • " + item.acronym : ""}` : "Result");

      const subtitle =
        item.type === "program"
          ? item.university
          : item.type === "post"
          ? (item.postType || "post")
          : item.type;

      candidates.push({
        id: item.id ?? label,
        type: item.type || "result",
        label,
        subtitle,
        score,
      });
    }

    // sort by score then label; dedupe by (type:label)
    const uniq = new Map();
    candidates
      .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
      .forEach((c) => {
        const key = `${c.type}:${c.label}`;
        if (!uniq.has(key)) uniq.set(key, c);
      });

    return Array.from(uniq.values()).slice(0, 8);
  }

  return {
    search,
    filteredSearch,
    generateSuggestions,
  };
}