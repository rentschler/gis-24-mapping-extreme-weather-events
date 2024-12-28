import { MeteorologicalEventRecord } from '../../types/response'
import { getImpactDescription, getInfoSourceDescription } from '../../types/parsing'

interface MapPopupProps {
    record: MeteorologicalEventRecord
}
const MapPopup = ({record}:MapPopupProps) => {
  return (
    <div>
        <h1 className='text-decoration-underline'>{record.event.type_event + ' - ' +  record.event.qc_level}</h1>
        <p>{record.event.event_description}</p>
        <p>{record.event.time_event}</p>
        <p>no injured {record.event.no_injured || 0}</p>
        <p>no dead {record.event.no_killed || 0 }</p>
        <a href={record.source.ext_url} target="_blank" rel="noreferrer">More info</a>
        {record.source.info_source && (
            <div>
                <p>source: </p>
                <ul style={{ listStyleType: 'circle', marginLeft: '20px' }}>
                    {record.source.info_source.map((code) => (
                        <li key={code}>{getInfoSourceDescription(code)}</li>
                    ))}
                </ul>
            </div>
        )}{record.event.impacts && (
            <div>
                <p>impacts: </p>
                <ul style={{ listStyleType: 'circle', marginLeft: '20px' }}>
                    {record.event.impacts.map((code) => (
                        <li key={code}>{getImpactDescription(code)}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  )
}

export default MapPopup