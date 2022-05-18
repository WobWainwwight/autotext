import {ChangeEvent, MouseEvent, MouseEventHandler, KeyboardEvent, useEffect, useRef, useState} from 'react'
import * as Automerge from 'automerge'
import './App.css'

type Card = {
  text: string
}

type State = {
  cards: Array<Card>
  focus: number
}

type D = {
  cards: Array<Card>
}

let doc = Automerge.init<D>()

enum Position {
  BEGINNING = "BEGINNING",
  END = "END",
}

type Index = number
type PositionIndex = Position | Index

function App() {
  const initState: State = {cards: [], focus: 0}
  const [state, setState] = useState(initState)
  const focusedInput = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    focusedInput?.current?.focus()
  }, [state])

  const addNewCard = (idx: number, card: Card, pos?: PositionIndex) => {
    doc = Automerge.change<D>(doc, doc => {
      if (!doc?.cards?.length) doc.cards = []
      if (pos === Position.END || !pos) doc.cards.push(card)
      if (pos === Position.BEGINNING) doc.cards.unshift(card)
      if (typeof pos === "number") doc.cards.splice(pos, 0, card)
    })
    setState(newState(idx, doc.cards.map(c => ({text: c.text}))))
  }

  const handleKeyUp = (e: KeyboardEvent<HTMLTextAreaElement>, cardIndex: number) => {
    if (e.key === "Backspace" && state.cards[cardIndex].text.trim() === "") {
      const focus = cardIndex === 0 ? cardIndex+1 : cardIndex-1

      doc = Automerge.change<D>(doc, doc => {
        doc?.cards?.splice(cardIndex, 1)
      })
      setState(newState(focus, removeAtIdx<Card>(state.cards, cardIndex)))
    }
  }

  const setText = (e: ChangeEvent<HTMLTextAreaElement>, cardIndex: number) => {
    e.preventDefault()
    doc = Automerge.change<D>(doc, doc => {
     doc.cards[cardIndex].text = e.target.value
    })
    setState(newState(state.focus, doc.cards.map(c => ({text: c.text}))))
  }

  const addCardInPosition = (position: string) => {
    if (position === "END") {
      state.cards.push({text:""})
      addNewCard(state.cards.length-1, {text:""}, Position.END)
    } else if (position === "BEGINNING") {
      addNewCard(0, {text:""}, Position.BEGINNING)
    }
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (e: MouseEvent) => {
    e.preventDefault()
    const textSpace = document.getElementById("text-space")
    if (!textSpace) {
      return
    }

    const mouseY = (e.clientY - e.movementY) - textSpace.getBoundingClientRect().top
    if (!textSpace.firstElementChild || !textSpace.lastElementChild) {
        addCardInPosition("BEGINNING")
        return
      }
      if (textSpace.firstElementChild.id === "click-prompt") {
        addCardInPosition("BEGINNING")
        return
      }
      if (mouseY<textSpace.firstElementChild.getBoundingClientRect().y) {
        addCardInPosition("BEGINNING")
        return
      }
      const {y, height} = textSpace.lastElementChild.getBoundingClientRect()
      if (mouseY>y+height) {
        addCardInPosition("END")
      }
  }

  return (
    <div className="App">
      <header className="App-header flex">
        <div>
          {JSON.stringify(doc)}
        </div>
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
const removeAtIdx = <T,>(cards: Array<T>, idx: number): Array<T> => {
  if (!cards.length) {
    return []
  }
  return [...cards.slice(0, idx), ...cards.slice(idx+1, cards.length)]

}


export default App
