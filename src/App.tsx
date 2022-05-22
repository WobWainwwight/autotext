import './App.css'
import {ChangeEventHandler, FormEventHandler, useState} from "react";
import {TextEditor} from "./lib/TextEditor";


function App() {
    const [name, setName] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [invalidMessage, setInvalidMessage] = useState("")

    const handleChange:ChangeEventHandler<HTMLInputElement> = (e) => setName(e.target.value)

    const onSubmit:FormEventHandler = (e) => {
        e.preventDefault()
        if (name.length<5) {
            setInvalidMessage("Your name must be longer than 5 characters")
            return
        }
        setSubmitted(true)
    }
  return (
    <div className="App">
      <header className="App-header flex">
          {!submitted &&
              <form onSubmit={onSubmit}>
                  <input type="text"
                         placeholder={"What's your name?"}
                         value={name}
                         onChange={handleChange}
                         name={"actorName"}
                         className={"text-white bg-indigo-400/10 p-4 my-1 rounded-lg"}
                  />
                  <input type="submit" className={"bg-indigo-400 text-base p-3 rounded-lg uppercase font-semibold ml-3"} value="Submit"/>
                  {invalidMessage.length > 0 && <p className={"text-base text-red-700"}>{invalidMessage}</p>}
              </form>
          }
          {
              submitted && <TextEditor actorName={name}/>
          }
      </header>
    </div>
  )
}


export default App
