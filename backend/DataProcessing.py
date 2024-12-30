
def post_filter_rain(body, res):
    if body.filters.impactRange:
        
        min_bound = body.filters.impactRange[0]
        max_bound = body.filters.impactRange[1]
        
        filtered_list = [
            item for item in res
            if min_bound <= len(item.event.impacts or []) <= max_bound
        ]
        
        return filtered_list
    
    return res    

def post_filter_cluster(body, res):
    list = post_filter_rain(body, res)
    
    filtered_list = [
        item for item in list
        if item.cluster_id != None
    ]
    
    return filtered_list
    


def cluster_to_geojson(clusters):
    data = {
        "type": "FeatureCollection",
        "features": [],
    }
    
    for cluster in clusters:
        buffer = cluster.cluster_polygon.buffer(0.02)
        coordinates = list(buffer.exterior.coords)
        properties = cluster.__dict__
        if properties['cluster_id'] == None:
            continue
        properties.pop("cluster_polygon")
        
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [coordinates]
            },
            "properties": properties
        }
        data["features"].append(feature)
        
        
    
    return data