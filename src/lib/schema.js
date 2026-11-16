// Schema utility for generating JSON-LD structured data

const ORGANIZATION_INFO = {
  name: "Institute of Marketing & Management",
  alternateName: "IMM",
  url: "https://immindia.edu.in",
  logo: "https://immindia.edu.in/logo.svg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "B-11 Qutab Institutional Area",
    addressLocality: "New Delhi",
    postalCode: "110016",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-11-26520892",
    contactType: "Customer Service",
    email: "info@immindia.com",
    areaServed: "IN",
    availableLanguage: "English",
  },
  sameAs: [
    "https://www.facebook.com/immindia",
    "https://www.instagram.com/immindia",
    "https://www.linkedin.com/company/immindia",
    "https://twitter.com/immindia",
    "https://www.youtube.com/@immindia",
  ],
};

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    ...ORGANIZATION_INFO,
    description:
      "Institute of Marketing & Management (IMM) is a top-ranked MBA college in Delhi. Industry-focused curriculum, excellent placements, and strong alumni network.",
    foundingDate: "1969",
    educationalCredentialAwarded: "Post Graduate Diploma in Management (PGDM)",
    alumni: {
      "@type": "Alumni",
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Institute of Marketing & Management",
      },
    },
  };
}

export function generateCourseSchema(courseName, description, provider = ORGANIZATION_INFO) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: courseName,
    description: description,
    provider: {
      "@type": "EducationalOrganization",
      name: provider.name,
      url: provider.url,
    },
    educationalCredentialAwarded: "Diploma",
    courseCode: courseName,
    inLanguage: "en",
    availableLanguage: "English",
  };
}

export function generateProgramsSchema(path = "/programs") {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    ...ORGANIZATION_INFO,
    url: `https://immindia.edu.in${path}`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "IMM Programs",
      itemListElement: [
        {
          "@type": "Course",
          name: "Post Graduate Diploma in Management (PGDM)",
          description:
            "AICTE-approved PGDM programs at IMM Delhi. Specializations in Marketing, Finance, HR, International Business, and more.",
          provider: {
            "@type": "EducationalOrganization",
            name: ORGANIZATION_INFO.name,
          },
        },
        {
          "@type": "Course",
          name: "Bachelor of Business Administration (BBA)",
          description:
            "BBA program at IMM Delhi—gain industry-ready skills in marketing, management, and business strategy.",
          provider: {
            "@type": "EducationalOrganization",
            name: ORGANIZATION_INFO.name,
          },
        },
      ],
    },
  };
}

export function generateAdmissionSchema(path = "/admissions") {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    ...ORGANIZATION_INFO,
    url: `https://immindia.edu.in${path}`,
    applicationDeadline: "Ongoing",
    applicationUrl: "https://admissions.immindia.edu.in/",
    admissionRequirements: [
      "Bachelor's degree from a recognized university",
      "Valid CAT/XAT/MAT/CMAT/GMAT score",
      "Personal Interview",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "IMM Admissions",
      itemListElement: [
        {
          "@type": "Course",
          name: "Post Graduate Diploma in Management (PGDM)",
          applicationDeadline: "Ongoing",
        },
        {
          "@type": "Course",
          name: "Bachelor of Business Administration (BBA)",
          applicationDeadline: "Ongoing",
        },
      ],
    },
  };
}

export function generateBlogSchema(path = "/blog") {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "IMM Blog",
    description:
      "Explore the latest IMM blogs that inform and inspire students. Discover insights on education, entrance exams, research, career guidance, and more.",
    url: `https://immindia.edu.in${path}`,
    publisher: {
      "@type": "EducationalOrganization",
      ...ORGANIZATION_INFO,
    },
    inLanguage: "en",
  };
}

export function generateContactPageSchema(path = "/contact-us") {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Us - IMM",
    url: `https://immindia.edu.in${path}`,
    mainEntity: {
      "@type": "EducationalOrganization",
      ...ORGANIZATION_INFO,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-11-26520892",
          contactType: "Customer Service",
          email: "info@immindia.com",
          areaServed: "IN",
        },
        {
          "@type": "ContactPoint",
          telephone: "+91-9999078888",
          contactType: "Admissions",
          email: "admissions@immindia.edu.in",
          areaServed: "IN",
        },
      ],
    },
  };
}

export function generateAboutPageSchema(path = "/about") {
  // Generate page name based on path
  const pathSegments = path.split('/').filter(Boolean);
  const pageName = pathSegments.length > 1 
    ? pathSegments[pathSegments.length - 1].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    : "About Us";
  
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `${pageName} - IMM`,
    url: `https://immindia.edu.in${path}`,
    mainEntity: {
      "@type": "EducationalOrganization",
      ...ORGANIZATION_INFO,
      description:
        "Institute of Marketing & Management (IMM) is a top-ranked MBA college in Delhi. Industry-focused curriculum, excellent placements, and strong alumni network.",
      foundingDate: "1969",
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        value: "100+",
      },
    },
  };
}

export function generatePlacementSchema(path = "/placements") {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    ...ORGANIZATION_INFO,
    url: `https://immindia.edu.in${path}`,
    jobLocation: {
      "@type": "Place",
      address: ORGANIZATION_INFO.address,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: ORGANIZATION_INFO.name,
    },
    description:
      "IMM Delhi's campus recruitment success with top companies hiring from Institute of Marketing and Management. Discover placement stats, recruiters, and career opportunities at IMM.",
  };
}

export function generateEventSchema(eventName, description, startDate, endDate, location) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventName,
    description: description,
    startDate: startDate,
    endDate: endDate,
    location: location || {
      "@type": "Place",
      name: "Institute of Marketing & Management",
      address: ORGANIZATION_INFO.address,
    },
    organizer: {
      "@type": "EducationalOrganization",
      ...ORGANIZATION_INFO,
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };
}

export function generateEventsPageSchema(path = "/life-at-imm/events-and-activities") {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Events and Activities - IMM",
    url: `https://immindia.edu.in${path}`,
    description:
      "Discover vibrant life at IMM with exciting events, workshops, cultural activities, and industry interactions that enrich student experience and foster holistic development.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: {
        "@type": "Event",
        name: "IMM Events",
        description: "Various events, workshops, and activities at IMM",
        location: {
          "@type": "Place",
          name: "Institute of Marketing & Management",
          address: ORGANIZATION_INFO.address,
        },
        organizer: {
          "@type": "EducationalOrganization",
          ...ORGANIZATION_INFO,
        },
      },
    },
  };
}

