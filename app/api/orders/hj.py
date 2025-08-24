import requests

def reverse_geocode(lat, lon):
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {
        "lat": lat,
        "lon": lon,
        "format": "json",
        "addressdetails": 1
    }
    headers = {
        "User-Agent": "MyGeoApp/1.0 (your_email@example.com)"
    }

    response = requests.get(url, params=params, headers=headers)

    if response.status_code == 200:
        data = response.json()
        addr = data.get("address", {})

        # Pick only useful fields
        road = addr.get("road", "")
        neighbourhood = addr.get("neighbourhood", "")
        suburb = addr.get("suburb", "")
        city = addr.get("city", "")
        state = addr.get("state", "")
        pincode = addr.get("postcode", "")

        return {
            "road": road,
            "neighbourhood": neighbourhood,
            "suburb": suburb,
            "city": city,
            "state": state,
            "pincode": pincode
        }
    else:
        return {"error": f"Error: {response.status_code}"}


if __name__ == "__main__":
    # Example: Bangalore
    latitude = 12.9716
    longitude = 77.5946

    result = reverse_geocode(latitude, longitude)
    print(result)
