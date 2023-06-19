import processOverpassQLQuery from "$lib/processOverpassQLQuery.js";

export async function load({params, fetch}) {
    return {
        id: params.id,
        streamed: {
            station: processOverpassQLQuery(fetch, `[out:json][bbox:33.420838,-118.655301,34.342304,-117.117057];node(${params.id})->.a;relation(bn.a)->.b;node(r.b:"stop")->.b;(relation(bn.b);relation(bn.a:"stop"););.a out body;out body;`, "rail_stations")
        }
    }
}