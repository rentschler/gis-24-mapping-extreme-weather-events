import { MeteorologicalEventRecord } from '../../types/response'
import { getImpactDescription, parseImpactCode } from '../../types/parsing'

interface MapPopupProps {
    record: MeteorologicalEventRecord
}
const MapPopup = ({record}:MapPopupProps) => {
  return (
    <div>
        <h1>{record.event.type_event + ' - ' +  record.event.qc_level}</h1>
        <p>{record.event.event_description}</p>
        <p>{record.event.time_event}</p>
        <p>no injured {record.event.no_injured}</p>
        <p>no dead {record.event.no_killed}</p>
        <a href={record.source.ext_url} target="_blank" rel="noreferrer">More info</a>
        <p> source : {record.source.info_source}</p>

        {record.event.impacts && (
            <div>
                <ul style={{ listStyleType: 'circle' }}>
                    {parseImpactCode(record.event.impacts).map((code) => (
                        <li key={code}>{getImpactDescription(code)}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  )
}

export default MapPopup