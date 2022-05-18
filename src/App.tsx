import {ChangeEvent, MouseEvent, MouseEventHandler, KeyboardEvent, useEffect, useRef, useState} from 'react'
import './App.css'
import {addCardInPosition, appendCardToDoc, Card, D, deleteAtPosition, fetchLocalDoc, setTextOnCard} from "./lib/automerge"


type State = {
  cards: Array<Card>
  focus: number
}

enum Position {
  BEGINNING = "BEGINNING",
  END = "END",
}

type Index = number
type PositionIndex = Position | Index

const BlankCard = {text: ""}

const getInitialState = (doc?: D): State => {
  if (doc?.cards?.length) {
    return {
      cards: doc.cards.map(c => ({text: c.text})),
      focus: 0
    }
  }
  return {cards: [], focus:0}
}
function App() {
  const [state, setState] = useState<State>(getInitialState())
  const focusedInput = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    console.log(state)
    focusedInput?.current?.focus()
  }, [state])

  useEffect(() => {
    const fetch = async () => {
      const doc = await fetchLocalDoc()
      console.log("effect", doc)
      if (doc) {
        setState(getInitialState(doc))
      }
    }
    fetch()
  },[])

  const addNewCard = (idx: number, card: Card, pos?: PositionIndex) => {
    const addCard = (): Array<Card> => {
      if (pos === Position.END || !pos) return appendCardToDoc(card).cards
      if (pos === Position.BEGINNING) return addCardInPosition(card, 0).cards
      if (typeof pos === "number") return addCardInPosition(card, pos).cards
      return []
    }
    const cards = addCard()
    setState(newState(idx, cards.map(c => ({text: c.text}))))
  }

  const handleKeyUp = (e: KeyboardEvent<HTMLTextAreaElement>, cardIndex: number) => {
    if (e.key === "Backspace" && state.cards[cardIndex].text.trim() === "") {
      const focus = cardIndex === 0 ? 0 : cardIndex-1

      const {cards} = deleteAtPosition(cardIndex)
      setState(newState(focus, cards))
    }
  }

  const setText = (e: ChangeEvent<HTMLTextAreaElement>, cardIndex: number) => {
    e.preventDefault()
    const {cards} = setTextOnCard(e.target.value, cardIndex)
    setState(newState(state.focus, cards.map(c => ({text: c.text}))))
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (e: MouseEvent) => {
    e.preventDefault()
    const textSpace = document.getElementById("text-space")
    if (!textSpace) {
      return
    }

    const mouseY = (e.clientY - e.movementY) - textSpace.getBoundingClientRect().top
    if (!textSpace.firstElementChild || !textSpace.lastElementChild) {
      addNewCard(0, BlankCard, Position.BEGINNING)
      return
    }
    if (textSpace.firstElementChild.id === "click-prompt") {
      addNewCard(0, BlankCard, Position.BEGINNING)
      return
    }
    if (mouseY<textSpace.firstElementChild.getBoundingClientRect().y) {
      addNewCard(0, BlankCard, Position.BEGINNING)
      return
    }
    const {y, height} = textSpace.lastElementChild.getBoundingClientRect()
    if (mouseY>y+height) {
      addNewCard(state.cards.length, BlankCard, Position.END)
    }
  }

  return (
    <div className="App">
      <header className="App-header flex">
        {/*<div>*/}
        {/*  {JSON.stringify(doc)}*/}
        {/*</div>*/}
        <div id={"text-space"} className={"flex flex-col justify-center min-w-[40%] min-h-screen p-y-5"} onClick={handleClick}>
          { !state.cards.length
              ? <p id={"click-prompt"} className={"text-gray-300/70"}>Click here</p>
              :  state.cards.map((c, i) =>
                     <textarea className="text-white bg-indigo-400/10 p-4 my-1"
                               placeholder={"type something"}
                               ref={state.focus === i ? focusedInput : null}
                               cols={40}
                               rows={c.text.split(/\r\n|\r|\n/).length}
                               key={i}
                               value={c.text}
                               onChange={(e) => setText(e, i)}
                               onMouseUp={(e) => setState(newState(i, state.cards))}
                               onKeyUp={(e) => handleKeyUp(e, i)}
                               onFocus={e => setState(newState(i, state.cards))}
                     />
              )
          }
        </div>
      </header>
    </div>
  )
}

const newState = (autofocus: number, cards: Array<Card>): State => {
  return { cards, focus: autofocus }

}


export default App
