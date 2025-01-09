from shapely.geometry import Point, MultiPoint, Polygon

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


def group_clusters(clusters):
    
    grouped = {
        cluster.cluster_id: []
        for cluster in clusters
    }
    
    for cluster in clusters:
        grouped[cluster.cluster_id].append(cluster)
    
    polygons = []
    
    for cluster_id in grouped.keys():
        
        geom_points = [point.location.geom for point in grouped[cluster_id]]
        
        multipoint = MultiPoint(geom_points)
        # Generate a convex hull as the polygon, which is the smallest convex polygon that contains all points
        polygon = multipoint.convex_hull
        cluster = {
            "cluster_id": cluster_id,
            "cluster_polygon": polygon
        }
        
        polygons.append(cluster)
    
    
    return polygons

def process_cluster(body, res):
    clusters = post_filter_cluster(body, res)
    
    clusters_grouped = group_clusters(clusters)
    
    return clusters_grouped
    
    


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