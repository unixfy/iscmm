async function fetchExits(fetch) {
        // Overpass QL query to get all exits within our bounding box
    const exitsOverpassQuery = '[out:json][bbox:33.420838,-118.655301,34.342304,-117.117057];(way["junction:ref"]["destination"];>;node["highway"="motorway_junction"]["ref"];);out body;'

    // Fetch the data from Overpass API
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(exitsOverpassQuery)}`)
    const data = await response.json()

    // Get an array of the nodes
    // We filter out all the nodes that don't have a "ref" tag
    const nodes = data.elements.filter(element => element.type === 'node').filter(node => node.tags && node.tags.ref)
    // Get an array of the ways
    const ways = data.elements.filter(element => element.type === 'way')

    // Iterate through nodes and ways and join them on ref/junction:ref respectively
    // add the tags from the way to its relevant nodes
    for (const way of ways) {
        const ref = way.tags['junction:ref']
        if (ref) {
            const matchingNodes = nodes.filter(node => node.tags['ref'] === ref)
            for (const node of matchingNodes) {
                node.tags = {...node.tags, ...way.tags}
            }
        }
    }

    return nodes;
}

export async function load({fetch}) {


    return {
        streamed: {
            exits: fetchExits(fetch)
        }
    }
}