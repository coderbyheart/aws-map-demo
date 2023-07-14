import { aws_location as Location, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

export class MapResources extends Construct {
  public readonly mapName: string;
  public readonly placesIndexName: string;

  constructor(parent: Stack, id: string) {
    super(parent, id);

    this.mapName = `${parent.stackName}-map`;
    new Location.CfnMap(this, "mapLight", {
      mapName: this.mapName,
      description: "Provides the map tiles (Esri Light Gray Canvas)",
      configuration: {
        style: "VectorEsriLightGrayCanvas",
      },
    });

    this.placesIndexName = `${parent.stackName}-index`;
    new Location.CfnPlaceIndex(this, "esriGeoCoder", {
      dataSource: "Esri",
      indexName: this.placesIndexName,
      dataSourceConfiguration: {
        intendedUse: "SingleUse",
      },
    });
  }
}
