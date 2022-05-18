import Automerge, {ChangeFn} from "automerge";
import {get, set} from "idb-keyval"

export type Card = {
    text: string
}

export type D = {
    cards: Array<Card>
}

let doc = Automerge.init<D>()

export const fetchLocalDoc = async (): Promise<D> => {
    try {
        const val = await get("auto-doc")
        doc = Automerge.load(val)
    } catch(e) {
        console.log("could not fetch auto-doc",e)
        return doc
    }
    return doc
}

const changeAndSave = (callback: ChangeFn<D>): D => {
    doc = Automerge.change<D>(doc, callback)
    console.log(doc, JSON.stringify(doc))
    const b = Automerge.save(doc)
    set("auto-doc", b)
        .then(() => console.log("saved automerged doc"))
        .catch((e) => console.log("failed to save", e))
    return doc
}

export const addCardInPosition = (card: Card, position: number): D => {
    doc = changeAndSave(doc => {
        if (!doc?.cards?.length) doc.cards = []
        doc.cards.splice(position, 0, card)
    })
    return doc
}

export const appendCardToDoc = (card: Card): D => {
    doc = changeAndSave(doc => {
        if (!doc?.cards?.length) doc.cards = []
        doc.cards.push(card)
    })
    return doc
}

export const deleteAtPosition = (position: number): D => {
    doc = changeAndSave(doc => {
        doc?.cards?.splice(position, 1)
    })
    return doc
}

export const setTextOnCard = (text: string, position: number): D => {
    doc = changeAndSave(doc => {
        doc.cards[position].text = text
    })
    return doc
}
