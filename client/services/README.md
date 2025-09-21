# Location Service Layer

A robust, extensible service layer for managing location data following SOLID principles and the repository pattern.

## Architecture

```
┌─────────────────┐
│   Components    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ LocationService │ ◄─── Business Logic Layer
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  IRepository    │ ◄─── Repository Interface
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│ Mock  │ │  API  │ ◄─── Repository Implementations
└───────┘ └───────┘
```

## Usage

### Basic Usage in React Components

```tsx
import { useEffect, useState } from "react";
import { locationService } from "@/services";
import type { LocationResult } from "../shared/api";

function LocationList() {
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        const data = await locationService.getAllLocations();
        setLocations(data);
      } catch (error) {
        console.error("Failed to load locations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {locations.map((location) => (
        <div key={location.title}>
          <h3>{location.title}</h3>
          <p>{location.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Search Functionality

```tsx
const handleSearch = async (searchTerm: string) => {
  const results = await locationService.searchLocations(searchTerm);
  setSearchResults(results);
};
```

### Filtering

```tsx
// Client-side filtering of already fetched data
const filtered = locationService.filterLocations(
  locations,
  "urban", // Location type filter
  ["outdoor", "permit"], // Attribute filters
);

// Or fetch filtered data from repository
const urbanLocations = await locationService.getLocationsByTag("urban");
const sunsetLocations = await locationService.getLocationsByBadge("sunset");
```

## Configuration

The service layer uses a configuration system that can be controlled via environment variables:

```env
# .env file
VITE_API_URL=https://api.example.com
MODE=production  # Will use API instead of mock data
```

### Switching Between Mock and API

```tsx
import { createLocationService } from "@/services";

// Force mock data (useful for testing)
const mockService = createLocationService(false);

// Force API usage
const apiService = createLocationService(true);

// Use config defaults (checks environment)
const defaultService = createLocationService();
```

## Service Methods

### ILocationService

- `getAllLocations()` - Get all available locations
- `searchLocations(searchTerm)` - Search by title, description, or tags
- `filterLocations(locations, locationFilter, attributeFilters)` - Client-side filtering
- `getLocationsByTag(tag)` - Get locations with specific tag
- `getLocationsByBadge(badge)` - Get locations with specific badge

### ILocationRepository

- `getLocations()` - Fetch all locations from data source
- `searchLocations(query)` - Server-side search
- `getLocationsByFilter(filter)` - Filter by location type
- `getLocationsByAttributes(attributes)` - Filter by attributes
- `getLocationById(id)` - Get specific location

## Testing

```bash
# Run all service tests
npm test client/services

# Run specific test file
npm test client/services/__tests__/locationService.test.ts
```

## Extending the Service

### Adding a New Repository

```typescript
import { ILocationRepository } from "./locationService";

export class CustomLocationRepository implements ILocationRepository {
  async getLocations(): Promise<LocationResult[]> {
    // Custom implementation
    return customDataSource.fetchLocations();
  }

  // Implement other required methods...
}

// Use custom repository
const service = new LocationService(new CustomLocationRepository());
```

### Adding New Service Methods

```typescript
class ExtendedLocationService extends LocationService {
  async getPopularLocations(): Promise<LocationResult[]> {
    const locations = await this.repository.getLocations();
    // Custom logic for popular locations
    return locations.filter(loc => /* popularity criteria */);
  }
}
```

## SOLID Principles Applied

1. **Single Responsibility**: Each class has one reason to change
   - LocationService: Business logic
   - Repositories: Data access
   - Config: Configuration management

2. **Open/Closed**: Open for extension, closed for modification
   - Easy to add new repositories without changing existing code
   - Service can be extended with new methods

3. **Liskov Substitution**: Repositories are interchangeable
   - Mock and API repositories implement same interface

4. **Interface Segregation**: Focused interfaces
   - ILocationService for business operations
   - ILocationRepository for data operations

5. **Dependency Inversion**: Depend on abstractions
   - Service depends on ILocationRepository interface, not concrete implementations

## Performance Considerations

- Mock data returns immediately (0ms delay configurable)
- API repository includes caching (5-minute TTL by default)
- Retry logic with exponential backoff for API failures
- Request timeout handling (30 seconds default)

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Offline support with IndexedDB
- [ ] GraphQL repository implementation
- [ ] Advanced caching strategies
- [ ] Pagination support
- [ ] Batch operations
