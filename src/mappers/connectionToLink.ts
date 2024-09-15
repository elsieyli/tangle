import { Doc, Id } from "../../convex/_generated/dataModel";
import { GraphData, Link } from "../components/data";
const connectionToLinks = (person: Doc<"people">, seen: Set<Id<"people">> ): Link[] => {
    const links = person.connected_to.map(p => {
        if (seen.has(p)) {
            return null
        }
        return {source: person._id, target: p, value: 2}
    }).filter(p => p)
    .map(l => {return {source: l!.source, target: l!.target, value: l!.value}})

    return links

}


export const connectionsToLinks = (people: Doc<"people">[]) => {
    var seen: Set<Id<"people">> = new Set()
    const links = people.flatMap(p => {
        const link = connectionToLinks(p, seen)
        seen.add(p._id)
        return link
    })
    return links
}

export const peopleToGraphData = (people: Doc<"people">[]): GraphData => {
    const links = connectionsToLinks(people)
    const nodes = people.map(p => ({id: p._id, name: p.name, notes: p.notes, embeddingId: p!.embedding_id!}))

    return {
        nodes: nodes,
        links: links,
    }
}