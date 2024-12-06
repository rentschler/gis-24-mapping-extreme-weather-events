# Implementation Overview with Redux
To store all settings, query parameters, and visualization state in one centralized location we use [Redux](https://react-redux.js.org/introduction/getting-started).

Our state structure includes:

    Settings State: Stores user-selected options like toggles, dropdowns, and the year selector.
        - start, end date (date RangePicker )
        - show point events (check box)
        - show aggregated events / clusters (check box)
        - show summaries (check box)
        - hide events that miss a description (check box)
        - number of impacts (Range slider with min and max)
        - Impact Codes (multi selection dropdown)
        - QC level (multi selection dropdown)
        - Info Source (multi selection dropdown)
    Query State: Stores parameters for the data-fetching logic (e.g., filters, year, or resource type).
    Visualization State: Stores visualization settings influenced by fetched data or user options.


```js
// Example State Structure
{
  settings: {
    timeRange: [string, string], // date Format: 'YYYY-MM-DD'
    showPointEvents: boolean,
    showAggregatedEvents: boolean,
    showSummaries: boolean,
    hideEventsWithoutDescription: boolean,
    numberOfImpacts: [number, number],
    impactCodes: ImpactCode[] // enum, e.g., ['T1', 'T2']
    qcLevels: QCLevel[] // enum, e.g., ['QC0+', 'QC1']
    infoSources: InfoSource[] // enum, e.g., ['WWW', 'TV']
  },
  query: {
    filters: {
        startDate: string, // date Format: 'YYYY-MM-DD'
        endDate: string, // date Format: 'YYYY-MM-DD'
    },
    sort: 'asc',
    year: 2024,
  },
  visualization: {
    activeData: [],
    isLoading: false,
  },
}

```