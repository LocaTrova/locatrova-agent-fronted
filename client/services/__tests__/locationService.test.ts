import { describe, it, expect, beforeEach } from "vitest";
import {
  LocationService,
  MockLocationRepository,
  type ILocationRepository,
} from "../locationService";
import type { LocationResult } from "../../../shared/api";

/**
 * Unit tests for LocationService
 * Tests the service layer independently from repositories
 */
describe("LocationService", () => {
  let repository: ILocationRepository;
  let service: LocationService;

  beforeEach(() => {
    repository = new MockLocationRepository();
    service = new LocationService(repository);
  });

  describe("getAllLocations", () => {
    it("should return all locations", async () => {
      const locations = await service.getAllLocations();
      expect(locations).toBeDefined();
      expect(Array.isArray(locations)).toBe(true);
      expect(locations.length).toBeGreaterThan(0);
    });

    it("should return LocationResult objects with correct structure", async () => {
      const locations = await service.getAllLocations();
      const firstLocation = locations[0];

      expect(firstLocation).toHaveProperty("title");
      expect(firstLocation).toHaveProperty("description");
      expect(firstLocation).toHaveProperty("imageUrl");
      expect(firstLocation).toHaveProperty("badge");
      expect(firstLocation).toHaveProperty("tags");
      expect(firstLocation).toHaveProperty("attributes");

      expect(firstLocation.attributes).toHaveProperty("indoor");
      expect(firstLocation.attributes).toHaveProperty("outdoor");
      expect(firstLocation.attributes).toHaveProperty("permit");
    });
  });

  describe("searchLocations", () => {
    it("should return all locations when search term is empty", async () => {
      const allLocations = await service.getAllLocations();
      const searchResults = await service.searchLocations("");

      expect(searchResults).toEqual(allLocations);
    });

    it("should filter locations by title", async () => {
      const results = await service.searchLocations("rooftop");

      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some((loc) => loc.title.toLowerCase().includes("rooftop")),
      ).toBe(true);
    });

    it("should filter locations by description", async () => {
      const results = await service.searchLocations("golden");

      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some((loc) => loc.description.toLowerCase().includes("golden")),
      ).toBe(true);
    });

    it("should filter locations by tags", async () => {
      const results = await service.searchLocations("urban");

      expect(results.length).toBeGreaterThan(0);
      expect(results.every((loc) => loc.tags.includes("urban"))).toBe(true);
    });

    it("should return all locations when search term is whitespace", async () => {
      // Arrange
      const allLocations = await service.getAllLocations();

      // Act
      const searchResults = await service.searchLocations("   ");

      // Assert
      expect(searchResults).toEqual(allLocations);
    });

    it("should be case-insensitive", async () => {
      // Arrange
      const searchTerm = "ROOFTOP";

      // Act
      const results = await service.searchLocations(searchTerm);

      // Assert
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some((loc) => loc.title.toLowerCase().includes("rooftop")),
      ).toBe(true);
    });
  });

  describe("filterLocations", () => {
    let allLocations: LocationResult[];

    beforeEach(async () => {
      allLocations = await service.getAllLocations();
    });

    it("should return all locations when filter is 'any'", () => {
      const filtered = service.filterLocations(allLocations, "any", []);
      expect(filtered).toEqual(allLocations);
    });

    it("should filter by location type", () => {
      const filtered = service.filterLocations(allLocations, "urban", []);

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((loc) => loc.tags.includes("urban"))).toBe(true);
    });

    it("should filter by single attribute", () => {
      const filtered = service.filterLocations(allLocations, "any", [
        "outdoor",
      ]);

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((loc) => loc.attributes.outdoor === true)).toBe(
        true,
      );
    });

    it("should filter by multiple attributes", () => {
      const filtered = service.filterLocations(allLocations, "any", [
        "outdoor",
        "permit",
      ]);

      expect(filtered.length).toBeGreaterThan(0);
      expect(
        filtered.every(
          (loc) =>
            loc.attributes.outdoor === true && loc.attributes.permit === true,
        ),
      ).toBe(true);
    });

    it("should combine location and attribute filters", () => {
      const filtered = service.filterLocations(allLocations, "urban", [
        "outdoor",
      ]);

      expect(filtered.length).toBeGreaterThan(0);
      expect(
        filtered.every(
          (loc) =>
            loc.tags.includes("urban") && loc.attributes.outdoor === true,
        ),
      ).toBe(true);
    });
  });

  describe("getLocationsByTag", () => {
    it("should return locations with specific tag", async () => {
      const results = await service.getLocationsByTag("industrial");

      expect(results.length).toBeGreaterThan(0);
      expect(results.every((loc) => loc.tags.includes("industrial"))).toBe(
        true,
      );
    });

    it("should return empty array for non-existent tag", async () => {
      const results = await service.getLocationsByTag("nonexistent");
      expect(results).toEqual([]);
    });
  });

  describe("getLocationsByBadge", () => {
    it("should return locations with specific badge", async () => {
      const results = await service.getLocationsByBadge("sunset");

      expect(results.length).toBeGreaterThan(0);
      expect(results.every((loc) => loc.badge === "sunset")).toBe(true);
    });

    it("should return empty array for non-existent badge", async () => {
      const results = await service.getLocationsByBadge("nonexistent");
      expect(results).toEqual([]);
    });
  });
});

/**
 * Test for MockLocationRepository
 */
describe("MockLocationRepository", () => {
  let repository: MockLocationRepository;

  beforeEach(() => {
    repository = new MockLocationRepository();
  });

  describe("getLocations", () => {
    it("should return array of locations", async () => {
      const locations = await repository.getLocations();
      expect(Array.isArray(locations)).toBe(true);
      expect(locations.length).toBe(6);
    });
  });

  describe("getLocationsByFilter", () => {
    it("should return all locations for 'any' filter", async () => {
      const allLocations = await repository.getLocations();
      const filtered = await repository.getLocationsByFilter("any");
      expect(filtered).toEqual(allLocations);
    });

    it("should filter by location type", async () => {
      const filtered = await repository.getLocationsByFilter("coastal");
      expect(filtered.every((loc) => loc.tags.includes("coastal"))).toBe(true);
    });
  });

  describe("getLocationsByAttributes", () => {
    it("should filter by indoor attribute", async () => {
      const filtered = await repository.getLocationsByAttributes({
        indoor: true,
      });
      expect(filtered.every((loc) => loc.attributes.indoor === true)).toBe(
        true,
      );
    });

    it("should filter by multiple attributes", async () => {
      const filtered = await repository.getLocationsByAttributes({
        outdoor: true,
        permit: false,
      });
      expect(
        filtered.every(
          (loc) =>
            loc.attributes.outdoor === true && loc.attributes.permit === false,
        ),
      ).toBe(true);
    });
  });

  describe("getLocationById", () => {
    it("should return location by title", async () => {
      const location = await repository.getLocationById(
        "Rooftop Terrace – City Skyline",
      );
      expect(location).toBeDefined();
      expect(location?.title).toBe("Rooftop Terrace – City Skyline");
    });

    it("should return null for non-existent ID", async () => {
      const location = await repository.getLocationById("NonExistent");
      expect(location).toBeNull();
    });
  });
});
