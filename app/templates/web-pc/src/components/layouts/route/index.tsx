import React, {Fragment, memo} from 'react';
import {Redirect, RedirectProps, Route, RouteProps, Switch} from "react-router";
import NoMatchedRoute from './NoMatched';

export const RouteNode = memo(({path, to, children, ...props}: RouteProps & { to?: string }) => {
    return to ? (
        <Fragment>
            <Route path={path} exact>
                <Redirect to={to}/>
            </Route>
            <Route path={path} {...props}>
                {children}
            </Route>
        </Fragment>
    ) : (
        <Route path={path} {...props}>
            {children}
        </Route>
    );
});

export const SwitchWith404 = memo(({children}) => {
    return (
        <Switch>
            {children}
            <NoMatchedRoute/>
        </Switch>
    );
});


