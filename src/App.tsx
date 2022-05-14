import {ChangeEvent, MouseEvent, MouseEventHandler, useEffect, useRef, useState} from 'react'
import './App.css'

type Card = {
  text: string
}

type State = {
  cards: Array<Card>
  focus: number
}

const newState = (autofocus: number, cards: Array<Card>): State => {
  return { cards, focus: autofocus }
}

function App() {
  const initState: State = {cards: [], focus: 0}
  const [state, setState] = useState(initState)
  const focusedInput = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    console.log(state)
    focusedInput?.current?.focus()
  }, [state])

  const setText = (e: ChangeEvent<HTMLTextAreaElement>, cardIndex: number) => {
    console.log("setText", cardIndex)
    e.preventDefault()
    if (e.target.value === "") {
      return
    }
    const updated = state.cards[cardIndex]
    updated.text = e.target.value
    setState(newState(state.focus, [...state.cards.slice(0, cardIndex), updated, ...state.cards.slice(cardIndex+1, state.cards.length)]))
  }

  const addCardInPosition = (position: string) => {
    console.log("position",position)
    if (position === "END") {
      state.cards.push({text:""})
      setState(newState(state.cards.length-1, state.cards))
    } else if (position === "BEGINNING") {
      setState(newState(0, [{text:""}, ...state.cards]))
    }
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (e: MouseEvent) => {
    console.log("click")
      e.preventDefault()
      const textSpace = document.getElementById("text-space")
      if (!textSpace) {
        return
      }
      if (!textSpace.firstElementChild || !textSpace.lastElementChild) {
        addCardInPosition("BEGINNING")
        return
      }
      if (textSpace.firstElementChild.id === "click-prompt") {
        addCardInPosition("BEGINNING")
        return
      }
      if (e.clientY<textSpace.firstElementChild.getBoundingClientRect().y) {
        addCardInPosition("BEGINNING")
        return
      }
      const {y, height} = textSpace.lastElementChild.getBoundingClientRect()
      if (e.clientY>y+height) {
        addCardInPosition("END")
      }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div id={"text-space"} className={"flex flex-col justify-center min-w-[40%] min-h-screen p-y-5"} onClick={handleClick}>
          { !state.cards.length
              ? <p id={"click-prompt"} className={"text-gray-300/70"}>Click here</p>
              :  state.cards.map((c, i) =>
                  <textarea className="text-white bg-indigo-400/50 p-4 my-1"
                          placeholder={"type something"}
                          ref={state.focus === i ? focusedInput : null}
                          cols={40}
                          rows={c.text.split(/\r\n|\r|\n/).length}
                          key={i}
                          value={c.text}
                          onChange={(e) => setText(e, i)}
                          onClick={(e) => setState(newState(i, state.cards))}
                  />
              )
          }
        </div>
      </header>
    </div>
  )
}

export default App
