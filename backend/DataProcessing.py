
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