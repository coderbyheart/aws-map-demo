import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "preact/hooks";
import "./Map.css";
import type { StyleSpecification } from "maplibre-gl";

const languages = {
  de: "Deutsch",
  en: "English",
  no: "Norsk",
};

export const Map = ({
  region,
  mapName,
  apiKey,
  placesIndexName,
}: {
  region: string;
  mapName: string;
  apiKey: string;
  placesIndexName: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map>();
  const [userLanguage, setUserLanguage] =
    useState<keyof typeof languages>("de");
  const [search, setSearch] = useState<string>("");
  const [center, setCenter] = useState<[number, number]>([
    10.437581513483195, 63.42148461054351,
  ]);
  const [searchResult, setSearchResult] = useState<SearchResult>();

  useEffect(() => {
    if (containerRef.current === null) return;

    // Manipulate the map style to use the preferred language
    // See https://github.com/aws-samples/amazon-location-samples/tree/main/react-map-gl-change-map-language?
    fetch(
      `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
    )
      .then<StyleSpecification>((res) => res.json())
      .then<StyleSpecification>((style) => ({
        ...style,
        layers: style.layers.map((layer) => {
          if ((layer?.layout as any)?.[`text-field`] !== undefined) {
            (layer.layout as any)["text-field"] = `{_name_${userLanguage}}`;
          }
          return layer;
        }),
      }))
      .then((style) => {
        const map = new maplibregl.Map({
          container: "map",
          style,
          center,
          zoom: 12,
          refreshExpiredTiles: false,
          trackResize: true,
          keyboard: false,
          renderWorldCopies: false,
        });

        setMap(map);
      });

    return () => {
      map?.remove();
    };
  }, [containerRef.current, userLanguage]);

  useEffect(() => {
    map?.flyTo({
      center,
    });
  }, [center]);

  return (
    <>
      <aside>
        <select
          onInput={(e) => {
            setUserLanguage(
              (e.target as HTMLSelectElement).value as keyof typeof languages,
            );
          }}
          value={userLanguage}
        >
          {Object.entries(languages).map(([k, v]) => (
            <option value={k}>{v}</option>
          ))}
        </select>
        <div>
          <p>
            <input
              type="text"
              value={search}
              id="search"
              placeholder="Search for a place ..."
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
            />
            <button
              type="button"
              onClick={() => {
                // See https://docs.aws.amazon.com/location/latest/APIReference/API_SearchPlaceIndexForText.html
                fetch(
                  `https://places.geo.${region}.amazonaws.com/places/v0/indexes/${placesIndexName}/search/text?key=${apiKey}`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      Text: search,
                      BiasPosition: center,
                      MaxResults: 10,
                      FilterCategories: ["MunicipalityType"],
                    }),
                  },
                )
                  .then<SearchResult>((res) => res.json())
                  .then(setSearchResult);
              }}
            >
              search
            </button>
          </p>
          {searchResult !== undefined &&
            (searchResult.Results.length ?? 0) > 0 && (
              <div>
                <ul>
                  {searchResult.Results.map(({ Place, Distance }) => (
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setCenter(Place.Geometry.Point);
                        }}
                      >
                        {Place.Label} ({Math.round(Distance / 1000)} km)
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </aside>
      <div id="map" ref={containerRef} />
    </>
  );
};

type SearchResult = {
  Summary: {
    Text: string; // e.g. "Offenbach";
    BiasPosition: [number, number]; // e.g. [10.437581513483195, 63.42148461054351];
    MaxResults: number; // e.g.;
    DataSource: "Esri";
    ResultBBox: [number, number, number, number]; // e.g. [7.55169, 49.19546, 8.825, 50.69892];
    FilterCategories: string[]; // e.g. ["MunicipalityType"], see https://docs.aws.amazon.com/location/latest/developerguide/category-filtering.html#place-categories
  };
  Results: {
    Place: {
      Label: string; // e.g. "Offenbach, Hessen, DEU";
      Geometry: {
        Point: [8.76647, 50.10061];
      };
      Municipality: string; // e.g. "Offenbach";
      SubRegion: string; // e.g. "Darmstadt";
      Region: string; // e.g. "Hessen";
      Country: string; // e.g. "DEU";
      Interpolated: boolean; // e.g. false;
      Categories: string[]; // e.g. ["MunicipalityType"], see https://docs.aws.amazon.com/location/latest/developerguide/category-filtering.html#place-categories
    };
    Distance: number; // e.g. 1486248.1759214115;
    Relevance: number; // e.g. 1;
  }[];
};
