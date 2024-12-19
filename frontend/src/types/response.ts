export type MeteorologicalEventRecord = {
    event: {
        convective?: string | null; // Convective properties, if applicable.
        impacts?: ImpactCode[]; // Encoded string representing event impacts.
        no_injured?: number | null; // Number of injured persons, if reported.
        no_killed?: number | null; // Number of fatalities, if reported.
        precipitation_amount?: number | null; // Total precipitation amount, if available.
        qc_level: string; // Quality control level, e.g., "QC1".
        total_duration?: number | null; // Duration of the event in hours.
        time_creation: string; // ISO 8601 timestamp of the record's creation.
        time_last_revision: string; // ISO 8601 timestamp of the last revision.
        time_accuracy: string; // Accuracy of the time data, e.g., "3H".
        time_event: string; // ISO 8601 timestamp of the event's occurrence.
        event_description: string; // Description of the event.
        max_24_hour_precip?: number | null; // Maximum precipitation in 24 hours, if available.
        max_12_hour_precip?: number | null; // Maximum precipitation in 12 hours, if available.
        max_6_hour_precip?: number | null; // Maximum precipitation in 6 hours, if available.
        type_event: string; // Type of event, e.g., "PRECIP".
        except_elec_phenom?: string; // Exception for electrical phenomena, if applicable.
    }, 
    id: number; // Unique ID for the record.
    location:{
        coordinates: {
            latitude: number; // decimal degrees north latitude
            longitude: number; // Longitude of the event's location.
        },
        country: string; // Country code (ISO 3166-1 alpha-2 format).
        place: string; // Name of the place where the event occurred.
        place_local_language?: string | null; // Local-language name of the place, if available.
        place_accuracy: string; // Accuracy of the location data, e.g., "3KM".
        surface_crossed?: string | null; // Description of any crossed surfaces, if applicable.
        surface_initial_location?: string | null; // Initial surface impacted, if applicable.
        state?: string; // State or region of the event.
        detailed_location?: string | null; // Additional location details, if available.
    },
    source: {
        info_source: string; // Source(s) of information, e.g., WWW, TV, photos.
        contact: string; // Contact person or observer.
        ext_url?: string; // External URL for more information.
        reference: string; // Reference to a source or report.
        organisation?: string | null; // Organisation associated with the record.
        organisation_id?: string | null; // ID of the organisation, if any.
        creator_id: string; // ID of the record's creator.
        revisor_id: string; // ID of the person who revised the record.
        person_revision?: string | null; // Name of the revising person or entity.
        link_org?: string; // Associated organisation link.
        link_id?: string; // Link identifier.
        no_revision: number; // Number of revisions made to the record.
        deleted: string; // Deletion status, e.g., "N" for not deleted.
    }
};

export type MeteorologicalEventRecordFormated = {
    info_source: InfoSourceList
}
export enum InfoSource {
    NWSP = "NWSP", // A newspaper
    WWW = "WWW", // A website
    EMAIL = "EMAIL", // A report received by email
    TV = "TV", // A television or radio broadcast
    WXSVC = "WXSVC", // A weather service
    SPTR = "SPTR", // A storm spotter
    LIT = "LIT", // Scientific literature
    // OLIT = "OLIT", // Other literature
    EYEWTN = "EYEWTN", // An eyewitness
    DMGEYEWTN = "DMGEYEWTN", // An eyewitness of the damage
    EVTPHOTO = "EVTPHOTO", // A photo or video of the event
    DMGPHOTO = "DMGPHOTO", // A photo or video of the damage
    DMGSVY = "DMGSVY", // A damage survey by a severe weather expert
    GOV = "GOV", // Government-based sources / administrative organisations
  }
  
export type InfoSourceList = InfoSource[];

export type InfoSourceData = {
    code: InfoSource;
    description: string;
};

export const infoSourceData: InfoSourceData[] = [
    { code: InfoSource.NWSP, description: "A newspaper" },
    { code: InfoSource.WWW, description: "A website" },
    { code: InfoSource.EMAIL, description: "A report received by email" },
    { code: InfoSource.TV, description: "A television or radio broadcast" },
    { code: InfoSource.WXSVC, description: "A weather service" },
    { code: InfoSource.SPTR, description: "A storm spotter" },
    { code: InfoSource.LIT, description: "Scientific literature" },
    // { code: InfoSource.OLIT, description: "Other literature" },
    { code: InfoSource.EYEWTN, description: "An eyewitness" },
    { code: InfoSource.DMGEYEWTN, description: "An eyewitness of the damage" },
    { code: InfoSource.EVTPHOTO, description: "A photo or video of the event" },
    { code: InfoSource.DMGPHOTO, description: "A photo or video of the damage" },
    { code: InfoSource.DMGSVY, description: "A damage survey by a severe weather expert" },
    { code: InfoSource.GOV, description: "Government-based sources / administrative organisations" }
];



export enum RequestType {
    TIME = "TIME_BASED",
    QC = "QUALITY_CONTROL_BASED",
    LOCATION = "LOCATION_BASED",
    AREA = "AREA_BASED",
    EVENT = "EVENT_BASED",
}

export type GeoLocation = {
    lat: number;
    lon: number;
};

export enum QCLevel {
    // QC0 = "QC0",
    QC0_PLUS = "QC0+",
    QC1 = "QC1",
    QC2 = "QC2"
}

export const QCLevelDescriptions = {
    // [QCLevel.QC0]: {
    //     title: "As Received",
    //     description: "These events are reported as received, but their occurrence is uncertain, and the details are unverified."
    // },
    [QCLevel.QC0_PLUS]: {
        title: "Plausibility Check Passed",
        description: "These events are very likely to have occurred, but some details, such as their exact time, precise location, or report characteristics, are unknown or uncertain."
    },
    [QCLevel.QC1]: {
        title: "Report Confirmed by Reliable Source",
        description: "These events and reported contents have been confirmed."
    },
    [QCLevel.QC2]: {
        title: "Scientific Case Study",
        description: "These events and reported contents are confirmed and have been subject of a scientific case study."
    }
};

export type MeteorologicalEventRequest = {
    type: RequestType;
    filters: {
        time?: {
            start: string;
            end: string;
        },
        location?: {
            lat: number;
            lon: number;
            radius: number;
        },
        area?: {
            pointStart: GeoLocation;
            pointEnd: GeoLocation;
        },
        event?: {
            type: string;
        },
        qc?: {
            level: QCLevel;
        },
    }
};

export enum TimeAccuracy {
    '1M' = "1M", // up to 30 seconds earlier or later
    '5M' = "5M", // up to 2.5 minutes earlier or later
    '15M' = "15M", // up to 7.5 minutes earlier or later
    '30M' = "30M", // up to 15 minutes earlier or later
    '1H' = "1H", // up to 30 minutes earlier or later
    '3H' = "3H", // up to 1.5 hours earlier or later
    '6H' = "6H", // up to 3 hours earlier or later
    '12H' = "12H", // up to 6 hours earlier or later
    '1D' = "1D", // up to 12 hours earlier or later
    'GT1D' = "GT1D" // more than 12 hours earlier or later
}

export enum PlaceAccuracy {
    '1KM' = "1KM", // within 1 km of the reported location
    '3KM' = "3KM", // within 3 km of the reported location
    '5KM' = "5KM", // within 5 km of the reported location
    '10KM' = "10KM", // within 10 km of the reported location
    '20KM' = "20KM", // within 20 km of the reported location
    '50KM' = "50KM", // within 50 km of the reported location
    '100KM' = "100KM", // up to 100 km of the reported location
    'GT100KM' = "GT100KM" // possibly more than 100 km away from the reported location
}
/**
 * two-character country code according to the Appendix 
 */
export enum Country {

}

export enum ImpactCode {
    T1 = "T1", // Road(s) impassable or closed
    T2 = "T2", // Road(s) damaged or destroyed
    T3 = "T3", // Bridge(s) damaged or destroyed
    T4 = "T4", // Rail-/tram-/subway(s) unusable or closed
    T5 = "T5", // Rail-/tram-/subway infrastructure damaged
    T6 = "T6", // Rail-/tram-/subway vehicle(s) damaged or destroyed
    T7 = "T7", // Airport(s) closed (for more than an hour)
    T8 = "T8", // Aircraft damaged or destroyed
    T9 = "T9", // Ship(s) damaged or destroyed
    T10 = "T10", // Inhabited place(s) cut off from transport infrastructure
    I1 = "I1", // Power transmission damaged or destroyed
    I2 = "I2", // Telecommunication infrastructure damaged or destroyed
    H1 = "H1", // Damage (any damage)
    H2 = "H2", // Damage to roof(s) and/or chimney(s)
    H3 = "H3", // Roof(s) destroyed
    H4 = "H4", // Damage to window(s) and/or insulation layer(s)
    H5 = "H5", // Wall(s) (partly) collapsed
    H6 = "H6", // Building(s) (almost) fully destroyed
    H7 = "H7", // Basement(s) flooded
    H8 = "H8", // Flooding of ground floor
    H9 = "H9", // Flooding above ground floor
    V1 = "V1", // Car(s) damaged (any damage)
    V2 = "V2", // Car(s) dented
    V3 = "V3", // Car window(s) and/or windshield(s) broken
    V4 = "V4", // Car(s) damaged beyond repair
    V5 = "V5", // Car(s) lifted
    V6 = "V6", // Truck(s) and/or trailer(s) overturned
    W1 = "W1", // Tree(s) damaged
    W2 = "W2", // Large tree branch(es) broken
    W3 = "W3", // Tree(s) uprooted or snapped
    W4 = "W4", // Forest(s) damaged or destroyed
    A1 = "A1", // Crops/farmland damaged
    A2 = "A2", // Farmland flooded
    A3 = "A3", // Greenhouse(s) damaged or destroyed
    A4 = "A4", // Animal(s) killed
    E1 = "E1", // Land- or mudslide(s)
    E2 = "E2", // Fire as a consequence of the event
    E3 = "E3"  // Evacuation order by authorities
}

interface ImpactCodeData {
    code: ImpactCode;
    description: string;
}

export const impactCodeData: ImpactCodeData[] = [
    { code: ImpactCode.T1, description: "Road(s) impassable or closed" },
    { code: ImpactCode.T2, description: "Road(s) damaged or destroyed" },
    { code: ImpactCode.T3, description: "Bridge(s) damaged or destroyed" },
    { code: ImpactCode.T4, description: "Rail-/tram-/subway(s) unusable or closed" },
    { code: ImpactCode.T5, description: "Rail-/tram-/subway infrastructure damaged" },
    { code: ImpactCode.T6, description: "Rail-/tram-/subway vehicle(s) damaged or destroyed" },
    { code: ImpactCode.T7, description: "Airport(s) closed (for more than an hour)" },
    { code: ImpactCode.T8, description: "Aircraft damaged or destroyed" },
    { code: ImpactCode.T9, description: "Ship(s) damaged or destroyed" },
    { code: ImpactCode.T10, description: "Inhabited place(s) cut off from transport infrastructure" },
    { code: ImpactCode.I1, description: "Power transmission damaged or destroyed" },
    { code: ImpactCode.I2, description: "Telecommunication infrastructure damaged or destroyed" },
    { code: ImpactCode.H1, description: "Damage (any damage)" },
    { code: ImpactCode.H2, description: "Damage to roof(s) and/or chimney(s)" },
    { code: ImpactCode.H3, description: "Roof(s) destroyed" },
    { code: ImpactCode.H4, description: "Damage to window(s) and/or insulation layer(s)" },
    { code: ImpactCode.H5, description: "Wall(s) (partly) collapsed" },
    { code: ImpactCode.H6, description: "Building(s) (almost) fully destroyed" },
    { code: ImpactCode.H7, description: "Basement(s) flooded" },
    { code: ImpactCode.H8, description: "Flooding of ground floor" },
    { code: ImpactCode.H9, description: "Flooding above ground floor" },
    { code: ImpactCode.V1, description: "Car(s) damaged (any damage)" },
    { code: ImpactCode.V2, description: "Car(s) dented" },
    { code: ImpactCode.V3, description: "Car window(s) and/or windshield(s) broken" },
    { code: ImpactCode.V4, description: "Car(s) damaged beyond repair" },
    { code: ImpactCode.V5, description: "Car(s) lifted" },
    { code: ImpactCode.V6, description: "Truck(s) and/or trailer(s) overturned" },
    { code: ImpactCode.W1, description: "Tree(s) damaged" },
    { code: ImpactCode.W2, description: "Large tree branch(es) broken" },
    { code: ImpactCode.W3, description: "Tree(s) uprooted or snapped" },
    { code: ImpactCode.W4, description: "Forest(s) damaged or destroyed" },
    { code: ImpactCode.A1, description: "Crops/farmland damaged" },
    { code: ImpactCode.A2, description: "Farmland flooded" },
    { code: ImpactCode.A3, description: "Greenhouse(s) damaged or destroyed" },
    { code: ImpactCode.A4, description: "Animal(s) killed" },
    { code: ImpactCode.E1, description: "Land- or mudslide(s)" },
    { code: ImpactCode.E2, description: "Fire as a consequence of the event" },
    { code: ImpactCode.E3, description: "Evacuation order by authorities" }
];
