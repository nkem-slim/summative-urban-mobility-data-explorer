from typing import List

def sort_trip_records(data: List[dict], field: str) -> List[dict]:
    sorted_data = data.copy()
    
    # Bubble sort
    n = len(sorted_data)
    for i in range(n):
        for j in range(0, n - i - 1):
            # Compare the field values
            if sorted_data[j][field] > sorted_data[j + 1][field]:
                # Swap if they are in the wrong order
                sorted_data[j], sorted_data[j + 1] = sorted_data[j + 1], sorted_data[j]
    
    return sorted_data
