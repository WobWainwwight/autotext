import {FC} from "react";
import {TextFeed} from "./TextFeed";

type TextEditorProps = {
    actorName: string
}


export const TextEditor: FC<TextEditorProps> = ({actorName}) => {


    return <div>
        <div className={"flex flex-col absolute top-2 left-2"}>
            <div className={"flex items-center"}>
                <div className={"bg-red-500 rounded-full w-4 h-4 m-3"}></div>
                <p className={"text-xlg text-red-500"}>{actorName}</p>
            </div>
        </div>
        <TextFeed actorName={actorName}/>
    </div>
}
