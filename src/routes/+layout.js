import processOverpassQLQuery from "$lib/processOverpassQLQuery.js";

export async function load({fetch}) {


    return {
        streamed: {
            exits: processOverpassQLQuery(fetch, "[out:json][bbox:33.420838,-118.655301,34.342304,-117.117057];(node[\"highway\"=\"motorway_junction\"][\"ref\"];way(bn););out body;", "exits"),
            rail: processOverpassQLQuery(fetch, `[out:json][bbox:33.420838,-118.655301,34.342304,-117.117057];(node["railway"="station"];);out body;`, "rail")
        }
    }
}