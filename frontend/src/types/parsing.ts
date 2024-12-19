import { InfoSource, infoSourceData } from "./response";
import { ImpactCode, impactCodeData } from "./response";


export function parseInfoSource(input: string, delimiter: string = ";"): InfoSource[] {
    const validSources: Set<string> = new Set(Object.values(InfoSource));
    return input
      .split(delimiter) // Split by the specified delimiter (default is ";")
      .map((item) => item.trim()) // Trim any whitespace around each part
      .filter((item): item is InfoSource => validSources.has(item)); // Filter valid values
  }

export function getInfoSourceDescription(infoSource: InfoSource): string {
    const source = infoSourceData.find((item) => item.code === infoSource);
    return source ? source.description : "";
}
  
export function getImpactDescription(impactCode: ImpactCode): string {
    const impact = impactCodeData.find((item) => item.code === impactCode);
    return impact ? impact.description : "";
}

/**
 * Parses an impact code list into an array of ImpactCode values.
 * Each impact code is two or three characters long.
 * All available impact codes are defined in the ImpactCode enum.
 * @param input ImpactCodeList like [
  "H7",
  "H8"
]
 */
export function parseImpactCode(input: string[]): ImpactCode[] {
    const validCodes: Set<string> = new Set(Object.values(ImpactCode));
    return input
      .map((item) => item.trim()) // Trim any whitespace around each part
      .filter((item): item is ImpactCode => validCodes.has(item)); // Filter valid values
}


