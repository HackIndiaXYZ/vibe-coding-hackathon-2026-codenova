// test_parser.js
const text = `THIS AGREEMENT OF LEASE is made and executed on this 01st DAY OF NOVEMBER 2023 at Chennai,
BETWEEN Mrs. T.Shri Manoj (hereinafter referred to as LESSOR) residing at 3rd Main Road, Rajakilpakkam, CHENNAI
AND Mr. Thanikaimalai (hereinafter referred to as LESSEE) residing at 3rd Main Road, Rajakilpakkam, CHENNAI.
The lease is for 11 months starting from 01st Day of November 2023 to 30th September 2024.`;

function extractValidity(text) {
  const sentences = text.split(/[.!\n\r]+/).map(s => s.trim()).filter(s => s.length > 15);
  
  let startDate = 'Unknown';
  let endDate = 'Indefinite';
  let duration = 'As per contract specifications';

  // Added 'g' flag to the end of the regex
  const dateRegex = /\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:day\s+of\s+)?(?:January|February|March|April|May|June|July|August|September|October|November|December|[a-zA-Z]{3,9})\s+\d{4}|\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\b(?:January|February|March|April|May|June|July|August|September|October|November|December|[a-zA-Z]{3,9})\s+\d{1,2}(?:st|nd|rd|th)?\s*,\s*\d{4})\b/gi;

  const dateMatches = [];
  for (const s of sentences.slice(0, 25)) {
    const matches = s.match(dateRegex);
    if (matches) {
      dateMatches.push(...matches);
    }
  }
  console.log('Date Matches found:', dateMatches);

  if (dateMatches.length > 0) {
    startDate = dateMatches[0];
  }

  const termSentence = sentences.find(s => {
    const lower = s.toLowerCase();
    const matchesKeyword = /\b(?:term|period|tenure|duration|lease|valid|force|lock-in|agreement)\b/i.test(lower);
    const matchesUnit = /\b(?:month|year|week)s?\b/i.test(lower);
    return matchesKeyword && matchesUnit;
  });

  if (termSentence) {
    const durationMatch = termSentence.match(/\b\d+\s+(?:month|year|week)s?\b/i) || 
                          termSentence.match(/\bone\s+year|\btwo\s+years|\bthree\s+months|\beleven\s+months\b/i);
    if (durationMatch) {
      duration = durationMatch[0];
    } else {
      duration = termSentence.substring(0, 60) + '...';
    }
  }

  console.log('Start Date:', startDate);
  console.log('Duration:', duration);

  if (dateMatches.length >= 2) {
    const d1 = dateMatches[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Find the first date match that is different from d1
    const differentDate = dateMatches.slice(1).find(d => {
      return d.toLowerCase().replace(/[^a-z0-9]/g, '') !== d1;
    });

    if (differentDate) {
      endDate = differentDate;
    } else if (startDate !== 'Unknown' && duration !== 'As per contract specifications') {
      endDate = calculateEndDate(startDate, duration);
    }
  } else if (startDate !== 'Unknown' && duration !== 'As per contract specifications') {
    endDate = calculateEndDate(startDate, duration);
  }

  console.log('End Date:', endDate);

  return { startDate, endDate, duration };
}

function calculateEndDate(startStr, durationStr) {
  try {
    const cleaned = startStr
      .replace(/(\d+)(?:st|nd|rd|th)/gi, '$1')
      .replace(/day\s+of/gi, '')
      .trim();
    
    const date = new Date(cleaned);
    if (isNaN(date.getTime())) {
      return `Expires ${durationStr} after ${startStr}`;
    }

    const amount = parseInt(durationStr.match(/\d+/)?.[0] || '11');
    const isYear = durationStr.toLowerCase().includes('year');

    if (isYear) {
      date.setFullYear(date.getFullYear() + amount);
    } else {
      date.setMonth(date.getMonth() + amount);
    }

    date.setDate(date.getDate() - 1);

    const day = date.getDate();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const getSuffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1:  return 'st';
        case 2:  return 'nd';
        case 3:  return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getSuffix(day)} ${month} ${year}`;
  } catch (e) {
    return `Expires ${durationStr} after ${startStr}`;
  }
}

extractValidity(text);
