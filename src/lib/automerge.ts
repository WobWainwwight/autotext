import Automerge, {ChangeFn} from "automerge";

export type Card = {
    text: string
}

type D = {
    cards: Array<Card>
}

let doc = Automerge.init<D>()


const changeAndSave = (callback: ChangeFn<D>): D => {
    doc = Automerge.change<D>(doc, callback)
    // save here
    console.log(doc, JSON.stringify(doc))
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
