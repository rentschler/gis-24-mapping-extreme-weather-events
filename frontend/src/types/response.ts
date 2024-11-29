export type MeteorologicalEventRecord = {
    info_source: string; // Source(s) of information, e.g., WWW, TV, photos.
    time_creation: string; // ISO 8601 timestamp of the record's creation.
    latitude: number; // Latitude of the event's location.
    max_12_hour_precip?: number | null; // Maximum precipitation in 12 hours, if available.
    event_description: string; // Description of the event.
    contact: string; // Contact person or observer.
    time_last_revision: string; // ISO 8601 timestamp of the last revision.
    longitude: number; // Longitude of the event's location.
    ext_url?: string; // External URL for more information.
    reference: string; // Reference to a source or report.
    organisation?: string | null; // Organisation associated with the record.
    time_accuracy: string; // Accuracy of the time data, e.g., "3H".
    place_accuracy: string; // Accuracy of the location data, e.g., "3KM".
    max_24_hour_precip?: number | null; // Maximum precipitation in 24 hours, if available.
    impacts?: string; // Encoded string representing event impacts.
    organisation_id?: string | null; // ID of the organisation, if any.
    country: string; // Country code (ISO 3166-1 alpha-2 format).
    surface_initial_location?: string | null; // Initial surface impacted, if applicable.
    convective?: string | null; // Convective properties, if applicable.
    creator_id: string; // ID of the record's creator.
    no_revision: number; // Number of revisions made to the record.
    state: string; // State or region of the event.
    surface_crossed?: string | null; // Description of any crossed surfaces, if applicable.
    total_duration?: number | null; // Duration of the event in hours.
    revisor_id: string; // ID of the person who revised the record.
    person_revision: string; // Name of the revising person or entity.
    place: string; // Name of the place where the event occurred.
    type_event: string; // Type of event, e.g., "PRECIP".
    except_elec_phenom?: string; // Exception for electrical phenomena, if applicable.
    link_org?: string; // Associated organisation link.
    time_event: string; // ISO 8601 timestamp of the event's occurrence.
    place_local_language?: string | null; // Local-language name of the place, if available.
    precipitation_amount?: number | null; // Total precipitation amount, if available.
    no_injured?: number | null; // Number of injured persons, if reported.
    link_id?: string; // Link identifier.
    qc_level: string; // Quality control level, e.g., "QC1".
    id: number; // Unique ID for the record.
    detailed_location?: string | null; // Additional location details, if available.
    max_6_hour_precip?: number | null; // Maximum precipitation in 6 hours, if available.
    no_killed?: number | null; // Number of fatalities, if reported.
    deleted: string; // Deletion status, e.g., "N" for not deleted.
};
