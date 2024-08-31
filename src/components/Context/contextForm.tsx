import ContextVariable from "../../classes/contextVariable.tsx";


export default function ContextForm(props: {context: ContextVariable | undefined}) {

    console.log(`Context Form props : ${props.context}`);


    return(
        <h1>Hi it context form</h1>
    )


}