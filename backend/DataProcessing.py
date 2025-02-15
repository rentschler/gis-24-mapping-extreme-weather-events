from shapely.geometry import Point, MultiPoint, Polygon
import alphashape
import numpy as np

def post_filter_rain(body, res):
    if body.filters.impactRange:
        
        min_bound = body.filters.impactRange[0]
        max_bound = body.filters.impactRange[1]
        
        filtered_list = [
            item for item in res
            if min_bound <= len(item.event.impacts or []) and len(item.event.impacts or []) <= max_bound
        ]
        
        return filtered_list
    
    return res 

def post_filter_cluster(body, res):
    
    post_filter_list = post_filter_rain(body, res)
    
    filtered_list = [
        item for item in post_filter_list
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
    
    # filter out clusters with less then 5 item
    filtered = {}
    for group in grouped.keys():
        # print(f'{group} : number of items {len(grouped[group])}')
        if len(grouped[group]) > 4:
            filtered[group] = grouped[group]
    
    polygons = []
    
    for cluster_id in filtered.keys():
        
        geom_points = [point.location.geom for point in grouped[cluster_id]]
        
        multipoint = MultiPoint(geom_points)
        alpha = 4  # Adjust this value to control the level of detail
        geom_points = np.array([point.coords[0] for point in multipoint.geoms])
        polygon = alphashape.alphashape(geom_points, alpha)
        # polygon = polygon.buffer(10, join_style=1).buffer(-10.0, join_style=1)
        cluster = {
            "cluster_id": cluster_id,
            "cluster_polygon": polygon,
            "cluster_points": grouped[cluster_id]
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
        buffer = cluster.cluster_polygon.buffer(0.012)
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

def group_geometries(geometries):
    grouped = {
        geometry.polygon_id: []
        for geometry in geometries
    }
    
    for geometry in geometries:
        grouped[geometry.polygon_id].append(geometry)

    geometry_list = []
    
    for key, value in grouped.items():
        geometry_list.append({
            'polygon_id': key,
            'geometry_points': value
        })
    
    return geometry_list

def process_geometry(body, res):
    geometries = post_filter_rain(body, res)
    
    geometries_grouped = group_geometries(geometries)
    
    return geometries_grouped


def geometries_to_geojson(geometries_grouped):
    pass
    
def merge_with_geojson(body, geometries_grouped):
    geojsons = []

    for i, feature in enumerate(body.geojsons):
        polygon_id = str(i + 1)
        matched_geometry = next((item for item in geometries_grouped if item['polygon_id'] == polygon_id), None)

        geojsons.append({
            "type": "Feature",
            "properties": {**feature.properties, "geometry_points": matched_geometry['geometry_points'] if matched_geometry else []},
            "geometry": feature.geometry.dict()
        })
    
    return geojsons