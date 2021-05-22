import React from 'react';
import {SwitchWith404} from "@/components/layouts/route";
import {Route} from "react-router";

export default ()=>{
    return (
        <SwitchWith404>
            <Route exact path="/">
            </Route>
        </SwitchWith404>
    );
}