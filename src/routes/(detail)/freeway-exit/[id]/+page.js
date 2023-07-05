import processOverpassQLQuery from "$lib/processOverpassQLQuery.js";

export async function load({params, fetch}) {
    const request = await processOverpassQLQuery(fetch, `[out:json][bbox:33.420838,-118.655301,34.342304,-117.117057];(node(${params.id});way(bn);rel(bw)["route"="road"];);out body;`, "exits")
    return {
        id: params.id,
        exit: request,
        title: "Exit " + request.ref
    }
}