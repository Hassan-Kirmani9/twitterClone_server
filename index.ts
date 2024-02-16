import { initServer } from "./src/app";


async function init(){
     const app = await initServer()
    app.listen(8000,()=>console.log("S")
        )
}

init()