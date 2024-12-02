import { MeteorologicalEventRecord } from '../../types/response'
import { getImpactDescription, parseImpactCode } from '../../types/parsing'

interface MapPopupProps {
    record: MeteorologicalEventRecord
}
const MapPopup = ({record}:MapPopupProps) => {
  return (
    <div>
        <h1>{record.type_event + ' - ' +  record.qc_level}</h1>
        <p>{record.event_description}</p>
        <p>{record.time_event}</p>
        <p>no injured {record.no_injured}</p>
        <p>no dead {record.no_killed}</p>
        <a href={record.ext_url} target="_blank" rel="noreferrer">More info</a>
        <p> source : {record.info_source}</p>

        {record.impacts && (
            <div>
                <ul style={{ listStyleType: 'circle' }}>
                    {parseImpactCode(record.impacts).map((code) => (
                        <li key={code}>{getImpactDescription(code)}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  )
}

export default MapPopup