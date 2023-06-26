import getGo511Data from "$lib/getGo511Data.js";

export async function load({fetch}) {

    return {
        streamed: {
            go511Data: getGo511Data(fetch)
        }
    }
}